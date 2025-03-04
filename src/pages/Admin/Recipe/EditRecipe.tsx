import styles from "../../Profile/Profile.module.css";
import Item from "../../../components/ui/Item/index.tsx";
import { useAuth } from "../../../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
} from "../../../services/api.ts";
import DeleteWithConfirmation from "../../../components/ui/Input/Delete/index.tsx";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import recipeService from "../../../services/recipeService.ts";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import { Message } from "../Dashboard/components/Stock/EditIngredient.tsx";
import { IngredientsTable } from "./IngredientsTable.tsx";
import ingredientService from "../../../services/ingredientService.ts";
import { Ingredient } from "../../../types/Ingredient.ts";
import { Recipe } from "../../../types/Recipe.ts";

const EditRecipe = () => {
  const { currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState<
    ServerError | ServerUpdateResponse | ServerCreateResponse | null
  >(null);

  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recipes/all"],
    queryFn: async () => await recipeService.getById<Recipe[]>(id || ""),
  });
  const {
    data: ingredient,
    isLoading: ingredientLoading,
    isError: ingredientError,
  } = useQuery({
    queryKey: ["ingredient/all"],
    queryFn: async () => await ingredientService.getAll(),
  });

  const onDelete = async (): Promise<
    ApiError | AxiosError | ServerCreateResponse
  > => {
    if (!currentUser) {
      setServerError(true);
    }
    const res = await recipeService.delete(id || "");

    if ((res as unknown as ServerError).errors) {
      setServerError(true);
      return res as ApiError | AxiosError;
    } else {
      if (res as ServerCreateResponse) {
        setMessage(res as ServerCreateResponse);
        setTimeout(() => {
          navigate(`/admin/products`);
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
          {!isLoading ||
            (!ingredientLoading && (
              <Spinner
                style={{ position: "absolute", top: "50%", right: "50%" }}
                animation="border"
                role="status"
              />
            ))}
          {(isError && isLoading) ||
            (ingredientError && ingredientLoading && (
              <Message
                message={message?.message || "Erro ao carregar dados :("}
                variant={message?.flag || "DANGER"}
                show={serverError}
              />
            ))}
          {serverError && isLoading && ingredientLoading && (
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
        {recipes &&
          recipes?.length === 0 &&
          !ingredientLoading &&
          !isLoading && (
            <div
              style={{
                textAlign: "center",
                border: "2px solid #28356A",
                borderRadius: "20px",
                padding: "100px",
                marginTop: "20%",
              }}
            >
              <Item.Text
                marginTop={"20%"}
                fontSize={"30px"}
                fontWeight={"bold"}
                color="#a4a4a4"
                margin={0}
              >
                Nenhuma receita cadastrada!
              </Item.Text>
              <Item.Link to={`/admin/recipes/new/${id}`}>
                <Item.Text fontSize={"20px"} color="#28356A" margin={0} textDecoration={"underline"}>
                  Clique aqui para cadastrar uma receita para esse produto!
                </Item.Text>
              </Item.Link>
            </div>
          )}
        {recipes && recipes?.length > 0 && !ingredientLoading && !isLoading && (
          <>
            <IngredientsTable
              onClick={() => {}}
              ingredients={
                ingredient
                  ?.filter((ing: Ingredient) =>
                    recipes?.some(
                      (recipe: Recipe) => recipe.idIngredient === ing.id
                    )
                  )
                  .map((ing: Ingredient) => ({
                    ...ing,
                    quantity: recipes?.find(
                      (recipe: Recipe) => recipe.idIngredient === ing.id
                    )?.quantity,
                  })) || []
              }
              isView={true}
            />
            <div className={`${styles.buttons} ${styles.register}`}>
              <DeleteWithConfirmation
                id={id || ""}
                onDelete={onDelete}
                link="/"
                handleLogout={false}
              />
            </div>
          </>
        )}
      </Item.Col>
    </div>
  );
};

export default EditRecipe;
