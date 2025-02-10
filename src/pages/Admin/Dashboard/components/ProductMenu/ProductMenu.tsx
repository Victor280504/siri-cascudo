import { Category as CategoryType, Product } from "../../../../../types/Products";
import Category from "./Category";

const ProductMenu = ({
  categories,
  products,
}: {
  categories: CategoryType[];
  products: Product[];
}) => {
  return (
    <>
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          products={products.filter(
            (product) => product.idCategory === category.id
          )}
        />
      ))}
    </>
  );
};

export default ProductMenu;