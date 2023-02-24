export type Product = {
  id: string;
  name: string;
  thumbnail: string | null;
  price: number;
};

export type ProductList = {
  products: Product[];
  totalCount: number;
};
