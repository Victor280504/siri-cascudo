import styles from "./Item.module.css";
import { PropsWithChildren } from "react";

const Container = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <div className={styles.container} style={{ ...props }}>
      {children}
    </div>
  );
};

const Row = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <div className={styles.row} style={props}>
      {children}
    </div>
  );
};

const Col = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <div className={styles.col} style={props}>
      {children}
    </div>
  );
};

const Link = ({
  children,
  to,
  ...props
}: PropsWithChildren & { to: string } & React.CSSProperties) => {
  return (
    <a href={to} className={styles.link} style={props}>
      {children}
    </a>
  );
};

const Title = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <h1 className={styles.title} style={props}>
      {children}
    </h1>
  );
};

const Subtitle = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <h2 className={styles.subtitle} style={props}>
      {children}
    </h2>
  );
};

const Text = ({
  children,
  ...props
}: PropsWithChildren & React.CSSProperties) => {
  return (
    <p className={styles.text} style={props}>
      {children}
    </p>
  );
};

const Img = ({
  src,
  alt,
  ...props
}: { src: string; alt: string } & React.CSSProperties) => {
  return <img className={styles.img} src={src} alt={alt} style={props} />;
};

const Item = { Container, Row, Col, Link, Img, Title, Subtitle, Text };

export default Item;
