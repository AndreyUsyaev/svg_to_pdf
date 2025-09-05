import { useState, useEffect, useRef } from 'react';
import { Loader, Center, Container, FileButton, Button, Group, Text, Textarea, Stack} from '@mantine/core';
import { IconUpload, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function HomePage() {
  const [file, setFile] = useState('');
  const [svgText, setSvgText] = useState(null)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const resetRef = useRef(null);
  const textArea = useRef(null);

  const [aiReady, setAiReady] = useState(false)
  const [aiResponse, setAiResponse] = useState('')

  const aiRole = "PROMPT Your task is just take user's SVG file and change it like he describes. " +
                        "In answer provide only SVG code inside such tags <begin> <end>. PROMPT";

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        setAiReady(true);
        clearInterval(checkReady)
      }
    }, 300)
    return () => clearInterval(checkReady)
  }, []);
  const clearFile = () => {
    let btn;
    setFile(null);
    (btn = resetRef.current) === null || btn === void 0 ? void 0 : btn.call(resetRef);
  };

  const showErrorNotification = (err) => {
    notifications.show({
      color: 'red',
      title: ' Error',
      message: err,
      position: 'top-center',
    })
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) {
      return
    }

    setResult(null)
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSvgText(event.target.result);
    };
    reader.readAsText(selectedFile);
  }
  const handleUpload = async () => {
    setLoading(true)
    const aiMsg= await handleAiChat();

    const formData = new FormData();
    formData.append('file', file);
    if (aiMsg) {
      formData.append('ai_response', aiMsg);
    }

    try {
      const response = await fetch('/api/v1/convert_to_pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        showErrorNotification(errorData.error);
        throw new Error('Error during converting.');
      }

      const response_json = await response.json()
      setResult(response_json)
    } catch (err) {
      setFile(null);
      clearFile()
    } finally {
      setLoading(false)
    }
  };

  const handleDownload = () => {
    if (!result?.pdf_url) return;

    const link = document.createElement('a');
    link.href = result.pdf_url;
    link.download = result.pdf_name;
    link.click();
  };

  const handleAiChat = async () => {
    const usrMsg = textArea.current?.value.trim()
    if (!usrMsg) {
      return null
    }
    const msg = `${aiRole}
                        User SVG:
                        <begin>${svgText}<end>
                        User request:
                        ${textArea.current?.value}`
    try{
      const response = await window.puter.ai.chat(msg, {model: 'grok-beta'});
      setAiResponse(response.message.content);
      return response.message.content
    }catch(err){
      showErrorNotification('Something went wrong with AI.');
      console.log(err)
      return null
    }
  }

  return (
    <>
      <Center style={{ height: '50vh' }}>
        <Container strategy="grid" size={500}>
          <Group justify="center" mb={20}>
            <Text fw={700}>Generate PDF from SVG</Text>
          </Group>
          <Group justify="center">
            <FileButton resetRef={resetRef} variant="outline" color="black" leftSection={<IconUpload size={14} />} onChange={handleFile} accept="image/svg+xml">
              {(props) => <Button {...props}>Upload SVG</Button>}
            </FileButton>
          </Group>
          {file && (
            <>
              <Text size="sm" ta="center" mt="sm">
                Picked file: {file.name}
              </Text>
              <Stack justify="center" align="center" mt={20}>
                { aiReady && (
                  <Textarea autosize
                            ref={textArea}
                            miw={400}
                            minRows={3}
                            maxRows={7}
                            size="md"
                            label="AI Chat"
                            placeholder="Ask ai to modify your SVG file i.e. Change color to red. Or leave it empty"/>
                )}
                <Button maw={100} color="blue" onClick={handleUpload}>Send</Button>
                {loading && (
                  <Group justify="center" mt={20}>
                    <Loader color="blue" />
                  </Group>
                )}
                {result && (
                    <Button color="black" onClick={handleDownload} leftSection={<IconDownload size={14} />}>Export PDF</Button>
                )}
              </Stack>
            </>
          )}
        </Container>
      </Center>
    </>
  );
}
