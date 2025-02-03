import { useMemo } from 'react';
import { Button, Flex } from '@mantine/core';
import { useUserStore } from '@/app/stores/UserStore';
import { LoginForm } from './LoginForm';

export const WelcomeCTA: React.FC = () => {
  const { user } = useUserStore();
  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <Flex justify="center" my={100}>
      {isAuthenticated ? <Button>Go see the fancy things...</Button> : <LoginForm />}
    </Flex>
  );
};
