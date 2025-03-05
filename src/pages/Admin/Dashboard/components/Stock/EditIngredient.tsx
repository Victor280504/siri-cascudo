import Item from "../../../../../components/ui/Item";
import { z } from "zod";
import { FieldValue, useForm } from "react-hook-form";
import {
  alertColor,
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
  ValidationError,
} from "../../../../../services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import ingredientService from "../../../../../services/ingredientService";
import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useId,
  useState,
} from "react";
import { Ingredient } from "../../../../../types/Ingredient";
import DeleteWithConfirmation from "../../../../../components/ui/Input/Delete";
import { AxiosError } from "axios";
import Alert from "react-bootstrap/Alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
});

const IngredientForm = ({
  ingredient,
  color,
  isLast,
}: {
  ingredient: Ingredient;
  color: string;
  isLast?: boolean;
}) => {
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState<
    ServerCreateResponse | ServerUpdateResponse | null | ServerError
  >();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty, isSubmitting },
    setError,
  } = useForm({
    defaultValues: async () => {
      return {
        description: ingredient?.description || "",
        quantity: ingredient?.quantity || 0,
        price: ingredient?.price,
      };
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (
    data: FieldValue<typeof formSchema> & Record<string, any>
  ) => {
    const newData = Object.keys(dirtyFields).reduce(
      (acc: Record<string, any>, key) => {
        acc[key] = data[key as keyof typeof data];
        return acc;
      },
      {} as Record<string, any>
    );

    console.log(newData);

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    if (!ingredient.id) {
      setServerError(true);
      return;
    }
    const res = await ingredientService.update(
      ingredient.id.toString(),
      formData
    );

    if ((res as ServerError).errors || (res as ServerError).error) {
      if ((res as ServerError).errors) {
        (res as ServerError).errors.forEach((error: ValidationError) => {
          setError(error.field as keyof typeof formSchema.shape, {
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
    const res = await ingredientService.delete(ingredient.id.toString() || "");
    if ((res as unknown as ServerError).errors) {
      (res as unknown as ServerError).errors.forEach(
        (error: ValidationError) => {
          setError(error.field as keyof typeof formSchema.shape, {
            message: error.message,
          });
        }
      );
      return res as ApiError | AxiosError;
    } else {
      if (res as ServerCreateResponse) {
        setTimeout(() => {
          setMessage(res as ServerCreateResponse);
        }, 2000);
        return res as ServerCreateResponse;
      }
    }
    return new Promise((_resolve, reject) =>
      reject(new Error("Unexpected error"))
    );
  };

  const mutation = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      // Invalida a query relacionada para forçar o refresh
      queryClient.invalidateQueries({ queryKey: ["ingredient/all"] });
    },
  });
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

  return (
    <>
      <Item.Row
        height="100px"
        alignItems="center"
        justifyContent="start"
        gap="100px"
        backgroundColor={color}
        borderRadius={isLast ? "0px 0px 20px 20px" : "0px"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: "7%",
            paddingLeft: "2%",
          }}
        >
          <StockInput
            title="description"
            type="text"
            textAlign="left"
            defaultValue={ingredient?.description || ""}
            helperText={errors.description?.message?.toString() || ""}
            {...register("description")}
          />
          <StockInput
            title="quantity"
            type="number"
            defaultValue={ingredient?.quantity || 0}
            helperText={errors.quantity?.message?.toString() || ""}
            textAlign="left"
            {...register("quantity", { valueAsNumber: true })}
          />
          <StockInput
            title="price"
            type="number"
            textAlign="left"
            step="0.01"
            defaultValue={ingredient.price || 0}
            helperText={errors.price?.message?.toString() || ""}
            isPrice
            {...register("price", { valueAsNumber: true })}
          />
          <Item.EditButton
            onClick={() => {
              setServerError(false);
              setMessage(null);
            }}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
          >
            Editar
          </Item.EditButton>
          <DeleteWithConfirmation
            id={ingredient.id.toString()}
            onDelete={() => mutation.mutateAsync()}
            link="admin/stock"
            handleLogout={false}
          />
        </form>
      </Item.Row>
      {serverError && (
        <Message
          message={message?.message || "Erro inesperado no servidor"}
          variant={message?.flag || "DANGER"}
          show={serverError}
        />
      )}
      {message && !serverError && (
        <Message
          variant={message?.flag || "LIGHT"}
          message={message?.message || ""}
          show={!serverError}
        />
      )}
    </>
  );
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
  fileType?: string;
  editInput?: boolean;
  textAlign?: "center" | "left" | "right";
  isPrice?: boolean;
};

const StockInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "",
      name = "",
      helperText = "",
      textAlign = "center",
      isPrice = false,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const hasError = helperText.length > 0;
    return (
      <div
        style={{
          width: "20%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          color: "#28356A",
        }}
      >
        {isPrice && <span style={{ marginRight: "5px" }}>R$</span>}
        <input
          id={inputId}
          style={{
            width: "100%",
            border: "none",
            background: "none",
            outline: "none",
            fontWeight: "400",
            fontSize: "22px",
            color: "#28356A",
            textAlign: textAlign,
          }}
          type={type}
          name={name}
          ref={ref}
          {...props}
        />
        {hasError && (
          <span style={{ width: "100%", fontSize: "14px", color: "#e35f5f" }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

export const Message = ({
  variant,
  message,
  show,
  width = "400px",
  zIndex = 10,
  right = "3%",
  bottom = "5%",
}: {
  variant: alertColor;
  message: string;
  show: boolean;
  zIndex?: number;
  right?: string;
  bottom?: string;
  width?: string;
}) => {
  return (
    <Alert
      style={{
        position: "fixed",
        width: width,
        right: right,
        bottom: bottom,
        zIndex: zIndex,
      }}
      show={show}
      key={variant}
      variant={variant?.toLowerCase()}
    >
      {message}
    </Alert>
  );
};

export default IngredientForm;
