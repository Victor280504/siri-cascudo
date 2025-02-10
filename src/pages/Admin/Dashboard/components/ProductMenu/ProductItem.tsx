import { PropsWithChildren } from "react";
import styles from "../../Dashboard.module.css";
import { NavLink } from "react-router-dom";

const ProductItem = ({ children, id }: PropsWithChildren & { id: string }) => {
  return (
    <NavLink to={`/admin/products/${id}`} className={`${styles.product}`}>
      {children}
    </NavLink>
  );
};

export default ProductItem;
