'use client';

import { useRouter } from 'next/navigation';
import { IconHome, IconLogout, IconStar } from '@tabler/icons-react';
import { Burger, Flex, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '../../app/stores/UserStore';

const iconSize = 14;

export const NavBar: React.FC = () => {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  return (
    <Flex w="full" justify="end" pr={20}>
      <Menu shadow="md" width={200} onClose={toggle} opened={opened}>
        <Menu.Target>
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              router.push('/');
            }}
            leftSection={<IconHome size={iconSize} />}
          >
            Home
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              router.push('/ctf');
            }}
            leftSection={<IconStar size={iconSize} />}
          >
            CTF Challenge
          </Menu.Item>

          {!!useUserStore().user && (
            <Menu.Item
              onClick={() => {
                router.push('/logout');
              }}
              leftSection={<IconLogout size={iconSize} />}
            >
              Logout
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
