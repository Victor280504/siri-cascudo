import { useNavigate } from "react-router-dom";
import styles from "../../Dashboard.module.css";

const ProductButtons = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        className={styles.button_item_selected}
        onClick={() => navigate("/admin/products")}
      >
        <span className="material-symbols-outlined primary sd">add</span>
        Adicionar Produto
      </button>
      <button
        className={styles.button_item_inactive}
        onClick={() => navigate("/admin/category")}
      >
        <span className="material-symbols-outlined secondary sd">add</span>
        Adicionar Categoria
      </button>
    </>
  );
};

export default ProductButtons;