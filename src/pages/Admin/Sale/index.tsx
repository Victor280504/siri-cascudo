import { Sale } from "../../../types/Sale";
import { SaleList } from "../../History/SaleItem";

type SaleMenuProps = {
  sales: Sale[];
};

const SaleMenu = ({ sales }: SaleMenuProps) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          maxHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <SaleList sales={sales} gridTemplateColumns="1fr" color={"#8260D7"} isDeletable={true} />
      </div>
    </div>
  );
};

export default SaleMenu;
