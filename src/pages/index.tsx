import React from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';

import ProductList from 'components/ProductList';
import Pagination from 'components/Pagination';

import {
  fetchProductList,
  useGetProductListQuery,
} from 'libs/queries/ProductList/useGetProductListQuery';

import type { GetServerSideProps, NextPage } from 'next';

type HomePageProps = { page: string };

const HomePage: NextPage<HomePageProps> = ({ page }: HomePageProps) => {
  const { data: productList, isSuccess } = useGetProductListQuery(page);

  if (!isSuccess) return <div />;

  const { products, totalCount } = productList;
  return (
    <>
      <Container>
        <ProductList products={products} />
        <Pagination page={page} totalCount={totalCount} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { page } = context.query;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['productList', page], () => fetchProductList(page as string));

  return {
    props: {
      page: page || '1',
      dehydratedProps: dehydrate(queryClient),
    },
  };
};

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
`;
