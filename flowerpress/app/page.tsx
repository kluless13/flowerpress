// app/page.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/scrapbook');
      } else {
        router.push('/auth/signin');
      }
    });
  }, [router]);

  return <div>Loading...</div>;
};

export default HomePage;
