import styles from "../../Profile/Profile.module.css";
import categoryStyles from "./Category.module.css";
import { z } from "zod";
import Item from "../../../components/ui/Item/index.tsx";
import { Input } from "../../../components/ui/Input/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../services/api.ts";
import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteWithConfirmation from "../../../components/ui/Input/Delete/index.tsx";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { Product } from "../../../types/Products.ts";
import categoryService from "../../../services/categoryService.ts";

const schema = z.object({
  name: z.string().optional(),
});

const EditCategory = () => {
  const { currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState(false);
  const [dataIsLoading, setdataIsLoading] = useState(false);
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
        const product = await categoryService.getById<Product>(id || "");
        return {
          name: product?.name,
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

    console.log(newData);

    if (!id) {
      setServerError(true);
      return;
    }
    const res = await categoryService.update(id, newData);

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
    const res = await categoryService.delete(id || "");

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
        setTimeout(() => {
          navigate(`/admin`);
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
        width={"40%"}
        paddingLeft={"5%"}
        paddingRight={"5%"}
        justifyContent="center"
        alignItems="start"
      >
        <Item.Text fontSize={"50px"} fontWeight={"bold"} color="#28356A">
          Categoria
        </Item.Text>
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
        <>
          {dataIsLoading && (
            <form
              className={categoryStyles.form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                width={"100%"}
                type="text"
                label="Nome"
                editInput={true}
                helperText={errors.name?.message?.toString()}
                {...register("name")}
              />
              <div className={`${styles.buttons} ${styles.register}`}>
                <DeleteWithConfirmation
                  id={id || ""}
                  onDelete={onDelete}
                  link="/"
                  handleLogout={false}
                />
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
              </div>
            </form>
          )}
        </>
      </Item.Col>
    </div>
  );
};

export default EditCategory;
