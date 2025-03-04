import styles from "./Dashboard.module.css";
import { Logo, Sirigueijo } from "../../../assets";
import MenuNav from "./components/MenuNav/MenuNav";
import {
  ProductButtons,
  StockButtons,
} from "./components/ProductMenu/ProductButtons";
import ProductMenu from "./components/ProductMenu/ProductMenu";
import { useQuery } from "@tanstack/react-query";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import Navbar from "./components/MenuNav/Navbar";
import Item from "../../../components/ui/Item";
import StockMenu from "./components/Stock/StockMenu";
import ingredientService from "../../../services/ingredientService";

type MenuContentProps = "report" | "delivery" | "products" | "stock" ;

const Dashboard = () => {
  const urlPath = window.location.pathname;
  const lastParam = urlPath.substring(urlPath.lastIndexOf("/") + 1);

  console.log();

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products/all"],
    queryFn: async () => await productService.getAll(),
  });

  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category/all"],
    queryFn: async () => await categoryService.getAll(),
  });

  const {
    data: ingredient,
    isLoading: ingredientLoading,
    isError: ingredientError,
  } = useQuery({
    queryKey: ["ingredient/all"],
    queryFn: async () => await ingredientService.getAll(),
  });

  const actualObject = {
    report: {
      name: "Relatório",
      buttons: <div>Relatorio Buttons</div>,
      content: <div>Relatorio Content</div>,
    },
    delivery: {
      name: "Pedidos",
      buttons: <div>Pedidos Buttons</div>,
      content: <div>Pedidos Content</div>,
    },
    products: {
      name: "Produtos",
      buttons: <ProductButtons />,
      content: <ProductMenu categories={category} products={products} />,
    },
    stock: {
      name: "Estoque",
      buttons: <StockButtons />,
      content: <StockMenu ingredients={ingredient} />,
    },
  };

  if (productsLoading || categoryLoading || ingredientLoading) {
    return <div>Loading...</div>;
  }

  if (productsError || categoryError || ingredientError) {
    return <div>Error...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navMenuDiv}>
        <div className={styles.navLogo}>
          <img src={Logo} alt="Logo" height={150} />
        </div>
        <Navbar />
      </div>
      {lastParam != "admin" ? (
        <div className={styles.content_container}>
          <MenuNav name={actualObject[lastParam as MenuContentProps]?.name}>
            {actualObject[lastParam as MenuContentProps]?.buttons}
          </MenuNav>
          {actualObject[lastParam as MenuContentProps]?.content}
        </div>
      ) : (
        <div
          style={{
            width: "75%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Item.Text
            fontFamily="SFCompact"
            fontSize={60}
            fontWeight="bold"
            color="#8260d7"
            textAlign="center"
            alignSelf="center"
            marginLeft={"5%"}
          >
            Bem vindo Administrador!
          </Item.Text>
          <img src={Sirigueijo} alt="" style={{ maxWidth: "50%" }} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
