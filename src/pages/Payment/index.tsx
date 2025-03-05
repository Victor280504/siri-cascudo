import { Link, useNavigate } from "react-router-dom";
import { EditIcon, FooterWave } from "../../assets";
import {
  CartButton,
  CartCardButton,
  CartCardList,
} from "../../components/navigation/Cart";
import Navbar from "../../components/navigation/Navbar";
import Item from "../../components/ui/Item";
import useCart from "../../hooks/useCart";
import Container from "../../components/navigation/Cart/Menu";
import { useAuth } from "../../hooks/useAuth";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { messageType } from "../Home/ProductItem";
import saleService from "../../services/saleService";
import {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ValidationError,
} from "../../services/api";
import { Message } from "../Admin/Dashboard/components/Stock/EditIngredient";

const schema = z.object({
  date: z.date(),
  paymentMethod: z.string(),
  idUser: z.number(),
  products: z.array(
    z.object({
      idProduct: z.number(),
      quantity: z.number(),
      value: z.number(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

const PaymentScreen = () => {
  const { cartTotal, cart, clearCart } = useCart();
  const { auth, currentUser, fetchCurrentUser } = useAuth();
  const [serverError, setServerError] = useState<boolean>();
  const [message, setMessage] = useState<messageType>();
  const [submit, setSubmit] = useState<boolean>();
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    defaultValues: async () => {
      const actualDate = new Date();
      return {
        date: actualDate,
        paymentMethod: "Carteira",
        idUser: Number(currentUser?.id) || 0,
        products: cart.items.map((item) => ({
          idProduct: Number(item.idProduct),
          quantity: item.quantity,
          value: item.value * item.quantity,
        })),
      };
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) {
      setServerError(true);
      return;
    }
    setSubmit(true);
    const res = await saleService.create(data);

    if ((res as ServerError).errors || (res as ServerError).error) {
      if ((res as ServerError).errors) {
        (res as ServerError).errors.forEach((error: ValidationError) => {
          setError(error.field as keyof typeof schema.shape, {
            message: error.message,
          });
        });
      }
      if (
        ((res as ServerError).error &&
          (res as ServerError).message != "Validation failed") ||
        (res as ApiError).message == "Network Error"
      ) {
        setServerError(true);
        setMessage({
          variant: (res as ServerError).flag,
          show: true,
          message: res.message,
        });
      }
    } else {
      if (res as ServerCreateResponse) {
        setMessage({
          variant: (res as ServerCreateResponse).flag,
          show: true,
          message: res.message,
        });
        setTimeout(() => {
          setMessage({
            ...message,
            show: false,
            variant: message?.variant || "INFO",
            message: message?.message || "",
          });
          setSubmit(false);
          clearCart();
          fetchCurrentUser();
          navigate("/user/history");
        }, 2000);
      }
    }
  };
  const isDisabled = !(auth && cart?.items?.length > 0 && !isSubmitting);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage({ ...message, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (serverError) {
      setTimeout(() => {
        setServerError(false);
      }, 3000);
    }
  }, [serverError]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setValue(
      "products",
      cart.items.map((item) => ({
        idProduct: Number(item.idProduct),
        quantity: item.quantity,
        value: item.value * item.quantity,
      }))
    );
  }, [cart.items, setValue]);

  return (
    <Item.Row width="100%" height="100vh">
      <Item.Col
        width="100%"
        height="100vh"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Item.Container position="absolute" top={0} width={"100%"}>
          <Navbar />
        </Item.Container>
        <Item.Row width={"100%"} height="100%">
          <Item.Col
            width={"60%"}
            height="100%"
            backgroundColor={"#D6FAFF"}
            justifyContent="space-between"
          >
            <Item.Container width={"100%"} height="110px"></Item.Container>
            <Item.Col width={"100%"} height="100%" justifyContent="flex-start">
              <Link
                to="/home"
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "start",
                  paddingLeft: "5%",
                  paddingTop: "5%",
                  paddingBottom: "5%",
                  width: "10%",
                  textDecoration: "none",
                  color: "inherit",
                  marginTop: "5px",
                  left: "-60px",
                }}
              >
                <span className="material-symbols-outlined secondary lg">
                  chevron_left
                </span>
                <Item.Title
                  margin={0}
                  fontSize={"40px"}
                  fontWeight={"bold"}
                  fontFamily="SFCompact"
                  color="#28356A"
                >
                  Home
                </Item.Title>
              </Link>
              {isDisabled && !submit && (
                <div
                  style={{
                    textAlign: "center",
                    border: "2px solid #D9A644",
                    backgroundColor: "#FFF",
                    borderRadius: "20px",
                    padding: "100px",
                    marginTop: "5%",
                    marginBottom: "10%",
                  }}
                >
                  <Item.Text
                    marginTop={"20%"}
                    fontSize={"30px"}
                    fontFamily="SFCompactMedium"
                    fontWeight={"bold"}
                    color="#28356A"
                    margin={0}
                  >
                    Nenhum item no carrinho!
                  </Item.Text>
                  <Item.Link to={`/home`}>
                    <Item.Text
                      fontSize={"20px"}
                      color="#D9A644"
                      margin={0}
                      textDecoration={"underline"}
                    >
                      Clique aqui para encontrar produtos!
                    </Item.Text>
                  </Item.Link>
                </div>
              )}
              <CartCardList
                data={cart.items}
                marginLeft="0"
                width="80%"
                height="60vh"
                cartCardType="sale"
              />
            </Item.Col>
            <img src={FooterWave} alt="wave" style={{ width: "100%" }} />
          </Item.Col>
          <Item.Col width={"40%"} height="100%" justifyContent="center">
            <Item.Container width={"100%"} height="110px"></Item.Container>
            <Item.Row
              justifyContent="space-between"
              width={"70%"}
              margin={"0"}
              marginTop={"10px"}
            >
              <Item.Text
                fontFamily="SFCompactMedium"
                fontSize={"25px"}
                fontWeight={400}
                color="black"
                margin={"0"}
              >
                Itens adicionados
              </Item.Text>
              <Item.Text
                fontSize={"25px"}
                fontFamily="SFCompactMedium"
                fontWeight={400}
                color="black"
                margin={"0"}
              >
                R$ {`${cartTotal().toFixed(2).replace(".", ",")}`}
              </Item.Text>
            </Item.Row>
            <Item.Row justifyContent="space-between" width={"70%"} margin={"0"}>
              <Item.Text
                fontFamily="SFCompactMedium"
                fontSize={"25px"}
                fontWeight={400}
                color="black"
              >
                Taxa de entrega
              </Item.Text>
              <Item.Text
                fontSize={"25px"}
                fontFamily="SFCompactMedium"
                fontWeight={400}
                color="black"
              >
                R$ {`${10}`}
              </Item.Text>
            </Item.Row>
            <Container.Footer>
              <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                <Item.Col width={"100%"} margin={"0"}>
                  <Item.Row
                    justifyContent="space-between"
                    width={"100%"}
                    marginTop={"10px"}
                  >
                    <Item.Text
                      fontFamily="SFCompactMedium"
                      fontSize={"30px"}
                      fontWeight={400}
                      color="#AD7405"
                    >
                      Total
                    </Item.Text>
                    <Item.Text
                      fontSize={"30px"}
                      fontFamily="SFCompactMedium"
                      fontWeight={400}
                      color="#AD7405"
                    >
                      R$ {`${(10 + cartTotal()).toFixed(2).replace(".", ",")}`}
                    </Item.Text>
                  </Item.Row>
                  <SaleInfos title="Forma de pagamento" value="Carteira" />
                  <SaleInfos
                    title="Endereço de entrega"
                    value={currentUser?.address || "Não informado"}
                  />
                  <CartButton
                    message="Finalizar compra"
                    type="submit"
                    fontSize={"25px"}
                    padding={"20px 40px"}
                    backgroundColor={`${isDisabled ? "#c4c4c4" : "#D9A644"}`}
                    disabled={isDisabled}
                    onClick={() => {}}
                  />
                </Item.Col>
              </form>
            </Container.Footer>
          </Item.Col>
        </Item.Row>
      </Item.Col>
      {message && !serverError && (
        <Message
          message={message.message}
          variant={message.variant}
          show={message.show}
        />
      )}
      {serverError && message && (
        <Message
          message={message.message}
          variant={message.variant}
          show={message.show}
        />
      )}
      {errors && errors.products && (
        <Message
          message={errors.products.message?.toString() || ""}
          variant="DANGER"
          show={serverError || false}
        />
      )}
    </Item.Row>
  );
};

type SaleInfoProps = {
  title: string;
  value: string;
};

const SaleInfos = ({ title, value }: SaleInfoProps) => {
  return (
    <Item.Container
      width={"100%"}
      height="110px"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="start"
    >
      <Item.Col alignItems="flex-start">
        <Item.Text margin={0} color="#D9A644" fontFamily="SFCompactMedium">
          {title}
        </Item.Text>
        <Item.Text fontSize="20px" fontFamily="SFCompactMedium">
          {value}
        </Item.Text>
      </Item.Col>
      <Item.Col>
        <CartCardButton type="button" Icon={<EditIcon />} onClick={() => {}} />
      </Item.Col>
    </Item.Container>
  );
};

export default PaymentScreen;
