import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import axiosClient from 'libs/axios/axios';

import { Product } from 'types/product';

export const fetchProductDetail = async (id: string) => {
  const { data } = await axiosClient.get(`/products/${id}`);

  return data.data.product;
};

export const useGetProductDetailQuery = (id: string) => {
  const { push } = useRouter();

  return useQuery<Product>(['productDetail', id], () => fetchProductDetail(id), {
    onSuccess(data) {
      if (!data.thumbnail && !data.price) push('/404');
    },
    retry(failureCount) {
      if (!failureCount) push('/404');

      return true;
    },
  });
};
