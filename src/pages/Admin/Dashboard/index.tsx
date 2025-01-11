import { PropsWithChildren, useState } from "react";
import Item from "../../../components/ui/Item";
import styles from "./Dashboard.module.css";
import { PopoverSlice, ProfileWB, Settings } from "../../../assets";
import { useAuth } from "../../../hooks/useAuth";
import { Line } from "../../../assets";
import { Popover } from "@radix-ui/themes";

const Dashboard = () => {
  const { currentUser } = useAuth();
  return (
    <div className={styles.container}>
      <div className={styles.navMenu}>
        <MenuNavItem to="/home" icon="home">
          Home
        </MenuNavItem>
        <MenuNavItem to="/home" icon="receipt_long">
          Pedidos
        </MenuNavItem>
        <MenuNavItem to="/home" icon="fastfood">
          Produtos
        </MenuNavItem>
        <MenuNavItem to="/home" icon="package_2">
          Estoque
        </MenuNavItem>
        <MenuNavItem to="/home" icon="science">
          Receitas
        </MenuNavItem>
        <MenuNavItem to="/home" icon="summarize">
          Relatório
        </MenuNavItem>
        <MenuNavItem to="/home" icon="groups">
          Cargos
        </MenuNavItem>
      </div>
      <div className={styles.content_container}>
        <MenuNav name={currentUser?.name || ""} />
        <div className={styles.content}>
          <MenuContent title="Pedidos" subtitle="Resumo inicial">
            <RequestItem
              today={{ pending: 10, done: 5, delivered: 3 }}
              week={{ pending: 30, done: 15, delivered: 9 }}
            />
          </MenuContent>
          <MenuContent title="Produtos" subtitle="Mais Vendidos"></MenuContent>
        </div>
        <div className={styles.content}>
          <MenuContent
            title="Estoque"
            subtitle="Ingredientes Acabando"
          ></MenuContent>
          <MenuContent
            title="Vendas"
            subtitle="Relatório Inicial"
          ></MenuContent>
        </div>
      </div>
    </div>
  );
};

const MenuNavItem = ({
  to,
  children,
  icon,
}: PropsWithChildren & { to: string; icon: string }) => {
  return (
    <button className={styles.button} onClick={() => console.log("click")}>
      <span className="material-symbols-outlined primary md">{icon}</span>
      <p className={styles.button_text}>{children}</p>
    </button>
  );
};

const MenuNav = ({ name, link }: { name: string; link?: string }) => {
  return (
    <Item.Row
      justifyContent="space-between"
      alignItems="center"
      width={"100%"}
      padding={"20px 30px"}
    >
      <Item.Subtitle color="#3C227C" margin={0}>
        {" "}
        Olá, {name}
      </Item.Subtitle>
      <Popover.Root>
        <Popover.Trigger>
          <button className={styles.button} style={{ padding: "0" }}>
            <ProfileWB />
          </button>
        </Popover.Trigger>
        <Popover.Content className={styles.pop} size="4">
          <PopoverSlice className={styles.slice} />
          <PopoverContent wallet="100" />
        </Popover.Content>
      </Popover.Root>
    </Item.Row>
  );
};

const PopoverContent = ({ wallet }: { wallet: string }) => {
  const { logout } = useAuth();
  return (
    <div className={styles.popover}>
      <Item.Row width={"100%"} alignItems="center" gap={"20px"}>
        <button className={styles.button} style={{ padding: "0", gap: "20px" }}>
          <ProfileWB width={'47px'}/>
          <Item.Text
            color="#32356E"
            fontSize={"20px"}
            fontWeight="500"
            margin={0}
          >
            Perfil
          </Item.Text>
        </button>
      </Item.Row>
      <Item.Row width={"100%"} alignItems="center" gap={"20px"}>
        <button className={styles.button} style={{ padding: "0", gap: "20px" }}>
          <Settings />
          <Item.Text
            color="#32356E"
            fontSize={"20px"}
            fontWeight="500"
            margin={0}
          >
            Configurações
          </Item.Text>
        </button>
      </Item.Row>
      <Item.Row
        width={"100%"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Item.Text
          color="#32356E"
          fontSize={"20px"}
          fontWeight="bold"
          margin={0}
        >
          Carteira:
        </Item.Text>
        <p
          style={{
            margin: "0",
            color: "#927CDE",
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Roboto",
          }}
        >
          R$ {wallet}
        </p>
      </Item.Row>
      <Item.Row width={"100%"} justifyContent="center" alignItems="center">
        <button className={styles.logout} onClick={logout}>
          Sair
        </button>
      </Item.Row>
    </div>
  );
};

const MenuContent = ({
  children,
  title,
  subtitle,
}: PropsWithChildren & { title: string; subtitle: string }) => {
  return (
    <div className={styles.item}>
      <Item.Row
        width={"100%"}
        justifyContent="space-between"
        alignItems="center"
      >
        <h2 className={styles.menu_title}>{title}</h2>
        <button className={styles.button} style={{ padding: "0" }}>
          <span className="material-symbols-outlined secondary md">
            chevron_right
          </span>
        </button>
      </Item.Row>
      <p className={styles.menu_subtitle}>{subtitle}</p>
      {children}
    </div>
  );
};

interface RequestsInfo {
  pending: number;
  done: number;
  delivered: number;
}

interface RequestItemProps {
  today: RequestsInfo;
  week: RequestsInfo;
}

const RequestItem = ({ today, week }: RequestItemProps) => {
  const [buttonActive, setButtonActive] = useState(true);
  return (
    <>
      <Item.Row
        marginTop="10px"
        justifyContent="space-between"
        alignItems="center"
        width={"100%"}
      >
        <button
          className={
            buttonActive
              ? styles.button_item_selected
              : styles.button_item_inactive
          }
          onClick={() => setButtonActive(true)}
        >
          Hoje
        </button>
        <button
          className={
            buttonActive
              ? styles.button_item_inactive
              : styles.button_item_selected
          }
          onClick={() => setButtonActive(false)}
        >
          Últimos 7 dias
        </button>
      </Item.Row>
      <Item.Col
        marginTop={"20px"}
        width={"100%"}
        height={"50%"}
        justifyContent="space-between"
      >
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Pendentes
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.pending : week.pending}
          </Item.Text>
        </div>
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Feitos
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.done : week.done}
          </Item.Text>
        </div>
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Entregues
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.delivered : week.delivered}
          </Item.Text>
        </div>
      </Item.Col>
    </>
  );
};

const ProductItem = ({ children }: PropsWithChildren) => {
  return <div className={styles.product}>{children}</div>;
};

const SaleGraph = ({ children }: PropsWithChildren) => {
  return <div className={styles.graph}>{children}</div>;
};

const StorageItem = ({ children }: PropsWithChildren) => {
  return <div className={styles.storage}>{children}</div>;
};

export default Dashboard;
