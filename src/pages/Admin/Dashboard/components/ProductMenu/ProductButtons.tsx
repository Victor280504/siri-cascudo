import { useNavigate } from "react-router-dom";
import styles from "../../Dashboard.module.css";

export const ProductButtons = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        className={styles.button_item_selected}
        onClick={() => navigate("/admin/products/new")}
      >
        <span className="material-symbols-outlined primary sd">add</span>
        Adicionar Produto
      </button>
      <button
        className={styles.button_item_inactive}
        onClick={() => navigate("/admin/category/new")}
      >
        <span className="material-symbols-outlined secondary sd">add</span>
        Adicionar Categoria
      </button>
    </>
  );
};

export const StockButtons = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        className={styles.button_item_selected}
        style={{ width: "100%", padding: "15px" }}
        onClick={() => navigate("/admin/stock/new")}
      >
        <span className="material-symbols-outlined primary sd">add</span>
        Adicionar Ingrediente
      </button>
    </>
  );
};
