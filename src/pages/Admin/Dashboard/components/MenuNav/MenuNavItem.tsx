import { PropsWithChildren } from "react";
import styles from "../../Dashboard.module.css";

const MenuNavItem = ({
  children,
  icon,
  onClick,
}: PropsWithChildren & { to?: string; icon: string; onClick?: () => void }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className="material-symbols-outlined primary md">{icon}</span>
      <p className={styles.button_text}>{children}</p>
    </button>
  );
};

export default MenuNavItem;