import styles from "./Menu.module.css";
import Container from "./Menu.tsx";
import Item from "../../ui/Item/index.tsx";
import { ButtonHTMLAttributes, ReactElement, useEffect } from "react";
import {
  AddToCart,
  CartBase,
  RemoveOneToCart,
  RemoveToCart,
} from "../../../assets/index.ts";
import { Product } from "../../../types/Products.ts";
import useCart from "../../../hooks/useCart.ts";
import { useAuth } from "../../../hooks/useAuth.ts";

interface MenuProps {
  isOpen: boolean;
  tabIndex?: number;
  setModalOpen: () => void;
}

const Cart = ({ isOpen, setModalOpen, tabIndex }: MenuProps) => {
  const { cartTotal, cart } = useCart();
  const { auth } = useAuth();

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
        <Container.Nav disabled={auth || false}>
          {auth && (
            <>
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
            </>
          )}
        </Container.Nav>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "0" }}
        ></div>

        {auth && cart && cart.items?.length > 0 ? (
          <CartCardList data={cart.items} />
        ) : auth ? (
          <Item.Text fontSize={"20px"} fontWeight={"bold"} color="#AD7405">
            Seu carrinho está vazio
          </Item.Text>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "40%",
              padding: "20px",
              gap: "40px",
            }}
          >
            <Item.Text
              width="40%"
              textAlign="center"
              fontSize={"20px"}
              fontWeight={"bold"}
              color="#A0A0A0"
            >
              Seu carrinho está vazio
            </Item.Text>
            <Item.Text
              textAlign="center"
              width="60%"
              fontSize={"20px"}
              color="#A0A0A0"
            >
              Faça login para adicionar itens ao carrinho
            </Item.Text>
          </div>
        )}

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
                R$ {`${cartTotal().toFixed(2).replace(".", ",")}`}
              </Item.Text>
            </Item.Row>
            <CartButton disabled={!auth} />
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
}

interface CartCardListProps {
  data: CartCardProps[];
}

const CartCard = ({ product }: CartCardProps) => {
  const {
    addToCart,
    removeFromCart,
    removeOneFromCart,
    productToCartItem,
    getCartProducById,
    productSubTotal,
  } = useCart();

  const cartItem = getCartProducById(product?.id || "");

  useEffect(() => {
    if (cartItem) {
      addToCart(productToCartItem(product));
    }
  }, []);

  return (
    <div className={styles.cartCard}>
      <Item.Row
        justifyContent={"end"}
        width={"100%"}
        height={"100%"}
        alignItems="center"
        position="relative"
        overflow="hidden"
      >
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
              x{cartItem?.quantity ?? 0}
            </Item.Text>
            <Item.Text fontSize={"14px"} color="#656588">
              R${product.price}
            </Item.Text>
            <Item.Text fontSize={"14px"} color="#656588">
              R${cartItem && productSubTotal(cartItem)}
            </Item.Text>
          </Item.Row>
        </Item.Col>
      </Item.Row>
      <CartCardButton
        Icon={<RemoveToCart />}
        onClick={() => removeFromCart(productToCartItem(product))}
        style={{ position: "absolute", right: "-5%", bottom: "-5%" }}
      />
      <CartCardButton
        Icon={<RemoveOneToCart />}
        onClick={() => removeOneFromCart(productToCartItem(product))}
        style={{ position: "absolute", right: "21%", bottom: "-5%" }}
      />
      <CartCardButton
        Icon={<AddToCart />}
        onClick={() => addToCart(productToCartItem(product))}
        style={{ position: "absolute", right: "8%", bottom: "-5%" }}
      />
    </div>
  );
};

interface CartCardButtonProps {
  Icon: ReactElement;
}

export const CartCardButton = ({
  Icon,
  onClick,
  style,
}: CartCardButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button onClick={onClick} className={styles.cartItemButton} style={style}>
      {Icon}
    </button>
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
      padding={"5px"}
      marginLeft={"5%"}
    >
      {data.map((item, index) => (
        <CartCard key={item.product?.id || `${index}keyID`} {...item} />
      ))}
    </Item.Col>
  );
};

const CartButton = ({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled: boolean;
}) => {
  return (
    <button onClick={onClick} className={styles.cartButton} disabled={disabled}>
      Continuar
    </button>
  );
};

export default Cart;
