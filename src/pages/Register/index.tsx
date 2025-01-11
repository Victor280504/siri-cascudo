import { FooterWave, Logo, RegisterImage, SiriCascudo } from "../../assets";
import { Input } from "../../components/ui/Input";
import Item from "../../components/ui/Item";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Register.module.css";
import { useForm } from "react-hook-form";

const Register = () => {
  const { error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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
        <form className={styles.form}>
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
                // helperText={errors.email?.message}
                required
                {...register("name")}
              />
              <Input
                required
                type="text"
                label="Endereço"
                placeholder="Rua Nº Bairro Cidade - Estado"
                // helperText={errors.email?.message}
                {...register("address")}
              />
              <Input
                required
                type="email"
                label="Email"
                placeholder="Insira o seu Email"
                // helperText={errors.email?.message}
                // {...register("email")}
              />
              <Input
                required
                type="password"
                label="Senha"
                placeholder="Insira a sua senha"
                // helperText={errors.password?.message}
                // {...register("password")}
              />
              <Input
                required
                label="Username"
                placeholder="Insira o seu username"
                // helperText={errors.password?.message}
                // {...register("password")}
              />
            </Item.Col>
            <Item.Col justifyContent="start" height={"100%"} marginTop={"55px"}>
              <img src={RegisterImage} alt="Register" width={400} />
              {!isSubmitting && <Input type="submit" value="Cadastrar" />}
              {isSubmitting && (
                <Input type="submit" value="Cadastrando..." disabled />
              )}
              {error && (
                <Item.Text color="#000000">
                  {error?.response?.data?.message}
                </Item.Text>
              )}{" "}
              <span style={{ fontWeight: "400", color: "#32356E" }}>
                Já é cliente? Faça{" "}
                <Item.Link to="/login">
                  <strong style={{ textDecoration: "underline" }}>Login</strong>
                </Item.Link>
              </span>
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
