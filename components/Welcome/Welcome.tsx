'use client';

import { useEffect, useState } from 'react';
import { Text, Title } from '@mantine/core';
import { useUserStore } from '@/app/stores/UserStore';
import { PageSpinner } from '../PageSpinner';
import { WelcomeCTA } from './WelcomeCTA/WelcomeCTA';
import classes from './Welcome.module.css';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Welcome = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([useUserStore.getState().init(), sleep(750)]).then(([response]) => {
      const { error } = response ?? {};
      if (error === 'server-error') {
        // TODO: redirect to error page
        alert('Unexpected error occurred');
      }

      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'green', to: 'blue' }}>
          The Secret Dev Club
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This is where all the fancy development knowledge be stored.
      </Text>

      {isLoading ? <PageSpinner /> : <WelcomeCTA />}
    </>
  );
};
