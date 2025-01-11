import { PropsWithChildren } from "react";
import Item from "../../components/ui/Item";
import styles from "./Home.module.css";
import { HamburguerImg } from "../../assets";

const menuItems = [
  {
    id: "1",
    link: "/sanduiche1",
    title: "Sanduíche de Frango",
    description: "Delicioso sanduíche de frango com alface e tomate.",
    price: 12.99,
    img: HamburguerImg,
  },
  {
    id: "2",
    link: "/sanduiche2",
    title: "Sanduíche de Carne",
    description: "Sanduíche de carne com queijo e cebola caramelizada.",
    price: 15.99,
    img: HamburguerImg,
  },
  {
    id: "3",
    link: "/sanduiche3",
    title: "Sanduíche Vegano",
    description: "Sanduíche vegano com grão-de-bico e abacate.",
    price: 13.99,
    img: HamburguerImg,
  },
];

const Home = () => {
  return (
    <Item.Container flexDirection="column">
      <Item.Col
        alignItems="start"
        width={"100%"}
        padding={"3% 7%"}
        position="relative"
        boxSizing="border-box"
      >
        <Item.Title color="#23C4DB">Menu</Item.Title>
        <Item.Row
          justifyContent="space-between"
          position="absolute"
          width={"85%"}
          bottom={-35}
          boxSizing="border-box"
        >
          <div className={styles.navItem}>
            <Item.Link
              to="#sanduiche"
              width={"100%"}
              height={"100%"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Sanduíches
            </Item.Link>
          </div>
          <div className={styles.navItem}>
            <Item.Link
              to="#combos"
              width={"100%"}
              height={"100%"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Combos
            </Item.Link>
          </div>
          <div className={styles.navItem}>
            <Item.Link
              to="#acompanhamento"
              width={"100%"}
              height={"100%"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Acompanhamentos
            </Item.Link>
          </div>
          <div className={styles.navItem}>
            <Item.Link
              to="#bebidas"
              width={"100%"}
              height={"100%"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Bebidas
            </Item.Link>
          </div>
          <div className={styles.navItem}>
            <Item.Link
              to="#sobremesas"
              width={"100%"}
              height={"100%"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Sobremesas
            </Item.Link>
          </div>
        </Item.Row>
      </Item.Col>
      <Item.Container
        width={"100%"}
        flexDirection='column'
        justifyContent="flex-start"
        padding={"3% 7%"}
        paddingTop={"5%"}
        paddingBottom={"20%"}
        alignItems="start"
        backgroundColor="#CAF9FF"
        gap={"15px"}
      >
        <Section title="Sanduíches" id="sanduiche">
          <SectionList menuItems={menuItems} color="#CDD5F6" />
        </Section>
        <Section title="Combos" id="combos">
          <SectionList menuItems={menuItems} color="#F7DBA5" />
        </Section>
        <Section title="Acompanhamentos" id="acompanhamento">
          <SectionList menuItems={menuItems.slice(0, 1)} color="#F8F5B8" />
        </Section>
        <Section title="Bebidas" id="bebidas">
          <SectionList menuItems={menuItems.slice(0, 1)} color="#FFD9E4" />
        </Section>
        <Section title="Sobremesas" id="sobremesas">
          <SectionList menuItems={menuItems.slice(0, 1)} color="#CCECCA" />
        </Section>
      </Item.Container>
    </Item.Container>
  );
};

const Section = ({
  children,
  title,
  id,
}: PropsWithChildren & { title?: string; id?: string }) => {
  return (
    <Item.Col alignItems="start" width={"100%"}>
      <div id={id}>
        <Item.Subtitle marginBottom={'20px'}>{title}</Item.Subtitle>
      </div>
      {children}
    </Item.Col>
  );
};

interface SectionItemProps {
  id: string;
  link: string;
  title: string;
  description: string;
  price: number;
  img: string;
  color?: string;
}

interface SectionListProps {
  menuItems: SectionItemProps[];
}

const SectionList = ({
  menuItems,
  color,
}: SectionListProps & { color: string }) => {
  return (
    <>
      {menuItems.map((item) => (
        <SectionItem
          key={item.id}
          link={item.link}
          title={item.title}
          description={item.description}
          price={item.price}
          img={item.img}
          color={color}
          id={item.id}
        />
      ))}
    </>
  );
};

const SectionItem = ({
  link,
  title,
  description,
  price,
  img,
  color,
}: SectionItemProps) => {
  return (
    <div
      className={styles.sectionItem}
      style={{ transition: "transform 0.2s", transform: "scale(1)" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Item.Link to={link} width={"100%"} height={"100%"}>
        <Item.Container
          width={"100%"}
          height={"100%"}
          padding={"10px"}
          gap={"10px"}
        >
          <Item.Row
            width={"100%"}
            padding={"10px"}
            backgroundColor="#FFF"
            alignItems="start"
            borderRadius={"10px"}
            gap={"10px"}
            position="relative"
          >
            <Item.Container
              backgroundColor={color}
              borderRadius={"32px"}
              width={"18%"}
              height={"200px"}
              justifyContent="center"
            >
              <Item.Img src={img} alt={title} width={"70%"} />
            </Item.Container>
            <Item.Col alignItems="start" paddingLeft={"20px"} width={"70%"}>
              <Item.Text fontWeight={"bold"} fontSize={"32px"}>
                {title}
              </Item.Text>
              <p className={styles.itemDescription}>{description}</p>
            </Item.Col>
            <Item.Container
              position="absolute"
              backgroundColor={color}
              width={"185px"}
              height={"64px"}
              borderRadius={"32px"}
              right={0}
              top={0}
              justifyContent="center"
              alignItems="center"
            >
              <Item.Text
                fontWeight="bold"
                fontFamily={"Roboto, sans-serif"}
                fontSize={"28px"}
                margin={0}
              >
                R${price}
              </Item.Text>
            </Item.Container>
          </Item.Row>
        </Item.Container>
      </Item.Link>
    </div>
  );
};

export default Home;
