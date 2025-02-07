'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertTriangle } from '@tabler/icons-react';
import axios from 'axios';
import { Button, Code, Container, Flex, Text, Title } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { PageSpinner } from '@/components/PageSpinner';
import { Bug } from '@/src/utils/bugs';
import { useUserStore } from '../stores/UserStore';
import { BugCard } from './BugCard/BugCard';

type BugGetResponse = {
  bugs: Bug[];
  nextCursor: number | null;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchBugs = async ({ cursor }: { cursor?: number } = {}) => {
  const { data } = await axios.get<BugGetResponse>('/api/bug?limit=50', {
    params: cursor !== undefined ? { cursor } : {},
  });
  return data;
};

export default function Bugs() {
  const { user } = useUserStore();
  const router = useRouter();
  const pageLoadedRef = useRef(false);

  const { ref, inViewport } = useInViewport();

  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | undefined | null>(undefined);

  const fetchAndSetBugs = async () => {
    setIsLoading(true);
    try {
      const [{ bugs: newBugs, nextCursor: newNextCursor }] = await Promise.all([
        await fetchBugs(nextCursor !== null ? { cursor: nextCursor } : {}),
        sleep(1000),
      ]);

      setBugs([...bugs, ...newBugs]);
      setNextCursor(newNextCursor);
    } catch (error) {
      alert('An unexpected error occurred');
    }

    pageLoadedRef.current = true;
    setIsLoading(false);
  };

  useEffect(() => {
    if (pageLoadedRef.current && isLoading) return;

    if (!pageLoadedRef.current) {
      // Initial load
      void fetchAndSetBugs();
    }

    if (pageLoadedRef.current && inViewport && nextCursor !== null) {
      // The page has loaded, the bottom section has scrolled back into view, and items remain
      void fetchAndSetBugs();
    }
  }, [isLoading, inViewport, nextCursor, bugs]);

  return (
    <Flex direction="column" align="center" gap={30} p={30}>
      <Title order={1}>Bugs</Title>

      <Text c="dimmed" ta="center">
        There have always been bugs and there will always be bugs. Herein lies a list of bugs, some
        of which can be exploited.
      </Text>

      <Text c="dimmed" size="xs" fs="italic">
        Gotta <Code>git push --force</Code> them all.
      </Text>

      {!user && (
        <Button
          leftSection={<IconAlertTriangle size={14} />}
          radius={20}
          onClick={() => {
            router.push('/');
          }}
          variant="outline"
        >
          Sign in to view restricted items
        </Button>
      )}

      <Flex w="100%" justify="center" align="stretch" wrap="wrap" gap={30}>
        {bugs.map((bug, index) => (
          <BugCard key={index} bug={bug} />
        ))}

        <Flex>
          {!isLoading && (
            <Flex direction="column" gap={100} py={50}>
              <Text h="100" ta="center">
                Scroll to load more...
              </Text>
              <Container ref={ref} />
            </Flex>
          )}
          {isLoading && <PageSpinner />}
        </Flex>
      </Flex>
    </Flex>
  );
}
