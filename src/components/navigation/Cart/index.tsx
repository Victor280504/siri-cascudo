import styles from "./Menu.module.css";
import Container from "./Menu.tsx";
import Item from "../../ui/Item/index.tsx";
import { useEffect  } from "react";
import { CartBase, HamburguerImg } from "../../../assets/index.ts";
import { Product } from "../../../types/Products.ts";

interface MenuProps {
  isOpen: boolean;
  tabIndex?: number;
  setModalOpen: () => void;
}


const Cart = ({ isOpen, setModalOpen, tabIndex }: MenuProps) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <span className="material-symbols-outlined light lg">
              chevron_left
            </span>
          </button>
          <Item.Subtitle
            color="#FFFFFF"
            margin={0}
            fontSize={"30px"}
            display="flex"
            alignItems="center"
          >
            Seu Carrinho
          </Item.Subtitle>
        </Container.Nav>
        <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
          {/* {!dataIsLoading && (
            <p style={{ margin: "0", color: "#d6faff", fontWeight: "bold" }}>
              Carregando...
            </p>
          )}
          {serverError && (
            <p style={{ margin: "0", color: "#e35f5f", fontWeight: "bold" }}>
              Erro ao carregar dados
            </p>
          )}
          {message && (
            <p style={{ margin: "0", color: "#d6faff", fontWeight: "bold" }}>
              {message.message}
            </p>
          )} */}
        </div>
        <CartCardList
          data={[
            {
              product: {
                name: "Hamburguer",
                price: 10,
                description: "Hamburguer de carne",
                id: "1",
                idCategory: 1,
                quantity: 1,
                image: HamburguerImg,
              },
              addToCart: () => {},
              removeFromCart: () => {},
            },
            {
              product: {
                name: "Hamburguer",
                price: 10,
                description: "Hamburguer de carne",
                id: "1",
                idCategory: 1,
                quantity: 1,
                image: HamburguerImg,
              },
              addToCart: () => {},
              removeFromCart: () => {},
            },
            {
              product: {
                name: "Hamburguer",
                price: 10,
                description: "Hamburguer de carne",
                id: "1",
                idCategory: 1,
                quantity: 1,
                image: HamburguerImg,
              },
              addToCart: () => {},
              removeFromCart: () => {},
            },
            {
              product: {
                name: "Hamburguer",
                price: 10,
                description: "Hamburguer de carne",
                id: "1",
                idCategory: 1,
                quantity: 1,
                image: HamburguerImg,
              },
              addToCart: () => {},
              removeFromCart: () => {},
            },
            {
              product: {
                name: "Hamburguer",
                price: 10,
                description: "Hamburguer de carne",
                id: "1",
                idCategory: 1,
                quantity: 1,
                image: HamburguerImg,
              },
              addToCart: () => {},
              removeFromCart: () => {},
            },
          ]}
        />
        <Container.Footer>
          <Item.Col width={"100%"} margin={"0"}>
            <Item.Row
              justifyContent="space-between"
              width={"80%"}
              marginTop={"10px"}
            >
              <Item.Text fontSize={"20px"} fontWeight={"bold"} color="#AD7405">
                Total
              </Item.Text>
              <Item.Text fontSize={"20px"} fontWeight={"bold"} color="#AD7405">
                R$ {}
              </Item.Text>
            </Item.Row>
            <CartButton />
          </Item.Col>
        </Container.Footer>
        <div style={{ height: 150 }}></div>
        <CartBase height={"150"} width={"100%"} className={styles.cartBase} />
      </div>
    </>
  );
};

interface CartCardProps {
  product: Product;
  addToCart: () => void;
  removeFromCart: () => void;
}

interface CartCardListProps {
  data: CartCardProps[];
}

const CartCard = ({ product, addToCart, removeFromCart }: CartCardProps) => {
  return (
    <div className={styles.cartCard}>
      <Item.Row justifyContent={"end"} alignItems="center">
        <img
          src={product.image}
          alt={product.name}
          style={{
            overflow: "hidden",
            position: "absolute",
            left: "-7%",
            height: "65%",
          }}
        />
        <div style={{ width: "70px" }}></div>
        <Item.Col width={"70%"} marginLeft={"25px"}>
          <Item.Text
            fontSize={"16px"}
            textAlign="left"
            marginBottom={"5px"}
            alignSelf="start"
          >
            {product.name}
          </Item.Text>
          <Item.Row justifyContent="space-between" width={"100%"}>
            <Item.Text fontSize={"14px"} color="#656588">
              x{product.quantity}
            </Item.Text>
            <Item.Text fontSize={"14px"} color="#656588">
              R${product.price}
            </Item.Text>
          </Item.Row>
        </Item.Col>
      </Item.Row>
    </div>
  );
};
const CartCardList = ({ data }: CartCardListProps) => {
  return (
    <Item.Col
      justifySelf="start"
      width={"100%"}
      margin={"0"}
      maxHeight={"50vh"}
      overflowY="auto"
      gap={"10px"}
      marginLeft={"5%"}
    >
      {data.map((item) => (
        <CartCard
          key={item.product.name.toLowerCase() + Math.random()}
          {...item}
        />
      ))}
    </Item.Col>
  );
};

const CartButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button onClick={onClick} className={styles.cartButton}>
      Continuar
    </button>
  );
};

export default Cart;
