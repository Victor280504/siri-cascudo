import styles from "./Menu.module.css";
import Container from "./Menu.tsx";
import Item from "../../ui/Item/index.tsx";
import { Input } from "../../ui/Input/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiService, {
  ApiError,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../services/api.ts";
import { api } from "../../../services/index.ts";
import { User } from "../../../types/User.ts";
import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteWithConfirmation from "../../ui/Input/Delete/index.tsx";

interface MenuProps {
  isOpen: boolean;
  tabIndex?: number;
  setModalOpen: () => void;
}

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  login: z.string().optional(),
  password: z.string().optional(),
});

const Menu = ({ isOpen, setModalOpen, tabIndex }: MenuProps) => {
  const { currentUser } = useAuth();
  const service = new apiService(api, "/user");
  const navigate = useNavigate();
  const [dataIsLoading, setdataIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState<
    ServerError | ServerUpdateResponse | null
  >(null);
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty, isSubmitting },
    setError,
  } = useForm({
    defaultValues: async () => {
      try {
        const user = await service.getById<User>(currentUser?.id || "");
        return {
          name: user.name,
          email: user.email,
          password: "",
          address: user.address,
          login: user.login,
        };
      } catch (error) {
        if (((error as ApiError).message = "Identificador inválido")) {
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
    const res = await service.update(currentUser.id, newData);

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
          navigate(`/home`);
        }, 2000);
      }
    }
  };

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
        <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
          {!dataIsLoading && (
            <p style={{ margin: "0", color: "#d6faff", fontWeight: "bold" }}>
              Carregando...
            </p>
          )}
          {serverError && (
            <p style={{ margin: "0", color: "#e35f5f", fontWeight: "bold" }}>
              Erro ao carregar dados
            </p>
          )}
        </div>
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
          <Input
            type="text"
            label="Username"
            editInput={true}
            helperText={errors.login?.message?.toString()}
            {...register("login")}
          />
          <div className={styles.buttons}>
            {isDirty ? (
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar"}
              </button>
            ) : (
              <button type="submit" className={styles.button} disabled>
                Criar
              </button>
            )}
          </div>
        </form>
        <DeleteWithConfirmation
          id={currentUser?.id || ""}
          onDelete={() => service.delete(currentUser?.id || "")}
          link="/"
        />
      </div>
    </>
  );
};

export default Menu;
