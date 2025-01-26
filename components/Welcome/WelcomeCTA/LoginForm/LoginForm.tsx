import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { Button, Flex, Input, InputWrapper, Text } from '@mantine/core';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<
    'missingFields' | 'badCredentials' | undefined
  >();

  useEffect(() => {
    // Reset failed to submit state when username or password changes
    setSubmissionError(undefined);
  }, [username, password]);

  const submit = async () => {
    if (!username || !password) {
      setSubmissionError('missingFields');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/auth/login', {
        username,
        password,
      });
    } catch (error) {
      if (isAxiosError(error) && error.status === 401) {
        setSubmissionError('badCredentials');
      } else {
        alert('An unexpected error occurred');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Flex direction="column" justify="center" gap={20}>
      <InputWrapper label="Username">
        <Input
          value={username}
          placeholder="Mr. Anderson"
          type="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          disabled={isSubmitting}
          error={submissionError}
        />
      </InputWrapper>

      <InputWrapper label="Password">
        <Input
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          disabled={isSubmitting}
          error={submissionError}
        />
      </InputWrapper>

      <Button variant="filled" onClick={() => submit()} loading={isSubmitting}>
        Login
      </Button>

      {submissionError && (
        <Text c="red" ta="center">
          {submissionError === 'badCredentials'
            ? 'Invalid credentials; please try again'
            : 'All fields are required'}
        </Text>
      )}
    </Flex>
  );
};
