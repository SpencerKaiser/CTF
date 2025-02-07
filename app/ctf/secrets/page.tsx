import { Flex, Title } from '@mantine/core';

export default function Secrets() {
  return (
    <Flex direction="column" align="center" gap="100">
      <Title>Dem secrets... never gonna give 'em up!</Title>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=JBIlw3NCt05F6WzA&autoplay=1&mute=1"
        title="YouTube video player"
        style={{ border: '0px' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </Flex>
  );
}
