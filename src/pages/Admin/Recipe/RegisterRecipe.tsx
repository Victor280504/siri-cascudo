import styles from "../../Profile/Profile.module.css";
import categoryStyles from "./Category.module.css";
import { z } from "zod";
import Item from "../../../components/ui/Item/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../services/api.ts";
import { Control, Controller, FieldValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "../Dashboard/components/Stock/EditIngredient.tsx";
import { useQuery } from "@tanstack/react-query";
import ingredientService from "../../../services/ingredientService.ts";
import { Ingredient } from "../../../types/Ingredient.ts";
import { Select } from "../../../components/ui/Input/Select/index.tsx";
import { IngredientsTable } from "./IngredientsTable.tsx";
import recipeService from "../../../services/recipeService.ts";
import { Input } from "../../../components/ui/Input/index.tsx";

const schema = z.object({
  product: z.string(),
  items: z.array(
    z.object({
      idProduct: z.string(),
      idIngredient: z.number(),
      quantity: z.coerce.number().int().positive(),
    })
  ),
  selectedIngredient: z.string(),
  selectedQuantity: z.coerce.number(),
});

type FormValues = z.infer<typeof schema>;

const RegisterRecipe = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState<
    ServerError | ServerUpdateResponse | ServerCreateResponse | null
  >(null);
  const [isHover, setIsHover] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (
    data: FieldValue<typeof schema> & Record<string, any>
  ) => {
    if (!currentUser) {
      setServerError(true);
      return;
    }

    const res = await recipeService.create(data.items);

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
          navigate("/admin/products");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = watch("items") || [];

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
            to={`/admin/products/${id}`}
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
            Receita
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
            <Item.Input
              control={control}
              name="product"
              label="Produto"
              required
              defaultValue={id}
              disabled
            />
            <AddIngredientToRecipe
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
            <div
              className={`${styles.buttons} ${styles.register}`}
              style={{
                justifyContent: "end",
              }}
            >
              {values.length > 0 ? (
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

type AddIngredientProps = {
  control: Control<FormValues>;
  watch: (name: keyof FormValues) => any;
  setValue: (name: keyof FormValues, value: any) => void;
  errors?: any;
};

const AddIngredientToRecipe = ({
  control,
  watch,
  setValue,
  errors,
}: AddIngredientProps) => {
  const values = watch("items") || [];

  // 🔹 Garante que os valores do select e input sejam sempre controlados
  const selectedIngredient = watch("selectedIngredient") || "";
  const selectedQuantity = watch("selectedQuantity") || 0;

  const {
    data: ingredient,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ingredient/all"],
    queryFn: async () => await ingredientService.getAll(),
  });

  const onAddIngredient = () => {
    const selectedIngredientId = Number(selectedIngredient);
    const selectedQty = Number(selectedQuantity);

    if (!selectedIngredientId) {
      alert("Escolha um ingrediente válido!");
      return;
    }

    if (!selectedQty || selectedQty <= 0) {
      alert("Escolha uma quantidade válida!");
      return;
    }

    if (
      selectedQty >
      ingredient.find((i: Ingredient) => i.id === selectedIngredientId)
        ?.quantity
    ) {
      alert("Quantidade ultrapassou o limite do estoque!");
      return;
    }

    if (
      values.some((item: any) => item.idIngredient === selectedIngredientId)
    ) {
      alert("Este ingrediente já foi adicionado!");
      return;
    }

    setValue("items", [
      ...values,
      {
        idProduct: watch("product"),
        idIngredient: selectedIngredientId,
        quantity: selectedQty,
      },
    ]);

    // 🔹 Resetando os valores após adicionar
    setValue("selectedIngredient", "");
    setValue("selectedQuantity", 0);
  };

  if (isError) return <div>Error...</div>;
  if (isLoading) return <div>Loading...</div>;
  console.log(values);
  return (
    <Item.Col width="100%" alignItems="start">
      <Item.Row width="100%" justifyContent="space-between" alignItems="start">
        {/* Select para escolher o ingrediente */}
        <Controller
          render={({ field }) => (
            <Select
              width="45%"
              {...field}
              label="Ingrediente"
              title="Ingrediente"
              value={selectedIngredient} // 🔹 Sempre definido
              onChange={(e) => setValue("selectedIngredient", e.target.value)}
            >
              <option value="">Selecione um ingrediente</option>
              {ingredient.map((ing: Ingredient) => (
                <option key={ing.id} value={ing.id}>
                  {ing.description}
                </option>
              ))}
            </Select>
          )}
          control={control}
          name="selectedIngredient"
        />

        {/* Input para definir a quantidade */}
        <Controller
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Quantidade"
              width="20%"
              editInput
              value={selectedQuantity} // 🔹 Sempre definido
              max={
                ingredient.find(
                  (ing: Ingredient) => ing.id === Number(selectedIngredient)
                )?.quantity || 0
              } // 🔹 Definindo o valor máximo / tenho que pensar sobre isso depois
              onChange={(e) =>
                setValue("selectedQuantity", Number(e.target.value))
              }
              helperText={
                errors.selectedQuantity?.message?.toString() || undefined
              }
            />
          )}
          control={control}
          name="selectedQuantity"
        />

        {/* Botão de adicionar ingrediente */}
        <button
          type="button"
          onClick={onAddIngredient}
          style={{
            width: "20%",
            height: "50px",
            fontSize: "20px",
            backgroundColor: "#28356A",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            alignSelf: "center",
            marginTop: "15px",
          }}
        >
          Adicionar
        </button>
      </Item.Row>

      {/* Exibição da tabela com ingredientes adicionados */}
      {values.length > 0 && (
        <IngredientsTable
          ingredients={values.map((value: any) => ({
            id: value.idIngredient,
            description:
              ingredient.find((i: Ingredient) => i.id === value.idIngredient)
                ?.description || "Ingrediente Desconhecido",
            quantity: value.quantity,
          }))}
          onClick={(index: number) => {
            const updatedValues = values.filter(
              (_: any, i: any) => i !== index
            );
            setValue("items", updatedValues);
          }}
        />
      )}
    </Item.Col>
  );
};

export default RegisterRecipe;
