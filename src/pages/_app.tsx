import { useState } from 'react';
import type { AppProps } from 'next/app';
import styled from 'styled-components';
import { SessionProvider } from 'next-auth/react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import Layout from 'components/Layout';
import GlobalStyle from 'styles/GlobalStyle';

import setupMSW from 'api/setup';

setupMSW();

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedProps}>
        <SessionProvider session={pageProps.session}>
          <GlobalStyle />
          <Background />
          <Content>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Content>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;

const Background = styled.div`
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: #f0f0f5;
`;

const Content = styled.div`
  width: 420px;
  min-height: 100%;
  margin: 0 auto;
  background-color: #fff;
`;
