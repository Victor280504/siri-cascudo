import Item from "../../../components/ui/Item";

type IngredientTableProps = {
  ingredients: any[];
  onClick: (index: number) => void;
  isView?: boolean;
};

export const IngredientsTable = ({
  ingredients,
  onClick,
  isView,
}: IngredientTableProps) => {
  return (
    <Item.Table
      margin="20px 0"
      width="100%"
      borderRadius="20px"
      backgroundColor="#F3F3F3"
    >
      <Item.THead>
        <Item.TR width="100%">
          <Item.TH
            borderRadius="20px 0px 0px 0px"
            width="50%"
            fontSize="20px"
            textAlign="left"
            paddingLeft="20px"
            fontWeight={400}
          >
            Ingrediente
          </Item.TH>
          <Item.TH
            width="40%"
            fontSize="20px"
            textAlign="left"
            paddingLeft="20px"
            fontWeight={400}
          >
            Quantidade
          </Item.TH>
          <Item.TH borderRadius="0px 20px 0px 0px" width="10%"></Item.TH>
        </Item.TR>
      </Item.THead>
      <Item.TBody>
        {ingredients.map((ingredient, index) => (
          <Item.TR key={ingredient.id}>
            <Item.TD
              textAlign="left"
              color="#28356a"
              fontWeight={300}
              paddingTop="10px"
              paddingBottom="10px"
              paddingLeft="20px"
            >
              {ingredient.description}
            </Item.TD>
            <Item.TD
              textAlign="left"
              color="#28356a"
              fontWeight={300}
              paddingTop="10px"
              paddingBottom="10px"
              paddingLeft="20px"
            >
              {ingredient.quantity}
            </Item.TD>
            <Item.TD>
              {!isView && (
                <button
                  style={{
                    background: "none",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                  onClick={() => onClick(index)}
                >
                  <span className="material-symbols-outlined secondary sm">
                    delete
                  </span>
                </button>
              )}
            </Item.TD>
          </Item.TR>
        ))}
      </Item.TBody>
    </Item.Table>
  );
};
