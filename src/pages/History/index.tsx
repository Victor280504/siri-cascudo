import { useQuery } from "@tanstack/react-query";
import Item from "../../components/ui/Item";
import { SaleList } from "./SaleItem";
import saleService from "../../services/saleService";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Sale } from "../../types/Sale";

const History = () => {
  const { currentUser } = useAuth();
  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery({
    queryKey: ["sales/id"],
    queryFn: async () =>
      await saleService.getAllByUserId<Sale[]>(currentUser?.id || ""),
  });

  if (salesLoading) {
    return <Spinner animation="border" variant={"dark"} />;
  }

  if (salesError) {
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
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: "10%",
        marginTop: "3%",
      }}
    >
      <Item.Col
        width={"80%"}
        position="relative"
        justifyContent="center"
        alignContent="start"
      >
        <Link
          to={`${"/home"}`}
          style={{
            textDecoration: "none",
            position: "absolute",
            top: "0",
            left: "-70px",
          }}
        >
          <span className="material-symbols-outlined blue lg">
            chevron_left
          </span>
        </Link>
        <Item.Text
          width={"100%"}
          color="#23C4DB"
          fontFamily="SFCompact"
          fontSize={"60px"}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          margin={0}
        >
          Histórico de Pedidos{" "}
        </Item.Text>
        {sales && <SaleList sales={sales} color="#008EA0"/>}
      </Item.Col>
    </div>
  );
};

export default History;
