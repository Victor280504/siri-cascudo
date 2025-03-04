import { Button } from "@radix-ui/themes";
import UserPopover from "../../../../../components/navigation/Popover";
import { ProfileWB } from "../../../../../assets";
import MenuNavItem from "./MenuNavItem";
import styles from "../../Dashboard.module.css";
import navStyles from "../../../../../components/navigation/Navbar/Navbar.module.css";
import { useAuth } from "../../../../../hooks/useAuth";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <div className={styles.navContainer}>
      <div className={styles.navMenu}>
        <MenuNavItem link="/admin/report" icon="summarize">
          Relatório
        </MenuNavItem>
        <MenuNavItem link={"/admin/delivery"} icon="receipt_long">
          Pedidos
        </MenuNavItem>
        <MenuNavItem link={"/admin/products"} icon="fastfood">
          Produtos
        </MenuNavItem>
        <MenuNavItem link={"/admin/stock"} icon="package_2">
          Estoque
        </MenuNavItem>
        <MenuNavItem link="/home" icon="home">
          Home
        </MenuNavItem>
      </div>
      <div className={styles.navProfile}>
        <UserPopover homeButton={true} slice={false}>
          <Button radius="full" className={`${navStyles.button} ${navStyles.active}`}>
            <ProfileWB className={navStyles.profile} />
            Olá, {currentUser?.name.split(" ")[0]}
          </Button>
        </UserPopover>
      </div>
    </div>
  );
};

export default Navbar;
