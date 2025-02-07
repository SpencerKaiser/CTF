'use client';

import { Text, Title } from '@mantine/core';
import { useUserStore } from '@/app/stores/UserStore';
import { PageSpinner } from '../PageSpinner';
import { WelcomeCTA } from './WelcomeCTA/WelcomeCTA';
import classes from './Welcome.module.css';

export const Welcome = () => {
  const { isLoading } = useUserStore();

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
