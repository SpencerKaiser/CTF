import { Flex, Loader } from '@mantine/core';

export const PageSpinner: React.FC = () => {
  return (
    <Flex m={100} justify="center">
      <Loader color="blue" size="xl" />
    </Flex>
  );
};
