import { useQuery } from 'react-query';

import axiosClient from 'libs/axios/axios';
import { ProductList } from 'types/product';

export const fetchProductList = async (page: string) => {
  const { data } = await axiosClient.get(`/products?page=${page}&size=10`);

  return data.data;
};

export const useGetProductListQuery = (page: string) =>
  useQuery<ProductList>(['productList', page], () => fetchProductList(page), {
    keepPreviousData: true,
  });
