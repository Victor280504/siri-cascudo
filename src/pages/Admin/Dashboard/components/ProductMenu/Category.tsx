import {
  Category as CategoryType,
  Product,
} from "../../../../../types/Products";
import Item from "../../../../../components/ui/Item";
import styles from "../../Dashboard.module.css";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";

const Category = ({
  category,
  products,
}: {
  category: CategoryType;
  products: Product[];
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.category}>
      <Item.Row justifyContent="flex-start" alignItems="center" gap={"20px"}>
        <h2 className={styles.menu_title}>{category.name}</h2>
        <button className={`${styles.button} ${styles.active}`} style={{ padding: "0" }} onClick={() => navigate(`/admin/category/${category.id}`)}>
          <span className="material-symbols-outlined secondary md">
            chevron_right
          </span>
        </button>
      </Item.Row>
      <div className={styles.products}>
        {products.slice(0, 6).map((product) => (
          <ProductItem key={product.id} id={product.id}>
            <img src={product.image} alt={product.name} width={"40%"} />
            <Item.Text fontSize={"16px"} textAlign="center" fontWeight={"bold"} margin={0}>
              {product.name}
            </Item.Text>
          </ProductItem>
        ))}
      </div>
    </div>
  );
};

export default Category;
