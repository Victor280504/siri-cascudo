import styles from "./Profile.module.css";
import { z } from "zod";
import { ProfileWB } from "../../assets";
import Item from "../../components/ui/Item";
import { Input } from "../../components/ui/Input/index.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiService, {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../services/api.ts";
import { api } from "../../services/index.ts";
import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userService from "../../services/userService";
import { UserById } from "../../types/User.ts";
import DeleteWithConfirmation from "../../components/ui/Input/Delete";
import { AxiosError } from "axios";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  login: z.string().optional(),
  password: z.string().optional(),
});

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const service = new apiService(api, "/user");
  const navigate = useNavigate();
  const [dataIsLoading, setdataIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState<
    ServerError | ServerUpdateResponse | ServerCreateResponse | null
  >(null);
  const [isHover, setIsHover] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty, isSubmitting },
    setError,
  } = useForm({
    defaultValues: async () => {
      try {
        const user = await service.getById<UserById>(currentUser?.id || "");
        return {
          name: user?.name,
          email: user?.email,
          password: "",
          address: user?.address,
        };
      } catch (error) {
        if (((error as ApiError).status = 404)) {
          setServerError(true);
        }
      } finally {
        setdataIsLoading(true);
      }
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (
    data: FieldValue<typeof schema> & Record<string, any>
  ) => {
    const newData = Object.keys(dirtyFields).reduce(
      (acc: Record<string, any>, key) => {
        acc[key] = data[key as keyof typeof data];
        return acc;
      },
      {} as Record<string, any>
    );

    if (!currentUser) {
      setServerError(true);
      return;
    }
    const res = await userService.update(newData);

    if ((res as ServerError).errors) {
      (res as ServerError).errors.forEach((error: ValidationError) => {
        setError(error.field as keyof typeof schema.shape, {
          message: error.message,
        });
      });
    } else {
      if (res as ServerUpdateResponse) {
        setMessage(res as ServerUpdateResponse);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    }
  };

  const onDelete = async (): Promise<
    ApiError | AxiosError | ServerCreateResponse
  > => {
    if (!currentUser) {
      setServerError(true);
    }
    const res = await userService.delete(currentUser?.id || "");

    if ((res as unknown as ServerError).errors) {
      (res as unknown as ServerError).errors.forEach(
        (error: ValidationError) => {
          setError(error.field as keyof typeof schema, {
            message: error.message,
          });
        }
      );
      return res as ApiError | AxiosError;
    } else {
      if (res as ServerCreateResponse) {
        setMessage(res as ServerCreateResponse);
        logout();
        setTimeout(() => {
          navigate(`/home`);
        }, 2000);
        return res as ServerCreateResponse;
      }
    }
    return new Promise((_resolve, reject) =>
      reject(new Error("Unexpected error"))
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingBottom: "10%",
      }}
    >
      <Item.Col
        width={"30%"}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <Link
          to={`${
            currentUser?.roles.includes("ADMIN") ? "/admin/report" : "/home"
          }`}
          style={{
            textDecoration: "none",
            marginTop: "5px",
            position: "absolute",
            top: "0",
            left: "-100px",
          }}
        >
          <span className="material-symbols-outlined secondary lg">
            chevron_left
          </span>
        </Link>
        <SmallProfile admin={currentUser?.roles.includes("ADMIN")} />
        <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
          {!dataIsLoading && (
            <p style={{ margin: "0", color: "#a17b18", fontWeight: "bold" }}>
              Carregando...
            </p>
          )}
          {serverError && (
            <p style={{ margin: "0", color: "#e35f5f", fontWeight: "bold" }}>
              Erro ao carregar dados
            </p>
          )}
          {message && (
            <p style={{ margin: "0", color: "#899f88", fontWeight: "bold" }}>
              {message.message}
            </p>
          )}
        </div>
        {dataIsLoading && (
          <>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="text"
                label="Nome"
                editInput={true}
                helperText={errors.name?.message?.toString()}
                {...register("name")}
              />
              <Input
                type="text"
                label="Endereço"
                editInput={true}
                helperText={errors.address?.message?.toString()}
                {...register("address")}
              />
              <Input
                type="email"
                label="Email"
                editInput={true}
                helperText={errors.email?.message?.toString()}
                {...register("email")}
              />
              <Input
                type="password"
                label="Senha"
                editInput={true}
                placeholder="*********"
                helperText={errors.password?.message?.toString()}
                {...register("password")}
                disabled
              />
              <div className={styles.buttons}>
                {isDirty ? (
                  <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                  >
                    <button
                      type="submit"
                      className={styles.button}
                      disabled={isSubmitting}
                    >
                      {isHover ? (
                        <>
                          <span
                            className={`material-symbols-outlined light sm`}
                          >
                            check
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className={`material-symbols-outlined editnew sm`}
                          >
                            check
                          </span>
                        </>
                      )}
                      {isSubmitting ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                ) : (
                  <div
                    style={{ width: "100px" }}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                  >
                    <button type="submit" className={styles.button} disabled>
                      <>
                        <span className={`material-symbols-outlined light sm`}>
                          edit
                        </span>
                        Editar
                      </>
                    </button>
                  </div>
                )}
                <DeleteWithConfirmation
                  id={currentUser?.id || ""}
                  onDelete={onDelete}
                  link="/"
                  handleLogout={true}
                />
              </div>
            </form>
          </>
        )}
      </Item.Col>
    </div>
  );
};

const SmallProfile = ({ admin = false }: { admin?: boolean }) => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Item.Row
        width={"100%"}
        justifyContent="flex-start"
        alignItems="end"
        gap={"25px"}
        marginBottom={"30px"}
      >
        <ProfileWB width={150} height={150} />
        <Item.Col width={"65%"} justifyContent="end" alignItems="baseline">
          <Item.Text
            color="#23C4DB"
            fontSize={"50px"}
            lineHeight={1}
            fontWeight="bold"
            margin={0}
          >
            Seu perfil
          </Item.Text>
          <Item.Text fontWeight="bold" margin={0}>
            {admin ? <Link to={"/admin"} className={styles.link}>Administrador</Link> : "Cliente"}
          </Item.Text>
        </Item.Col>
      </Item.Row>
    </div>
  );
};

export default Profile;
