import styles from "../../Profile/Profile.module.css";
import productStyles from "./Products.module.css";
import { z } from "zod";
import Item from "../../../components/ui/Item";
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
} from "../../../services/api";
import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteWithConfirmation from "../../../components/ui/Input/Delete";
import { AxiosError } from "axios";
import { TextArea } from "../../../components/ui/Input/TextArea/index.tsx";
import productService from "../../../services/productService.ts";
import { useParams } from "react-router-dom";
import { Product } from "../../../types/Products.ts";

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  idCategory: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  image: z
    .union([z.string(), z.instanceof(FileList).transform((list) => list[0])])
    .optional(),
});

const EditProduct = () => {
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
        const product = await productService.getById<Product>(id || "");
        return {
          name: product?.name,
          description: product?.description,
          quantity: product?.quantity.toString(),
          price: product?.price.toString(),
          idCategory: product?.idCategory.toString(),
          image: product?.image ?? "",
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

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    if (!id) {
      setServerError(true);
      return;
    }
    const res = await productService.update(id, formData);

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
    const res = await productService.delete(id || "");

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
        width={"100%"}
        paddingLeft={"5%"}
        paddingRight={"5%"}
        justifyContent="center"
        alignItems="start"
      >
        <Item.Text fontSize={"50px"} fontWeight={"bold"} color="#28356A">
          Produto
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
              className={productStyles.form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Item.Row alignItems="start">
                <Item.Col width={"50%"} gap={"20px"}>
                  <Input
                    width={"65%"}
                    type="text"
                    label="Nome"
                    editInput={true}
                    helperText={errors.name?.message?.toString()}
                    {...register("name")}
                  />
                  <Item.Row justifyContent="space-between" width={"65%"}>
                    <Input
                      type="text"
                      label="Quantidade"
                      editInput={true}
                      helperText={errors.quantity?.message?.toString()}
                      {...register("quantity")}
                    />
                    <Input
                      type="text"
                      label="Preço"
                      editInput={true}
                      helperText={errors.price?.message?.toString()}
                      {...register("price")}
                    />
                  </Item.Row>
                  <Input
                    width={"65%"}
                    type="text"
                    label="Categoria"
                    editInput={true}
                    helperText={errors.idCategory?.message?.toString()}
                    {...register("idCategory")}
                    disabled
                  />
                </Item.Col>
                <Item.Col width={"50%"} gap={"20px"}>
                  <TextArea
                    label="Descrição"
                    editInput={true}
                    width={"65%"}
                    helperText={errors.description?.message?.toString()}
                    {...register("description")}
                  />
                  <Input
                    type="file"
                    width={"65%"}
                    label="Imagem"
                    editInput={true}
                    helperText={errors.image?.message?.toString()}
                    {...register("image")}
                  />
                </Item.Col>
              </Item.Row>
              <div
                className={`${styles.buttons} ${styles.register}`}
                style={{ paddingLeft: "9%", paddingRight: "9%" }}
              >
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

export default EditProduct;
