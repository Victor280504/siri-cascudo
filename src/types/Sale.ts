import { Product } from "./Products";

export type Sale = {
  id: number;
  date: Date;
  paymentMethod: string;
  idUser: number;
  total: number;
};

export type Sales = {
  id: number;
  idUser: number;
  date: Date;
  paymentMethod: string;
  total: number;
  products: Array<{
    product: Product;
    quantity: number;
    value: number;
  }>;
};

export interface Report {
  weeklyReport: WeeklyReport[];
  monthlyReport: MonthlyReport[];
}

export interface WeeklyReport {
  date: string;
  totalOrders: number;
  revenue: number;
  expenses: number;
  profit: number;
  comparison: number;
}

export interface MonthlyReport {
  date: string;
  totalOrders: number;
  revenue: number;
  expenses: number;
  profit: number;
  comparison: number;
}
