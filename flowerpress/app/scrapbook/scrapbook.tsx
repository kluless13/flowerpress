import React from 'react';
import { useSession, getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Scrapbook from '/Users/angad/flowerpress/pages/components/Scrapbook';

const ScrapbookPage: React.FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <Scrapbook />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default ScrapbookPage;