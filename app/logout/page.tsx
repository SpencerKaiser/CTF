'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { PageSpinner } from '@/components/PageSpinner';
import { useUserStore } from '../stores/UserStore';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    axios
      .post('/api/auth/logout')
      .then(() => {
        useUserStore.getState().reset();
        notifications.show({
          message: 'See ya next time! 👋',
          position: 'top-center',
        });
        router.push('/');
      })
      .catch(() => {
        alert('Failed to log out');
      });
  }, []);

  return <PageSpinner />;
}
