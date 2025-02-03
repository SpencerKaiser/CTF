import { useEffect, useMemo, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { Button, Flex, Input, InputWrapper, Text } from '@mantine/core';
import { useUserStore } from '@/app/stores/UserStore';
import { tempPasswordSuffix } from '@/src/utils';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<
    'missingFields' | 'badCredentials' | 'hasTempPassword' | undefined
  >();
  const submissionErrorMessage = useMemo(() => {
    if (submissionError === 'missingFields') return 'All fields are required';
    if (submissionError === 'badCredentials') return 'Invalid credentials; please try again';
    if (submissionError === 'hasTempPassword')
      return `Your password has been reset; use the temporary password (last name followed by "${tempPasswordSuffix}")`;
  }, [submissionError]);

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
      await useUserStore.getState().init();
    } catch (error) {
      if (isAxiosError(error) && error.status === 401) {
        const hasTempPassword =
          (error.response?.headers['x-temp-password'] as undefined | string)?.toLowerCase() ===
          'true';
        setSubmissionError(hasTempPassword ? 'hasTempPassword' : 'badCredentials');
      } else {
        alert('An unexpected error occurred');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Flex
      direction="column"
      justify="center"
      gap={20}
      onKeyUp={(e) => e.key === 'Enter' && submit()}
      w={{ base: '80%', sm: '60%', md: '400px' }}
    >
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
          autoComplete="off"
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
          autoComplete="off"
        />
      </InputWrapper>

      <Button variant="filled" onClick={() => submit()} loading={isSubmitting}>
        Login
      </Button>

      {submissionError && (
        <Text c="red" ta="center">
          {submissionErrorMessage}
        </Text>
      )}
    </Flex>
  );
};
