'use client';

import { IconFlagFilled } from '@tabler/icons-react';
import { Container, Flex, FlexProps, Text, Title } from '@mantine/core';
import { PageSpinner } from '@/components/PageSpinner';
import { useChallengeStore } from '../stores/ChallengeStore';
import { ChallengeDetails } from './ChallengeDetails/ChallengeDetails';

const sectionProps: FlexProps = {
  direction: 'column',
  gap: 25,
  align: 'center',
  w: { base: '100%', sm: '80%' },
  maw: 800,
};

export default function CTF() {
  const { challenges, isLoading } = useChallengeStore();

  return (
    <Flex direction="column" gap={100} justify="center" align="center" mx={20} mt={50}>
      <Flex {...sectionProps}>
        <Title>
          CTF <IconFlagFilled />
        </Title>
        <Container>
          <Text c="dimmed">
            Welcome to the CTF challenge! Use teamwork, critical thinking, and reverse engineering
            to gain access to sensitive information and make it publicly accessible.{' '}
          </Text>
        </Container>
      </Flex>

      <Flex {...sectionProps}>
        <Flex direction="column" align="center">
          <Title order={2}>Challenges</Title>
          <Text c="dimmed" size="xs" fs="italic">
            Data refreshes automatically
          </Text>
        </Flex>
        {isLoading ? (
          <PageSpinner />
        ) : (
          challenges.map((challenge) => <ChallengeDetails key={challenge.title} {...challenge} />)
        )}
      </Flex>
    </Flex>
  );
}
