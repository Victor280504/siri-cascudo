import { Popover } from "@radix-ui/themes";
import { PopoverSlice, ProfileWB } from "../../../assets";
import styles from "../../../pages/Admin/Dashboard/Dashboard.module.css";
import Item from "../../ui/Item";
import { useAuth } from "../../../hooks/useAuth";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

const UserPopover = ({
  children,
  homeButton = false,
  slice = true,
}: // setModalOpen,
PropsWithChildren & {
  homeButton?: boolean;
  isOpen?: boolean;
  slice?: boolean;
  setModalOpen?: () => void;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className={styles.pop} size="4">
        {slice && (
          <PopoverSlice
            className={`${styles.slice} ${homeButton && styles.right}`}
          />
        )}
        <PopoverContent wallet="100">
          {/* <button
            className={styles.button}
            style={{ padding: "0", gap: "20px" }}
            onClick={() => navigate("/user/profile")}
          >
            <Settings />
            <Item.Text
              color="#32356E"
              fontSize={"20px"}
              fontWeight="500"
              margin={0}
            >
              Configurações
            </Item.Text>
          </button> */}
        </PopoverContent>
      </Popover.Content>
    </Popover.Root>
  );
};

const PopoverContent = ({
  wallet,
  children,
}: PropsWithChildren & { wallet: string }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.popover}>
      <Item.Row width={"100%"} alignItems="center" gap={"20px"}>
        <button
          className={styles.button}
          style={{ padding: "0", gap: "20px" }}
          onClick={() => navigate("/user/profile")}
        >
          <ProfileWB width={"47px"} />
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
        {children}
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

export default UserPopover;
