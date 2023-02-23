import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { signOut, useSession } from 'next-auth/react';

function Layout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && pathname === '/login') push('/');
  }, [status, pathname, push]);

  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        {data && data.user ? (
          <div>
            <p>{data.user.name}</p>
            <p onClick={() => signOut()}>logout</p>
          </div>
        ) : (
          <Link href='/login'>
            <p>login</p>
          </Link>
        )}
      </Header>
      {children}
    </>
  );
}

export default Layout;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Title = styled.p`
  font-size: 48px;
`;
