import React from 'react';
import { signIn } from 'next-auth/react';
import { NextPage } from 'next';

const SignIn: NextPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn('credentials')}>Sign In</button>
    </div>
  );
};

export default SignIn;