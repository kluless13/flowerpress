import React, {useEffect} from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/scrapbook');
  }, [router]);

  return <div>Loading...</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/scrapbook',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
};

export default Home;