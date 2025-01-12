import styles from "./Menu.module.css";
import Container from "./Menu.tsx";
import Item from "../../ui/Item/index.tsx";
import { Input } from "../../ui/Input/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";

interface MenuProps {
  isOpen: boolean;
  tabIndex?: number;
  setModalOpen: () => void;
}

const Menu = ({ isOpen, setModalOpen, tabIndex }: MenuProps) => {
  const { currentUser } = useAuth();
  return (
    <>
      <div
        onClick={setModalOpen}
        className={
          isOpen ? styles.container : `${styles.container} ${styles.hide}`
        }
      ></div>
      <div
        className={isOpen ? `${styles.body}` : `${styles.body} ${styles.hide}`}
        tabIndex={tabIndex}
      >
        <Container.Nav>
          <button
            aria-label="Fechar Menu"
            className={styles.close}
            onClick={setModalOpen}
          >
            <span className="material-symbols-outlined primary lg">
              chevron_left
            </span>
          </button>
          <Item.Subtitle
            color="#D6FAFF"
            margin={0}
            marginBottom={"5px"}
            display="flex"
            alignItems="center"
          >
            Editar Informações
          </Item.Subtitle>
        </Container.Nav>
        <form className={styles.form}>
          <Input
            type="text"
            value={currentUser?.name}
            label="Nome"
            editInput={true}
          />
          <Input
            type="text"
            value={currentUser?.address}
            label="Endereço"
            editInput={true}
          />
          <Input
            type="email"
            value={currentUser?.email}
            label="Email"
            editInput={true}
          />
          <Input
            type="password"
            value={currentUser?.password}
            label="Senha"
            editInput={true}
          />
          <Input
            type="text"
            value={currentUser?.login}
            label="Username"
            editInput={true}
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.button}>
              Atualizar
            </button>
          </div>
        </form>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.danger}`}>
            Excluir Conta
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;
