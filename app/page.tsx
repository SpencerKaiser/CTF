'use client';

import { useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Welcome } from '@/components/Welcome';

faker.seed(Date.now());

export default function HomePage() {
  useEffect(() => {
    console.info(faker.hacker.phrase());
  }, []);
  return <Welcome />;
}
