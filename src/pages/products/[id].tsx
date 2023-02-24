import React from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';

import Image from 'next/image';

import {
  fetchProductDetail,
  useGetProductDetailQuery,
} from 'libs/queries/ProductDetail/useGetProductDetailQuery';

import type { GetServerSideProps, NextPage } from 'next';

type ProductDetailProps = { id: string };

const ProductDetailPage: NextPage<ProductDetailProps> = ({ id }: ProductDetailProps) => {
  const { data: product, isSuccess } = useGetProductDetailQuery(id);

  if (!isSuccess) return <div />;

  const { thumbnail, name, price } = product;
  return (
    <>
      <Thumbnail>
        <Image alt='product' layout='fill' src={thumbnail || '/defaultThumbnail.jpg'} />
      </Thumbnail>
      <ProductInfoWrapper>
        <Name>{name}</Name>
        <Price>
          <p>{price.toLocaleString()}원</p>
        </Price>
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
      id,
      dehydratedProps: dehydrate(queryClient),
    },
  };
};

export default ProductDetailPage;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
`;

const ProductInfoWrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const Price = styled.div`
  margin-top: 8px;

  p {
    font-size: 18px;
  }
`;
