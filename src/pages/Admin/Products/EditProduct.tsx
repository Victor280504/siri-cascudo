import styles from "../../Profile/Profile.module.css";
import productStyles from "./Products.module.css";
import { z } from "zod";
import Item from "../../../components/ui/Item";
import { Input } from "../../../components/ui/Input/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../services/api";
import { Controller, FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteWithConfirmation from "../../../components/ui/Input/Delete";
import { AxiosError } from "axios";
import { TextArea } from "../../../components/ui/Input/TextArea/index.tsx";
import productService from "../../../services/productService.ts";
import { useParams } from "react-router-dom";
import { Category, Product } from "../../../types/Products.ts";
import { Select } from "../../../components/ui/Input/Select/index.tsx";
import { useQuery } from "@tanstack/react-query";
import categoryService from "../../../services/categoryService.ts";
import { Message } from "../Dashboard/components/Stock/EditIngredient.tsx";

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  idCategory: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  image: z
    .union([
      z.string(),
      z.instanceof(FileList).transform((list) => {
        const file = list[0];
        return file;
      }),
    ])
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
    control,
  } = useForm({
    defaultValues: async () => {
      try {
        const product = await productService.getById<Product>(id || "");
        return {
          name: product?.name,
          description: product?.description,
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

  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category/all"],
    queryFn: async () => await categoryService.getAll(),
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

    if (newData.image == undefined) {
      delete newData.image;
    }

    if (newData.image instanceof File) {
      if (newData.image.size >= 5 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "A imagem deve ser menor que 5MB",
        });
        return;
      }
    }

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    if (!id) {
      setServerError(true);
      return;
    }
    const res = await productService.update(id, formData);

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
        setMessage(res as ServerUpdateResponse);
      }
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
    setTimeout(() => {
      setServerError(false);
    }, 3000);
  }, [serverError]);
  useEffect(() => {
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, [message]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (categoryLoading) {
    return <div>Loading...</div>;
  }

  if (categoryError) {
    return <div>Error</div>;
  }

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
        <Item.Row width='100%' alignItems="center" justifyContent="space-between">
          <Item.Row alignItems="center">
            <Link
              to="/admin/products"
              style={{ textDecoration: "none", marginTop: "5px" }}
            >
              <span className="material-symbols-outlined secondary lg">
                chevron_left
              </span>
            </Link>
            <Item.Text
              fontFamily="SFCompact"
              fontSize={"50px"}
              fontWeight={"bold"}
              color="#28356A"
              margin={0}
            >
              Produto
            </Item.Text>
          </Item.Row>
          <Item.Row alignItems="center">
            <Item.Text
              fontFamily="SFCompact"
              fontSize={"50px"}
              fontWeight={"bold"}
              color="#28356A"
              margin={0}
            >
              Receita
            </Item.Text>
            <Link
              to={`/admin/products/recipe/${id}`}
              style={{ textDecoration: "none", marginTop: "10px" }}
            >
              <span className="material-symbols-outlined secondary lg">
                chevron_right
              </span>
            </Link>
          </Item.Row>
        </Item.Row>
        <>
          {dataIsLoading && (
            <form
              className={productStyles.form}
              onSubmit={handleSubmit(onSubmit)}
              style={{
                marginTop: "5%",
              }}
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
                      label="Preço"
                      editInput={true}
                      helperText={errors.price?.message?.toString()}
                      {...register("price")}
                    />
                  </Item.Row>
                  <Controller
                    render={({ field }) => (
                      <Select width="65%" {...field} label="Categoria">
                        {category.map((cat: Category) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="idCategory"
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
                    {...register("image", {
                      validate: {
                        lessThan10MB: (value) =>
                          (value && value[0]?.size < 10 * 1024 * 1024) ||
                          "A imagem deve ser menor que 10MB",
                      },
                    })}
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
                  link="admin/products"
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
                      onClick={() => {
                        setServerError(false);
                        setMessage(null);
                      }}
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0",
            width: "100%",
          }}
        >
          {!dataIsLoading && (
            <Message
              message={"Carregando..."}
              variant={"INFO"}
              show={!dataIsLoading}
            />
          )}
          {serverError && dataIsLoading && (
            <Message
              message={message?.message || "Erro inesperado no servidor"}
              variant={message?.flag || "DANGER"}
              show={serverError}
            />
          )}
          {message && dataIsLoading && !serverError && (
            <Message
              message={message.message}
              variant={message.flag}
              show={!serverError}
            />
          )}
        </div>
      </Item.Col>
    </div>
  );
};

export default EditProduct;
