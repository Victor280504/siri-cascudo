export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  quantity: string;
  price: number;
  idCategory: number;
}

export interface Category {
  id: number;
  name: string;
}
