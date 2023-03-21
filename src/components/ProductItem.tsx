import styled from 'styled-components';

import Link from 'next/link';
import Image from 'next/image';

import { Product } from 'types/product';

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product: { id, name, thumbnail, price } }: ProductItemProps) => {
  return (
    <Link href={`/products/${id}`}>
      <Container>
        <Thumbnail>
          <Image
            priority
            alt='product'
            layout='fill'
            src={thumbnail ? thumbnail : '/defaultThumbnail.jpg'}
          />
        </Thumbnail>
        <Name>
          <p>{name}</p>
        </Name>
        <Price>
          <p>{price.toLocaleString()}원</p>
        </Price>
      </Container>
    </Link>
  );
};

export default ProductItem;

const Container = styled.div`
  width: 180px;
  margin-left: 20px;
  margin-top: 20px;
  cursor: pointer;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #efefef;
`;

const Name = styled.div`
  margin-top: 8px;

  p {
    font-size: 16px;
  }
`;

const Price = styled(Name)`
  margin-top: 4px;
`;
