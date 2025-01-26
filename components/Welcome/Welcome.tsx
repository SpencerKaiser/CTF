'use client';

import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { Text, Title } from '@mantine/core';
import { User } from '@/src/schema/user';
import { PageSpinner } from '../PageSpinner';
import { WelcomeCTA } from './WelcomeCTA/WelcomeCTA';
import classes from './Welcome.module.css';

type UserFetchError = {
  error: 'unauthorized' | 'server-error';
};

const fetchUser = async (): Promise<User | UserFetchError> => {
  try {
    const { data } = await axios.get<User>('/api/users/me');
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.status === 401) {
      return { error: 'unauthorized' };
    }
  }
  return { error: 'server-error' };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Welcome = () => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUser(), sleep(750)]).then(([data]) => {
      if ('error' in data) {
        // TODO: redirect to error page
      } else {
        setUser(data);
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

      {isLoading ? <PageSpinner /> : <WelcomeCTA isAuthenticated={!!user} />}
    </>
  );
};
