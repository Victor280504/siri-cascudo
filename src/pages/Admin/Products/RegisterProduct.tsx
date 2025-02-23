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
import { TextArea } from "../../../components/ui/Input/TextArea/index.tsx";
import productService from "../../../services/productService.ts";
import { Select } from "../../../components/ui/Input/Select/index.tsx";
import { useQuery } from "@tanstack/react-query";
import categoryService from "../../../services/categoryService.ts";
import { Category } from "../../../types/Products.ts";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.preprocess((val) => Number(val), z.number()),
  price: z.preprocess((val) => Number(val), z.number()),
  idCategory: z.preprocess((val) => Number(val), z.number()),
  image: z.union([
    z.string(),
    z.instanceof(FileList).transform((list) => {
      const file = list[0];
      return file;
    }),
  ]),
});

const RegisterProduct = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
    control,
  } = useForm({
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
    console.log(newData);
    if (newData.image == undefined) {
      newData.delete("image");
    }

    if (newData.image instanceof File) {
      if (newData.image.size >= 10 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "A imagem deve ser menor que 10MB",
        });
        return;
      }
    }

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    const res = await productService.create(formData);

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
          navigate("/admin/products");
        }, 3000);
      }
    }
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
            fontSize={"50px"}
            fontWeight={"bold"}
            color="#28356A"
            margin={0}
          >
            Produto
          </Item.Text>
        </Item.Row>
        <>
          <form
            className={productStyles.form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Item.Row alignItems="start">
              <Item.Col width={"50%"} gap={"20px"}>
                <Input
                  required
                  width={"65%"}
                  type="text"
                  label="Nome"
                  editInput={true}
                  helperText={errors.name?.message?.toString()}
                  {...register("name")}
                />
                <Item.Row justifyContent="space-between" width={"65%"}>
                  <Input
                    required
                    type="number"
                    label="Quantidade"
                    width={"40%"}
                    editInput={true}
                    helperText={errors.quantity?.message?.toString()}
                    {...register("quantity")}
                  />
                  <Input
                    required
                    type="number"
                    step="0.01"
                    label="Preço"
                    width={"40%"}
                    editInput={true}
                    helperText={errors.price?.message?.toString()}
                    {...register("price")}
                  />
                </Item.Row>
                <Controller
                  render={({ field }) => (
                    <Select width="65%" {...field} label="Categoria" required>
                      {category.map((cat: Category) => (
                        <>
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        </>
                      ))}
                    </Select>
                  )}
                  control={control}
                  name="idCategory"
                />
              </Item.Col>
              <Item.Col width={"50%"} gap={"20px"}>
                <TextArea
                  required
                  label="Descrição"
                  editInput={true}
                  width={"65%"}
                  helperText={errors.description?.message?.toString()}
                  {...register("description")}
                />
                <Input
                  required
                  type="file"
                  width={"65%"}
                  label="Imagem"
                  editInput={true}
                  helperText={errors.image?.message?.toString()}
                  {...register("image", {
                    validate: {
                      lessThan10MB: (files) =>
                        files[0]?.size < 10 * 1024 * 1024 ||
                        "A imagem deve ser menor que 10MB",
                    },
                  })}
                />
              </Item.Col>
            </Item.Row>
            <div
              className={`${styles.buttons} ${styles.register}`}
              style={{
                paddingLeft: "9%",
                paddingRight: "9%",
                justifyContent: "end",
              }}
            >
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
                        <span className={`material-symbols-outlined light sm`}>
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
                    {isSubmitting ? "Criando..." : "Criar"}
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
                        check
                      </span>
                      Criar
                    </>
                  </button>
                </div>
              )}
            </div>
          </form>
        </>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0",
            width: "100%",
          }}
        >
          {serverError && (
            <p style={{ margin: "0", color: "#e35f5f", fontWeight: "bold" }}>
              {message?.message ? message.message : "Erro no servidor"}{" "}
            </p>
          )}
          {message && !serverError && (
            <p style={{ margin: "0", color: "#899f88", fontWeight: "bold" }}>
              {message.message}
            </p>
          )}
        </div>
      </Item.Col>
    </div>
  );
};

export default RegisterProduct;
