import React from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';

import {
  fetchProductDetail,
  useGetProductDetailQuery,
} from 'libs/queries/ProductDetail/useGetProductDetailQuery';
import type { GetServerSideProps, NextPage } from 'next';

const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: product } = useGetProductDetailQuery(id as string);

  if (!product) return <div />;

  return (
    <>
      <Thumbnail src={product.thumbnail ? product.thumbnail : '/defaultThumbnail.jpg'} />
      <ProductInfoWrapper>
        <Name>{product.name}</Name>
        <Price>{product.price}원</Price>
      </ProductInfoWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['productDetail', id], () => fetchProductDetail(id as string));

  return {
    props: {
      dehydratedProps: dehydrate(queryClient),
    },
  };
};

export default ProductDetailPage;

const Thumbnail = styled.img`
  width: 100%;
  height: 420px;
`;

const ProductInfoWrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Price = styled.div`
  font-size: 18px;
  margin-top: 8px;
`;
