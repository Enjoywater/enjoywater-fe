import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import axiosClient from 'libs/axios/axios';

import { ProductList } from 'types/product';

export const fetchProductList = async (page: string) => {
  const { data } = await axiosClient.get(`/products?page=${page}&size=10`);

  return data.data;
};

export const useGetProductListQuery = (page: string) => {
  const { push } = useRouter();

  return useQuery<ProductList>(['productList', page], () => fetchProductList(page), {
    keepPreviousData: true,
    retry(failureCount) {
      if (!failureCount) push('/404');

      return true;
    },
  });
};
