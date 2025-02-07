import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex } from '@mantine/core';
import { useUserStore } from '@/app/stores/UserStore';
import { LoginForm } from './LoginForm';

export const WelcomeCTA: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <Flex justify="center" my={100}>
      {isAuthenticated ? (
        <Button
          onClick={() => {
            router.push('/bugs');
          }}
        >
          Go see the fancy things...
        </Button>
      ) : (
        <LoginForm />
      )}
    </Flex>
  );
};
