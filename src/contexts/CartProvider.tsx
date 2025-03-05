import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { Product } from "../types/Products";

export interface CartItem {
  idProduct: string;
  name: string;
  value: number;
  quantity: number;
  available: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
}

export interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "REMOVE_ONE_ITEM" | "CLEAR_CART";
  payload?: CartItem;
}

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      if (
        action.payload
      ) {
        const existingItem = state.items.find(
          (item) => item.idProduct === action.payload!.idProduct
        );
        if (existingItem) {
          return {
            ...state,
            items: state.items.map((item) =>
              item.idProduct === action.payload!.idProduct
                ? { ...item, quantity: item.quantity + 1 > item.available ? item.available : item.quantity + 1 }
                : item
            ),
          };
        }
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity > action.payload.available ? action.payload.available : action.payload.quantity }],
        };
      }
      return state;
    case "REMOVE_ITEM":
      if (action.payload) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.idProduct !== action.payload!.idProduct
          ),
        };
      }
      return state;
    case "REMOVE_ONE_ITEM":
      if (action.payload) {
        const existingItem = state.items.find(
          (item) => item.idProduct === action.payload!.idProduct
        );
        if (existingItem && existingItem.quantity > 1) {
          return {
            ...state,
            items: state.items.map((item) =>
              item.idProduct === action.payload!.idProduct
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        } else {
          return {
            ...state,
            items: state.items.filter(
              (item) => item.idProduct !== action.payload!.idProduct
            ),
          };
        }
      }
      return state;
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      dispatch({ type: "CLEAR_CART" });
      JSON.parse(cart).forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
