import styles from "./Menu.module.css";
import Container from "./Menu.tsx";
import Item from "../../ui/Item/index.tsx";
import {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactElement,
  useEffect,
} from "react";
import {
  AddToCart,
  CartBase,
  RemoveOneToCart,
  RemoveToCart,
} from "../../../assets/index.ts";
import { Product } from "../../../types/Products.ts";
import useCart from "../../../hooks/useCart.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import recipeService from "../../../services/recipeService.ts";
import { Spinner } from "react-bootstrap";
import { RecipeWithIngredient } from "../../../types/Recipe.ts";

interface MenuProps {
  isOpen: boolean;
  tabIndex?: number;
  setModalOpen: () => void;
}

const Cart = ({ isOpen, setModalOpen, tabIndex }: MenuProps) => {
  const { cartTotal, cart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

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
            <CartButton
              disabled={!auth || cart?.items?.length === 0}
              onClick={() => navigate("/user/sale/payment")}
            />
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

export const CartCard = ({ product }: CartCardProps) => {
  const {
    addToCart,
    removeFromCart,
    removeOneFromCart,
    productToCartItem,
    getCartProducById,
    productSubTotal,
  } = useCart();

  const cartItem = getCartProducById(product?.id || "");

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
              x{cartItem?.quantity}
            </Item.Text>
            <Item.Text fontSize={"14px"} color="#656588">
              R${product.price}
            </Item.Text>
            <Item.Text fontSize={"14px"} color="#656588">
              R${cartItem && productSubTotal(cartItem).toFixed(2)}
            </Item.Text>
          </Item.Row>
        </Item.Col>
      </Item.Row>
      <CartCardButton
        Icon={<RemoveToCart />}
        onClick={() =>
          removeFromCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "0%", top: "5%" }}
      />
      <CartCardButton
        Icon={<RemoveOneToCart />}
        onClick={() =>
          removeOneFromCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "13%", bottom: "-5%" }}
      />
      <CartCardButton
        Icon={<AddToCart />}
        onClick={() =>
          addToCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "0%", bottom: "-5%" }}
      />
    </div>
  );
};
export const CartCardSale = ({ product }: CartCardProps) => {
  const {
    addToCart,
    removeFromCart,
    removeOneFromCart,
    productToCartItem,
    getCartProducById,
    productSubTotal,
  } = useCart();

  const cartItem = getCartProducById(product?.id || "");

  const {
    data: recipes,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useQuery({
    queryKey: ["recipes/names", product.id],
    queryFn: async () =>
      await recipeService.getByIdWithIngredient<RecipeWithIngredient[]>(
        product.id
      ),
  });

  if (recipesLoading) {
    return <Spinner animation="border" variant={"dark"} />;
  }

  if (recipesError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "#ff4d4f",
        }}
      >
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn't load the data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cartCard} ${styles.cartCardSale}`}>
      <Item.Row
        justifyContent={"start"}
        width={"100%"}
        height={"100%"}
        alignItems="center"
      >
        <div
          style={{
            width: "15%",
            height: "90%",
            position: "relative",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              overflow: "hidden",
              position: "absolute",
              right: "0px",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <Item.Col
          width={"70%"}
          marginLeft={"25px"}
          alignItems="start"
          gap={"10px"}
        >
          <Item.Row justifyContent="start" width={"100%"} gap={"10%"}>
            <Item.Col alignItems="start" width={"60%"}>
              <Item.Text
                width={"100%"}
                fontSize={"16px"}
                fontFamily="SFCompactMedium"
                fontWeight="bold"
                textAlign="left"
                margin={0}
                alignSelf="start"
              >
                {product.name}
              </Item.Text>
              <Item.Text
                width={"100%"}
                fontSize={"15px"}
                fontFamily="SFCompactMedium"
                textAlign="left"
                margin={0}
                alignSelf="start"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {recipes &&
                  recipes
                    ?.map((recipe) => recipe.ingredient.description)
                    .join(", ")}
              </Item.Text>
            </Item.Col>
            <Item.Col alignItems="start" gap={0} width={"30%"}>
              <Item.Text
                margin={0}
                fontSize={"14px"}
                fontWeight={400}
                color="black"
              >
                Total:
              </Item.Text>
              <Item.Text
                margin={0}
                fontFamily="SFCompactMedium"
                fontSize={"22px"}
                color="black"
              >
                R${cartItem && productSubTotal(cartItem).toFixed(2)}
              </Item.Text>
            </Item.Col>
          </Item.Row>
          <Item.Col alignItems="start">
            <Item.Text
              margin={0}
              fontFamily="SFCompactMedium"
              fontSize={"14px"}
              color="black"
            >
              <strong>Preço: </strong>R${product.price}
            </Item.Text>
            <Item.Text
              margin={0}
              fontFamily="SFCompactMedium"
              fontSize={"14px"}
              color="black"
            >
              <strong>Quantidade: </strong>x{cartItem?.quantity}
            </Item.Text>
          </Item.Col>
        </Item.Col>
      </Item.Row>
      <CartCardButton
        Icon={<RemoveToCart />}
        onClick={() =>
          removeFromCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "3%", bottom: "5%" }}
      />
      <CartCardButton
        Icon={<RemoveOneToCart />}
        onClick={() =>
          removeOneFromCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "11%", bottom: "5%" }}
      />
      <CartCardButton
        Icon={<AddToCart />}
        onClick={() =>
          addToCart(productToCartItem(product, cartItem?.quantity || 0))
        }
        style={{ position: "absolute", right: "19%", bottom: "5%" }}
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
  ...props
}: CartCardButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={styles.cartItemButton}
      style={style}
    >
      {Icon}
    </button>
  );
};

interface CartCardListProps {
  data: CartCardProps[];
  marginLeft?: string;
  width?: string;
  height?: string;
  cartCardType?: "cart" | "sale";
}
export const CartCardList = ({
  data,
  marginLeft = "5%",
  width = "100%",
  height = "50vh",
  cartCardType = "cart",
}: CartCardListProps) => {
  return (
    <Item.Col
      justifySelf="start"
      width={width}
      margin={"0"}
      maxHeight={height}
      overflowY="auto"
      gap={"10px"}
      padding={"5px"}
      marginLeft={marginLeft}
      hasScrollBar={true}
    >
      {data.map((item, index) => {
        if (cartCardType === "cart") {
          return (
            <CartCard
              key={item.product?.id || `${index}keyID`}
              product={item.product}
            />
          );
        } else {
          return (
            <CartCardSale
              key={item.product?.id || `${index}keyID`}
              product={item.product}
            />
          );
        }
      })}
    </Item.Col>
  );
};

export const CartButton = ({
  onClick,
  disabled,
  message = "Continuar",
  type = "button",
  ...props
}: {
  onClick?: () => void;
  disabled: boolean;
  message?: string;
  type?: "button" | "submit" | "reset";
} & CSSProperties) => {
  console.log(disabled)
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.cartButton}
      style={props}
      disabled={disabled}
    >
      {message}
    </button>
  );
};

export default Cart;
