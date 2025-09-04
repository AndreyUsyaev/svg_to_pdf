import { useState, useRef } from 'react';
import { Center, Container, FileButton, Button, Group, Text } from '@mantine/core';
import { IconUpload, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const resetRef = useRef(null);
  const clearFile = () => {
    let btn;
    setFile(null);
    (btn = resetRef.current) === null || btn === void 0 ? void 0 : btn.call(resetRef);
  };

  const showErrorNotification = (err) => {
    console.log(err)
    notifications.show({
      color: 'red',
      title: ' Error',
      message: err,
      position: 'top-center',
    })
  };
  const handleUpload = async (selectedFile) => {
    setFile(selectedFile);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile); // Rails ожидает params[:file]

    try {
      const response = await fetch('/api/v1/convert_to_pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorNotification(errorData.error);
        throw new Error('Error during converting.');
      }

      const response_json = await response.json()
      setResult(response_json)
    } catch (err) {
      setFile(null);
      clearFile()
    }
  };

  const handleDownload = () => {
    if (!result?.pdf_url) return;

    const link = document.createElement('a');
    link.href = result.pdf_url;
    link.download = result.pdf_name;
    link.click();
  };

  return (
    <>
      <Center style={{ height: '50vh' }}>
        <Container strategy="grid" size={500}>
          <Group justify="center" mb={20}>
            <Text fw={700}>Generate PDF from SVG</Text>
          </Group>
          <Group justify="center">
            <FileButton resetRef={resetRef} variant="outline" color="black" leftSection={<IconUpload size={14} />} onChange={handleUpload} accept="image/svg+xml">
              {(props) => <Button {...props}>Upload SVG</Button>}
            </FileButton>
          </Group>
          {result && (
            <Group justify="center" mt={20}>
              <Button onClick={handleDownload} leftSection={<IconDownload size={14} />}>Export PDF</Button>
            </Group>
          )}
        </Container>
      </Center>
    </>
  );
}
