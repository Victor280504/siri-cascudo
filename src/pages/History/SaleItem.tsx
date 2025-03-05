import { CSSProperties, useState } from "react";
import Item from "../../components/ui/Item";
import { Sale, Sales } from "../../types/Sale";
import saleService from "../../services/saleService";
import { Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteWithConfirmation from "../../components/ui/Input/Delete";
import {
  ApiError,
  ServerCreateResponse,
  ServerError,
} from "../../services/api";
import { AxiosError } from "axios";

type SaleListProps = {
  sales: Sale[];
  gridTemplateColumns?: string;
  color?: string;
  isDeletable?: boolean;
};

export const SaleList = ({
  sales,
  gridTemplateColumns = "1fr 1fr",
  color = "#8260D7",
  isDeletable,
}: SaleListProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        alignItems: "start",
        gridTemplateColumns: gridTemplateColumns,
        gap: "20px",
        marginTop: "3%",
      }}
    >
      {sales.map((sale) => (
        <SaleItem
          key={sale.id}
          sale={sale}
          titleColor={color}
          isDeletable={isDeletable}
        />
      ))}
    </div>
  );
};

type SaleItemProps = {
  sale: Sale;
  titleColor?: string;
  isDeletable?: boolean;
};

export const SaleItem = ({
  sale,
  titleColor = "#008EA0",
  isDeletable = false,
}: SaleItemProps) => {
  const [message, setMessage] = useState<
    ServerCreateResponse | ServerError | null
  >();
  const {
    data: saleData,
    isLoading: saleDataLoading,
    isError: saleDataError,
  } = useQuery({
    queryKey: ["saleData/names", sale.id],
    queryFn: async () =>
      await saleService.getByIdWithDetails<Sales>(sale.id.toString()),
  });

  const onDelete = async (): Promise<
    ApiError | AxiosError | ServerCreateResponse
  > => {
    const res = await saleService.delete(sale.id.toString() || "");
    if ((res as unknown as ServerError).error) {
      setMessage(res as ServerError);
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales/all"] });
    },
  });

  if (saleDataLoading) {
    return <Spinner animation="border" variant={"dark"} />;
  }

  if (saleDataError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "#ff4d4f",
        }}
      >
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn't load the data. Please try again later.</p>
      </div>
    );
  }
  return (
    <div
      style={{
        borderRadius: "24px",
        width: "100%",
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        backgroundColor: "#F3F3F3",
      }}
    >
      <Item.Row
        width={"100%"}
        backgroundColor={titleColor}
        alignItems="end"
        justifyContent="space-between"
        borderRadius={"24px 24px 0 0"}
        padding={"20px 20px 10px 20px"}
      >
        <Item.Text
          color="#FFFFFF"
          fontFamily="SFCompactMedium"
          fontSize={"30px"}
          lineHeight={1}
          textAlign="left"
          margin={0}
        >
          Pedido #{sale.id}
        </Item.Text>
        <Item.Text
          color="#FFFFFF"
          fontSize={"16px"}
          lineHeight={1}
          fontWeight="lighter"
          textAlign="left"
          margin={0}
          opacity={0.7}
        >
          {new Date(sale.date).toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          ,{" "}
          {new Date(sale.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Item.Text>
      </Item.Row>{" "}
      <Item.Col
        width={"100%"}
        justifyContent="center"
        alignContent="start"
        padding={"20px"}
      >
        <SaleItemElements
          title="Forma de Pagamento"
          value={sale.paymentMethod}
          titleColor={titleColor}
          alignItems="start"
          justifyContent="start"
          width={"100%"}
          gap={"5px"}
          fontWeight={"bold"}
        />
        {saleData?.products && saleData.products.length > 0 && (
          <SaleItemElements
            fontWeight={"bold"}
            title="Produtos"
            value={
              saleData?.products
                ?.map(
                  (product) =>
                    `${product.quantity}x ${product.product.name} - R$${product.value}`
                )
                .join("\n") || ""
            }
            titleColor={titleColor}
            flexDirection="column"
            alignItems="start"
            justifyContent="start"
            width={"100%"}
            whiteSpace="pre-wrap"
          />
        )}
        <SaleItemElements
          title="TOTAL"
          fontSize={"20px"}
          value={`R$ ${sale.total}`}
          titleColor={titleColor}
          flexDirection="row"
          alignItems="center"
          fontWeight={"bold"}
          justifyContent="end"
          width={"100%"}
          gap={"10px"}
          textTwo="30px"
        />
        {isDeletable && (
          <Item.Row width={"100%"} justifyContent="end" marginTop={"3%"}>
            <DeleteWithConfirmation
              id={sale.id.toString()}
              onDelete={() => mutation.mutateAsync()}
              link="admin/delivery"
              onlyDelete={true}
              alternativeMessage={message}
              setAlternativeMessage={() => setMessage(null)}
              handleLogout={false}
            />
          </Item.Row>
        )}
      </Item.Col>
    </div>
  );
};

type SaleItemElementProps = CSSProperties & {
  title: string;
  value: string;
  titleColor?: string;
  orientation?: "row" | "column";
  textTwo?: string;
  textTwoFontWeight?: string;
};

const SaleItemElements = ({
  title,
  value,
  titleColor = "#008EA0",
  textTwo,
  textTwoFontWeight,
  ...props
}: SaleItemElementProps) => {
  return (
    <Item.Container display="flex" textAlign="left" {...props}>
      <Item.Text
        margin={0}
        color={titleColor}
        fontFamily="SFCompactMedium"
        fontWeight={props.fontWeight || 500}
        fontSize={props.fontSize || "20px"}
      >
        {title}:
      </Item.Text>
      <Item.Text
        margin={0}
        color="#000000"
        fontFamily="SFCompactMedium"
        fontSize={textTwo || "20px"}
        fontWeight={textTwoFontWeight || 500}
      >
        {value}
      </Item.Text>
    </Item.Container>
  );
};
