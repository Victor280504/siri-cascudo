import { PropsWithChildren } from "react";
import styles from "../../Dashboard.module.css";
import { Link } from "react-router-dom";

const MenuNavItem = ({
  children,
  icon,
  onClick,
  link,
}: PropsWithChildren & {
  to?: string;
  icon: string;
  onClick?: () => void;
  link?: string;
  current?: string;
}) => {
  const urlPath = window.location.pathname;
  const lastParam = urlPath.substring(urlPath.lastIndexOf("/") + 1);
  const isActive = "/admin/" + lastParam === link;
  if (!onClick && link) {
    return (
      <Link
        to={link}
        className={`${styles.button} ${styles.link} ${
          isActive ? styles.active : ""
        }`}
      >
        <span className="material-symbols-outlined primary md">{icon}</span>
        <p className={styles.button_text}>{children}</p>
      </Link>
    );
  }
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <span className="material-symbols-outlined primary md">{icon}</span>
      <p className={styles.button_text}>{children}</p>
    </button>
  );
};

export default MenuNavItem;
