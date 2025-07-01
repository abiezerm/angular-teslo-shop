import { User } from "../../auth/types";

export type ProductResponse ={
  count: number;
  pages: number;
  products: Product[];
}

export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  images: string[];
  user: User;
}

export enum Size {
  L = 'L',
  M = 'M',
  S = 'S',
  XL = 'XL',
  XS = 'XS',
  XXL = 'XXL',
}

export enum Gender {
  Kid = 'kid',
  Men = 'men',
  Women = 'women',
  Unisex = 'unisex',
}
