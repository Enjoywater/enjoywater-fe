import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import axiosClient from 'libs/axios/axios';

import { Product } from 'types/product';

type DetailFetchDataType = {
  data: {
    product: Product;
  };
};

export const fetchProductDetail = async (id: string) => {
  const { data } = await axiosClient.get<DetailFetchDataType>(`/products/${id}`);

  const { product } = data.data;
  const { thumbnail, price } = product;

  if (!thumbnail && !price) throw Error('Product Not Found');

  return product;
};

export const useGetProductDetailQuery = (id: string) => {
  const { replace } = useRouter();

  return useQuery<Product>(['productDetail', id], () => fetchProductDetail(id), {
    onError() {
      replace('/404');
    },
    retry(failureCount) {
      if (!failureCount) replace('/404');

      return true;
    },
  });
};
