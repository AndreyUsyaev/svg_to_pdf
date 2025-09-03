import { useState, useRef } from 'react';
import { Center, Container, FileButton, Button, Group, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
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

  const showErrorNotification = () => {
    notifications.show({
      color: 'red',
      title: ' Error',
      message: 'Something went wrong',
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
        body: formData,
        headers: {
          // Обычно CSRF-токен нужен для Rails, если это сессия
          //'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        },
      });

      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

      // если сервер возвращает PDF как blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);

    } catch (err) {
      showErrorNotification();
      setFile(null);
      clearFile()
    } finally {
    }
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
            <Text size="sm" ta="center" mt="sm">
              Picked file: {file.name}
            </Text>
          )}
        </Container>
      </Center>
    </>
  );
}
