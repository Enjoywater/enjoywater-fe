import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { signOut, useSession } from 'next-auth/react';

function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

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

  p {
    :last-child {
      cursor: pointer;
    }
  }
`;

const Title = styled.p`
  font-size: 48px;
`;
