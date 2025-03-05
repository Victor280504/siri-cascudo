import { useContext } from "react";
import { CartContext, CartItem } from "../contexts/CartProvider";
import { Product } from "../types/Products";

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const getCartProducById = (id: string) => {
    return context.state.items.find((item) => item.idProduct === id);
  };

  const productToCartItem = (product: Product, quantity: number): CartItem => {
    return {
      idProduct: product.id,
      name: product.name,
      value: product.price,
      available: product.available,
      quantity: quantity,
      product,
    };
  };

  const addToCart = (item: CartItem) => {
    context.dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (item: CartItem) => {
    context.dispatch({ type: "REMOVE_ITEM", payload: item });
  };

  const removeOneFromCart = (item: CartItem) => {
    context.dispatch({ type: "REMOVE_ONE_ITEM", payload: item });
  };

  const clearCart = () => {
    context.dispatch({ type: "CLEAR_CART" });
  };

  const productSubTotal = (product: CartItem) => {
    return product.value * product.quantity;
  };

  const cartTotal = () => {
    return context.state.items.reduce((acc, item) => {
      return acc + productSubTotal(item);
    }, 0);
  };

  return {
    cart: context.state,
    addToCart,
    removeFromCart,
    removeOneFromCart,
    productSubTotal,
    getCartProducById,
    clearCart,
    cartTotal,
    productToCartItem,
  };
};

export default useCart;
