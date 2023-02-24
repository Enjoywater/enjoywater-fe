import { useQuery } from 'react-query';

import axiosClient from 'libs/axios/axios';

import { Product } from 'types/product';

export const fetchProductDetail = async (id: string) => {
  const { data } = await axiosClient.get(`/products/${id}`);

  return data.data.product;
};

export const useGetProductDetailQuery = (id: string) =>
  useQuery<Product>(['productDetail', id], () => fetchProductDetail(id));
