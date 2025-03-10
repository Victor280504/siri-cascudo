export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  available: number;
  price: number;
  idCategory: number;
}

export interface Category {
  id: number;
  name: string;
}
