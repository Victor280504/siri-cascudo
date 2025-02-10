import { FooterWave, Logo, SiriCascudo } from "../../assets";
import { Input } from "../../components/ui/Input";
import Item from "../../components/ui/Item";
import styles from "./Login.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Login as LoginType } from "../../types/User";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type FormProps = z.infer<typeof loginSchema>;

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(5, "Senha deve ter no mínimo 5 caracteres"),
});

const Login = () => {
  const { login, error, auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/admin");
    }
  }, [auth, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: zodResolver(loginSchema),
  });

  const loginAdmin = async ({ email, password }: LoginType) => {
    const admin = {
      email,
      password,
    };
    console.log(admin);
    const res = await login(admin);
    if (res) {
      navigate("/home");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${SiriCascudo})`,
        backgroundColor: "#32356E",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Item.Container
        width={580}
        height={580}
        backgroundColor={"#32356E"}
        borderRadius={"24px"}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <Item.Link to="/" position="absolute" top={-50}>
          <img src={Logo} alt="Logo" width={90} />
        </Item.Link>
        <form className={styles.form} onSubmit={handleSubmit(loginAdmin)}>
          <Item.Subtitle color="#32356E" marginBottom={"40px"}>
            Olá, Marujo!
          </Item.Subtitle>
          <Input
            type="email"
            label="Login"
            placeholder="Insira o seu login"
            helperText={errors.email?.message}
            {...register("email")}
          />
          <Input
            type="password"
            label="Senha"
            placeholder="Insira o sua senha"
            helperText={errors.password?.message}
            {...register("password")}
          />
          {!isSubmitting && <Input type="submit" value="Entrar" />}
          {isSubmitting && <Input type="submit" value="Entrando..." disabled />}
          {error && (
            <Item.Text color="#000000">
              {error?.response?.data?.message}
            </Item.Text>
          )}{" "}
          <span style={{ fontWeight: "400", color: "#32356E" }}>
            Não é cliente?{" "}
            <Item.Link to="/register">
              <strong style={{ textDecoration: "underline" }}>
                Cadastre-se
              </strong>
            </Item.Link>
          </span>
        </form>
      </Item.Container>
      <div className={styles.wave}>
        <img src={FooterWave} alt="" width={"100%"} />
      </div>
    </div>
  );
};

export default Login;
