import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Product } from '../types/product';

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product: { id, name, thumbnail, price } }: ProductItemProps) => {
  const { push } = useRouter();

  return (
    <Container onClick={() => push(`/products/${id}`)}>
      <Thumbnail>
        <Image alt='product' layout='fill' src={thumbnail ? thumbnail : '/defaultThumbnail.jpg'} />
      </Thumbnail>
      <Name>{name}</Name>
      <Price>{price.toLocaleString()}</Price>
    </Container>
  );
};

export default ProductItem;

const Container = styled.a`
  width: 180px;
  margin-left: 20px;
  margin-top: 20px;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #efefef;
`;

const Name = styled.div`
  margin-top: 8px;
  font-size: 16px;
`;

const Price = styled.div`
  margin-top: 4px;
`;
