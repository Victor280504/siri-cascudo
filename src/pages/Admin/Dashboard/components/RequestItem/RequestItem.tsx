import { useState } from "react";
import Item from "../../../../../components/ui/Item";
import styles from "../Dashboard.module.css";
import { Line } from "../../../../../assets";

interface RequestsInfo {
  pending: number;
  done: number;
  delivered: number;
}

interface RequestItemProps {
  today: RequestsInfo;
  week: RequestsInfo;
}

const RequestItem = ({ today, week }: RequestItemProps) => {
  const [buttonActive, setButtonActive] = useState(true);
  return (
    <>
      <Item.Row
        marginTop="10px"
        justifyContent="space-between"
        alignItems="center"
        width={"100%"}
      >
        <button
          className={
            buttonActive
              ? styles.button_item_selected
              : styles.button_item_inactive
          }
          onClick={() => setButtonActive(true)}
        >
          Hoje
        </button>
        <button
          className={
            buttonActive
              ? styles.button_item_inactive
              : styles.button_item_selected
          }
          onClick={() => setButtonActive(false)}
        >
          Últimos 7 dias
        </button>
      </Item.Row>
      <Item.Col
        marginTop={"20px"}
        width={"100%"}
        height={"50%"}
        justifyContent="space-between"
      >
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Pendentes
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.pending : week.pending}
          </Item.Text>
        </div>
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Feitos
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.done : week.done}
          </Item.Text>
        </div>
        <div className={styles.requestLine}>
          <Item.Text
            color="#8990ad"
            width={"100px"}
            margin={0}
            fontSize={"20px"}
          >
            Entregues
          </Item.Text>
          <Line className={styles.divider} />
          <Item.Text color="#8990ad" margin={0} fontSize={"20px"}>
            {buttonActive ? today.delivered : week.delivered}
          </Item.Text>
        </div>
      </Item.Col>
    </>
  );
};

export default RequestItem;
