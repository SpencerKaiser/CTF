import { IconSquare, IconSquareCheck } from '@tabler/icons-react';
import { Flex, Progress, Text, Title } from '@mantine/core';
import { Challenge } from '@/src/types/Challenge';

type ChallengeDetailsProps = Challenge;

const iconSize = 60;

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({
  title,
  description,
  numTasks,
  numTasksAccomplished,
}) => {
  const challengeProgress = numTasksAccomplished / numTasks;

  return (
    <Flex gap={10} align="center" w="100%">
      {challengeProgress >= 1 ? (
        <IconSquareCheck color="green" size={iconSize} />
      ) : (
        <IconSquare color="grey" size={iconSize} />
      )}

      <Flex direction="column" w="100%">
        <Title order={3}>{title}</Title>
        <Text c="dimmed">{description}</Text>
        <Progress value={challengeProgress * 100} animated w="100%" />
      </Flex>
    </Flex>
  );
};
