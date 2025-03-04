import Item from "../../../../../components/ui/Item";
import { Ingredient } from "../../../../../types/Ingredient";
import IngredientForm from "./EditIngredient";
const StockMenu = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <Item.Container
      marginTop="3%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Item.Table backgroundColor="#F3F3F3">
        <Item.THead>
          <Item.TR alignItems="start">
            <Item.TH
              width="20%"
              fontWeight={"400"}
              borderRadius={"20px 0px 0px 0px"}
              textAlign="left"
              paddingLeft="7.3%"
            >
              Produto
            </Item.TH>
            <Item.TH width="20%" fontWeight={"400"}>
              Quantidade
            </Item.TH>
            <Item.TH width="25%" fontWeight={"400"}>
              Preço
            </Item.TH>
            <Item.TH width="20%" paddingLeft='3%' fontWeight={"400"}>
              {""}
            </Item.TH>
            <Item.TH
              width="20%"
              fontWeight={"400"}
              borderRadius={"0px 20px 0px 0px"}
              paddingRight="7.3%"
            >
              {""}
            </Item.TH>
          </Item.TR>
        </Item.THead>
        <Item.TBody width={"100%"}>
          {ingredients.map((ingredient, index) => (
            <Item.TR key={ingredient.id} width={"100%"}>
              <Item.TD colSpan={5} width={"100%"}>
                <IngredientForm
                  ingredient={ingredient}
                  color={index % 2 == 0 ? "none" : "#E4E4E4"}
                  isLast={index == ingredients.length - 1}
                />
              </Item.TD>
            </Item.TR>
          ))}
        </Item.TBody>
      </Item.Table>
    </Item.Container>
  );
};

export default StockMenu;
