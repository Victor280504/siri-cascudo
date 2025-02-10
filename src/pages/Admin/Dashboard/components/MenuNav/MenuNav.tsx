import { PropsWithChildren } from "react";
import Item from "../../../../../components/ui/Item";

const MenuNav = ({ name, children }: PropsWithChildren & { name: string }) => {
  return (
    <Item.Row
      justifyContent="space-between"
      alignItems="center"
      width={"100%"}
      marginTop={"20px"}
      padding={"20px 30px"}
    >
      <Item.Subtitle color="#3C227C" margin={0} fontSize={"60px"}>
        {name}
      </Item.Subtitle>
      <Item.Row gap={"15px"} marginRight={"10px"}>
        {children}
      </Item.Row>
    </Item.Row>
  );
};

export default MenuNav;
