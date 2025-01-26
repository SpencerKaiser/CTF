import { Button, Flex } from '@mantine/core';
import { LoginForm } from './LoginForm';

type WelcomeCTAProps = {
  isAuthenticated: boolean;
};
export const WelcomeCTA: React.FC<WelcomeCTAProps> = ({ isAuthenticated }) => {
  return (
    <Flex justify="center" my={100}>
      {isAuthenticated ? <Button>Go see the fancy things...</Button> : <LoginForm />}
    </Flex>
  );
};
