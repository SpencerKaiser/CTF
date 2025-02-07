import { Badge, Card, Flex, Text } from '@mantine/core';
import { Bug } from '@/src/utils/bugs';

type BugCardProps = { bug: Bug };

export const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  const { name, title, description, style, styleColor } = bug;
  return (
    <Card shadow="md" radius="md" withBorder w={{ base: '90%', xs: '80%', sm: '400px' }}>
      <Flex justify="space-between" mb="xs" align="baseline" gap={15}>
        <Text fw={500}>{name}</Text>
        <Badge autoContrast color={styleColor} style={{ flexShrink: 0 }}>
          {style}
        </Badge>
      </Flex>

      <Text size="sm" c="dimmed">
        <Text span fw={800}>
          {title}
        </Text>{' '}
        - {description}
      </Text>
    </Card>
  );
};
