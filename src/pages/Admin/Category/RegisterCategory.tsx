import styles from "../../Profile/Profile.module.css";
import categoryStyles from "./Category.module.css";
import { z } from "zod";
import Item from "../../../components/ui/Item/index.tsx";
import { Input } from "../../../components/ui/Input/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../services/api.ts";
import { FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import categoryService from "../../../services/categoryService.ts";
import { Message } from "../Dashboard/components/Stock/EditIngredient.tsx";

const schema = z.object({
  name: z.string(),
});

const RegisterCategory = () => {
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

    const res = await categoryService.create(newData);

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
          navigate("/admin");
        }, 3000);
      }
    }
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
        <Item.Row alignItems="center" position="relative">
          <Link
            to="/admin/products"
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
            Categoria
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
          {message && !serverError && (
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
              label="Nome da Categoria"
              editInput={true}
              helperText={errors.name?.message?.toString()}
              {...register("name")}
            />
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

export default RegisterCategory;
