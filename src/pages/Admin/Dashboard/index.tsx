import { useState } from "react";
import styles from "./Dashboard.module.css";
import navStyles from "../../../components/navigation/Navbar/Navbar.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { Logo, ProfileWB } from "../../../assets";
import UserPopover from "../../../components/navigation/Popover";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import MenuNav from "./components/MenuNav/MenuNav";
import MenuNavItem from "./components/MenuNav/MenuNavItem";
import ProductButtons from "./components/ProductMenu/ProductButtons";
import ProductMenu from "./components/ProductMenu/ProductMenu";
import { useQuery } from "@tanstack/react-query";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";

type MenuContentProps =
  | "Relatorio"
  | "Pedidos"
  | "Produtos"
  | "Estoque"
  | "Receitas";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [actualContent, setActualContent] =
    useState<MenuContentProps>("Relatorio");
  const navigate = useNavigate();

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

  const actualObject = {
    Relatorio: {
      buttons: <div>Relatorio Buttons</div>,
      content: <div>Relatorio Content</div>,
    },
    Pedidos: {
      buttons: <div>Pedidos Buttons</div>,
      content: <div>Pedidos Content</div>,
    },
    Produtos: {
      buttons: <ProductButtons />,
      content: <ProductMenu categories={category} products={products} />,
    },
    Estoque: {
      buttons: <div>Estoque Buttons</div>,
      content: <div>Estoque Content</div>,
    },
    Receitas: {
      buttons: <div>Receitas Buttons</div>,
      content: <div>Receitas Content</div>,
    },
  };

  if (productsLoading || categoryLoading) {
    return <div>Loading...</div>;
  }

  if (productsError || categoryError) {
    return <div>Error...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navMenuDiv}>
        <div className={styles.navLogo}>
          <img src={Logo} alt="Logo" height={150} />
        </div>
        <div className={styles.navContainer}>
          <div className={styles.navMenu}>
            <MenuNavItem
              onClick={() => setActualContent("Relatorio")}
              icon="summarize"
            >
              Relatório
            </MenuNavItem>
            <MenuNavItem
              onClick={() => setActualContent("Pedidos")}
              icon="receipt_long"
            >
              Pedidos
            </MenuNavItem>
            <MenuNavItem
              onClick={() => setActualContent("Produtos")}
              icon="fastfood"
            >
              Produtos
            </MenuNavItem>
            <MenuNavItem
              onClick={() => setActualContent("Estoque")}
              icon="package_2"
            >
              Estoque
            </MenuNavItem>
            <MenuNavItem
              onClick={() => setActualContent("Receitas")}
              icon="science"
            >
              Receitas
            </MenuNavItem>
            <MenuNavItem onClick={() => navigate("/home")} icon="home">
              Home
            </MenuNavItem>
          </div>
          <div className={styles.navProfile}>
            <UserPopover homeButton={true} slice={false}>
              <Button radius="full" className={navStyles.button}>
                <ProfileWB className={navStyles.profile} />
                Olá, {currentUser?.name.split(" ")[0]}
              </Button>
            </UserPopover>
          </div>
        </div>
      </div>
      <div className={styles.content_container}>
        <MenuNav name={actualContent}>
          {actualObject[actualContent].buttons}
        </MenuNav>
        {actualObject[actualContent].content}
      </div>
    </div>
  );
};

export default Dashboard;
