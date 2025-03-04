import styles from "../../../../Profile/Profile.module.css";
import categoryStyles from "../../../Category/Category.module.css";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../../../hooks/useAuth.ts";
import {
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../../../services/api.ts";
import ingredientService from "../../../../../services/ingredientService.ts";
import Item from "../../../../../components/ui/Item/index.tsx";
import { Input } from "../../../../../components/ui/Input/index.tsx";
import { Message } from "./EditIngredient.tsx";


const schema = z.object({
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const RegisterIngredient = () => {
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
  } = useForm({
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

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    const res = await ingredientService.create(newData);

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
          navigate("/admin/stock");
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
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
        <Item.Row alignItems="center" position="relative">
          <Link
            to="/admin/stock"
            style={{
              textDecoration: "none",
              marginTop: "5px",
              position: "absolute",
              left: "-60px",
            }}
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
            Ingrediente
          </Item.Text>
        </Item.Row>
        <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
          {serverError && (
            <Message
              message={message?.message || "Erro inesperado no servidor"}
              variant={message?.flag || "DANGER"}
              show={serverError}
            />
          )}
          {message && (
            <Message
              message={message.message}
              variant={message.flag}
              show={!serverError}
            />
          )}
        </div>
        <>
          <form
            className={categoryStyles.form}
            onSubmit={handleSubmit(onSubmit)}
            style={{ marginTop: "5%" }}
          >
            <Input
              width={"100%"}
              type="text"
              label="Nome do Ingrediente"
              editInput={true}
              helperText={errors.description?.message?.toString()}
              required
              {...register("description")}
            />
            <Item.Row justifyContent="space-between" alignItems="start">
              <Input
                defaultValue={0}
                width={"35%"}
                type="number"
                label="Quantidade"
                editInput={true}
                helperText={errors.quantity?.message?.toString()}
                required
                {...register("quantity", { valueAsNumber: true })}
              />
              <Input
                defaultValue={0}
                width={"60%"}
                type="number"
                label="Preço"
                step="0.01"
                editInput={true}
                helperText={errors.price?.message?.toString()}
                required
                {...register("price", { valueAsNumber: true })}
              />
            </Item.Row>
            <div
              className={`${styles.buttons} ${styles.register}`}
              style={{
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
      </Item.Col>
    </div>
  );
};


export default RegisterIngredient;
