import React from 'react';
import styled from 'styled-components';

import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  const { data } = useSession();

  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        {data && data.user ? (
          <UserName>
            <p>{data.user.name}</p>
            <p onClick={() => signOut()}>logout</p>
          </UserName>
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
  cursor: pointer;
`;

const UserName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
