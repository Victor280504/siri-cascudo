import styles from "./Menu.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PropsWithChildren } from "react";

type MenuProps = PropsWithChildren;

interface ItemProps {
  children: React.ReactNode;
  link: string;
  onClick?: () => void;
}

const Container = ({ children }: MenuProps) => {
  return <div>{children}</div>;
};

const Nav = ({ children, disabled }: MenuProps & { disabled: boolean }) => {
  return (
    <div className={`${styles.nav} ${!disabled ? styles.disabled : ""}`}>
      {children}
    </div>
  );
};

const Footer = ({ children }: MenuProps) => {
  return <div className={styles.footer}>{children}</div>;
};

const Items = ({ children }: MenuProps) => {
  return <div className={styles.items}>{children}</div>;
};

const Item = ({ children, link, onClick }: ItemProps) => {
  return (
    <Link to={link} onClick={onClick} className={styles.item}>
      {children}
    </Link>
  );
};

interface SuspenseProps extends PropsWithChildren {
  children: [React.ReactNode, React.ReactNode];
}

const Suspense = ({ children }: SuspenseProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={styles.suspense}>
        {children[0]}
        <button
          className={styles.suspense_btn}
          onClick={() => setOpen(!open)}
        ></button>
      </div>
      <div
        className={
          open
            ? `${styles.suspense_items}`
            : `${styles.suspense_items} ${styles.hide}`
        }
      >
        {children[1]}
      </div>
    </>
  );
};

const Text = ({ children }: MenuProps) => {
  return <p className={styles.p}>{children}</p>;
};

Container.Item = Item;
Container.Suspense = Suspense;
Container.Text = Text;
Container.Items = Items;
Container.Nav = Nav;
Container.Footer = Footer;

export default Container;
