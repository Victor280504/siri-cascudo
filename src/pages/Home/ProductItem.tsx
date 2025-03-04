import styles from "./Home.module.css";
import { PropsWithChildren } from "react";
import Item from "../../components/ui/Item";
import useCart from "../../hooks/useCart";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export const Section = ({
  children,
  title,
  id,
}: PropsWithChildren & { title?: string; id?: string }) => {
  return (
    <Item.Col alignItems="start" width={"100%"}>
      <div id={id?.toLowerCase()}>
        <Item.Subtitle marginBottom={"20px"}>{title}</Item.Subtitle>
      </div>
      {children}
    </Item.Col>
  );
};

interface SectionItemProps {
  id: string;
  link: string;
  name: string;
  description: string;
  price: number;
  image: string;
  idCategory: number;
  color?: string;
  available?: number;
}

interface SectionListProps {
  menuItems: SectionItemProps[];
}

export const SectionList = ({
  menuItems,
  color,
}: SectionListProps & { color: string }) => {
  return (
    <>
      {menuItems.map((item) => (
        <SectionItem
          available={item.available}
          key={item.id}
          idCategory={item.idCategory}
          link={item.link}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          color={color}
          id={item.id}
        />
      ))}
    </>
  );
};

export const SectionItem = ({
  id,
  link,
  name,
  description,
  price,
  image,
  color,
  idCategory,
  available,
}: SectionItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className={styles.sectionItem}
      style={{ transition: "transform 0.2s", transform: "scale(1)" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <button
        onClick={available ? () => setIsModalOpen(true) : () => {}}
        style={{
          width: "100%",
          height: "100%",
          cursor: `${available ? "pointer" : "not-allowed"}`,
          opacity: `${available ? 1 : 0.5}`,
          border: "none",
          padding: 0,
          backgroundColor: "transparent",
          background: "none",
        }}
      >
        <Item.Container
          width={"100%"}
          height={"100%"}
          padding={"10px"}
          gap={"10px"}
        >
          <Item.Row
            width={"100%"}
            padding={"10px"}
            backgroundColor="#FFF"
            alignItems="start"
            borderRadius={"10px"}
            gap={"10px"}
            position="relative"
          >
            <Item.Container
              backgroundColor={color}
              borderRadius={"32px"}
              width={"18%"}
              height={"200px"}
              justifyContent="center"
            >
              <Item.Img src={image} alt={name} width={"70%"} />
            </Item.Container>
            <Item.Col alignItems="start" paddingLeft={"20px"} width={"70%"}>
              <Item.Text fontWeight={"bold"} fontSize={"32px"}>
                {name}
              </Item.Text>
              <p className={styles.itemDescription}>{description}</p>
            </Item.Col>
            <Item.Container
              position="absolute"
              backgroundColor={color}
              width={"185px"}
              height={"64px"}
              borderRadius={"32px"}
              right={0}
              top={0}
              justifyContent="center"
              alignItems="center"
            >
              <Item.Text
                fontWeight="bold"
                fontFamily={"Roboto, sans-serif"}
                fontSize={"28px"}
                margin={0}
              >
                R${price}
              </Item.Text>
            </Item.Container>
          </Item.Row>
        </Item.Container>
      </button>
      {isModalOpen && (
        <ProductModal
          product={{
            id,
            link,
            name,
            description,
            price,
            image,
            color,
            idCategory,
            available,
          }}
          show={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const ProductModal = ({
  product,
  show,
  handleClose,
}: {
  product: SectionItemProps;
  show: boolean;
  handleClose: () => void;
}) => {
  const { auth } = useAuth();
  const { addToCart, productToCartItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const addQuantity = () => {
    if (quantity < product.available!) {
      setQuantity(quantity + 1);
    }
  };
  const removeQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName={styles.customModalContent}
      centered
      dialogClassName={styles.customModal}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          width: "100%",
          height: "100%",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            overflow: "hidden",
            position: "absolute",
            left: "-40%",
            height: "70%",
            maxWidth: "100%",
          }}
        />
        <div style={{ width: "40%" }}></div>
        <Item.Col
          width={"60%"}
          height="70%"
          paddingRight={"8%"}
          justifyContent="start"
          marginLeft={"25px"}
          alignItems="start"
        >
          <Item.Title
            fontFamily="SFCompactMedium"
            fontSize="40px"
            color="#008EA0"
          >
            {product.name}
          </Item.Title>
          <Item.Text
            fontFamily="SFCompactMedium"
            textAlign="left"
            marginBottom={"10%"}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </Item.Text>
          <Item.Row
            width={"100%"}
            justifyContent="space-between"
            alignItems="center"
            marginBottom="8%"
          >
            <Item.Text
              margin="0px"
              fontSize="30px"
              fontFamily="SFCompactMedium"
              fontWeight="bold"
            >
              Quantidade:
            </Item.Text>
            <Item.Row
              width={"25%"}
              justifyContent="space-between"
              alignItems="center"
              marginRight={"10px"}
            >
              <button
                onClick={removeQuantity}
                style={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  border: "none",
                  background: "none",
                  backgroundColor: "#D6FAFF",
                  borderRadius: "50%",
                  fontSize: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "7px",
                }}
              >
                -
              </button>
              <Item.Text margin={0} fontSize={"30px"}>
                {quantity}
              </Item.Text>
              <button
                onClick={addQuantity}
                style={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  border: "none",
                  background: "none",
                  backgroundColor: "#D6FAFF",
                  borderRadius: "50%",
                  fontSize: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "7px",
                }}
              >
                +
              </button>
            </Item.Row>
          </Item.Row>
          <Item.Row
            width={"100%"}
            justifyContent="space-between"
            alignItems="center"
            marginBottom="5%"
          >
            <Item.Text
              margin="0px"
              fontSize="30px"
              fontFamily="SFCompactMedium"
              fontWeight="bold"
            >
              Total
            </Item.Text>
            <Item.Text
              padding={"5px 50px"}
              borderRadius={"30px"}
              backgroundColor="#D6FAFF"
              margin="0px"
              fontSize="30px"
              fontWeight="bold"
            >
              R${product.price * quantity}
            </Item.Text>
          </Item.Row>
          <button
            className={styles.modalButton}
            disabled={!auth}
            onClick={() =>
              addToCart(
                productToCartItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  available: product.available!,
                  description: product.description,
                  image: product.image,
                  idCategory: product.idCategory,
                })
              )
            }
          >
            Adicionar
          </button>
          {!auth && (
            <Item.Text
              alignSelf="center"
              margin="0px"
              marginTop={"10px"}
              fontSize="16px"
              color="#A0A0A0"
            >
              Faça{" "}
              <Link
                to="/login"
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                Login
              </Link>{" "}
              para adicionar um item.
            </Item.Text>
          )}
        </Item.Col>
      </div>
    </Modal>
  );
};
