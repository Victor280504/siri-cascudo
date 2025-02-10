import { PropsWithChildren } from "react";
import Item from "../../../../../components/ui/Item";
import styles from "../Dashboard.module.css";

const MenuContent = ({
  children,
  title,
  subtitle,
}: PropsWithChildren & { title: string; subtitle: string }) => {
  return (
    <div className={styles.item}>
      <Item.Row
        width={"100%"}
        justifyContent="space-between"
        alignItems="center"
      >
        <h2 className={styles.menu_title}>{title}</h2>
        <button className={styles.button} style={{ padding: "0" }}>
          <span className="material-symbols-outlined secondary md">
            chevron_right
          </span>
        </button>
      </Item.Row>
      <p className={styles.menu_subtitle}>{subtitle}</p>
      {children}
    </div>
  );
};

export default MenuContent;
