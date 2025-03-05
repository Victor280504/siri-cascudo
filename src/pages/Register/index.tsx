import { zodResolver } from "@hookform/resolvers/zod";
import { FooterWave, Logo, RegisterImage, SiriCascudo } from "../../assets";
import { Input } from "../../components/ui/Input";
import Item from "../../components/ui/Item";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Register.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService, {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../services/api";
import { api } from "../../services";
import { User } from "../../types/User";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[^a-zA-Z0-9]/,
      "A senha deve conter pelo menos um caractere especial"
    ),
});

const Register = () => {
  const { error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState<
    ServerError | ServerCreateResponse | null
  >(null);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    console.log(data);
    const sendData = {
      ...data,
    };
    const service = new apiService(api, "/auth/register");
    const res = await service.create<User>(sendData);

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
        setMessage(res as ServerUpdateResponse);
      }
    } else {
      if (res as ServerCreateResponse) {
        setMessage(res as ServerCreateResponse);
        setTimeout(() => {
          navigate(`/home`);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${SiriCascudo})`,
        backgroundColor: "#32356E",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "120vh",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Item.Container
        width={1142}
        height={750}
        backgroundColor={"#32356E"}
        borderRadius={"24px"}
        justifyContent="center"
        alignItems="center"
        position="relative"
        boxSizing="border-box"
      >
        <Item.Link to="/" position="absolute" top={-30}>
          <img src={Logo} alt="Logo" width={90} />
        </Item.Link>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Item.Subtitle
            color="#32356E"
            marginBottom={"40px"}
            fontSize={"30px"}
          >
            Cadastre-se e navegue pelas melhores ofertas!
          </Item.Subtitle>
          <Item.Row
            width={"100%"}
            justifyContent="space-around"
            gap={"70px"}
            maxWidth={"833px"}
          >
            <Item.Col>
              <Input
                type="text"
                label="Nome"
                placeholder="Insira o seu nome"
                helperText={errors.name?.message?.toString()}
                required
                {...register("name")}
              />
              <Input
                required
                type="text"
                label="Endereço"
                placeholder="Rua Nº Bairro Cidade - Estado"
                helperText={errors.address?.message?.toString()}
                {...register("address")}
              />
              <Input
                required
                type="email"
                label="Email"
                placeholder="Insira o seu Email"
                helperText={errors.email?.message?.toString()}
                {...register("email")}
              />
              <Input
                required
                type="password"
                label="Senha"
                placeholder="Insira a sua senha"
                helperText={errors.password?.message?.toString()}
                {...register("password")}
              />
            </Item.Col>
            <Item.Col justifyContent="start" height={"100%"} marginTop={"55px"}>
              <img src={RegisterImage} alt="Register" width={400} />
              {isDirty ? (
                <Input
                  type="submit"
                  value={isSubmitting ? "Criando..." : "Criar"}
                  disabled={isSubmitting}
                />
              ) : (
                <Input type="submit" value="Criar" disabled />
              )}
              <span style={{ fontWeight: "400", color: "#32356E" }}>
                Já é cliente? Faça{" "}
                <Item.Link to="/login">
                  <strong style={{ textDecoration: "underline" }}>Login</strong>
                </Item.Link>
              </span>
              {message && (
                <Item.Text
                  color={message.flag === "SUCCESS" ? "#4CAF50" : "#e35f5f"}
                  margin={0}
                  marginTop={"10px"}
                  fontSize={"16px"}
                >
                  {message.message}
                </Item.Text>
              )}
              {error && (
                <Item.Text
                  color="#e35f5f"
                  margin={0}
                  marginTop={"10px"}
                  fontSize={"16px"}
                >
                  {error?.response?.data?.message}
                </Item.Text>
              )}{" "}
            </Item.Col>
          </Item.Row>
        </form>
      </Item.Container>
      <div className={styles.wave}>
        <img src={FooterWave} alt="" width={"100%"} />
      </div>
    </div>
  );
};

export default Register;
