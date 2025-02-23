import { PropsWithChildren } from "react";
import Item from "../../components/ui/Item";
import styles from "./Home.module.css";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "../../types/Products";

const Home = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products/all"],
    queryFn: async () => await productService.getAll(),
  });

  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category/all"],
    queryFn: async () => await categoryService.getAll(),
  });

  if (productsLoading || categoryLoading) {
    return <div>Loading...</div>;
  }

  if (productsError || categoryError) {
    return <div>Error...</div>;
  }
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
          {category &&
            category.map((cat: Category) => (
              <div className={styles.navItem} key={cat.id}>
                <Item.Link
                  to={`#${cat.name.toLowerCase()}`}
                  width={"100%"}
                  height={"100%"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {cat.name}
                </Item.Link>
              </div>
            ))}
        </Item.Row>
      </Item.Col>
      <Item.Container
        width={"100%"}
        flexDirection="column"
        justifyContent="flex-start"
        padding={"3% 7%"}
        paddingTop={"5%"}
        paddingBottom={"20%"}
        alignItems="start"
        backgroundColor="#CAF9FF"
        gap={"15px"}
      >
        {category &&
          category.map((cat: Category) => {
            const menuItems = products.filter(
              (item: Product) => item.idCategory === cat.id
            );
            return (
              <Section title={cat.name} key={cat.id} id={cat.name}>
                <SectionList menuItems={menuItems} color="#CDD5F6" />
              </Section>
            );
          })}
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
      <div id={id?.toLowerCase()}>
        <Item.Subtitle marginBottom={"20px"}>{title}</Item.Subtitle>
      </div>
      {children}
    </Item.Col>
  );
};

interface SectionItemProps {
  id: string;
  link: string;
  name: string;
  description: string;
  price: number;
  image: string;
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
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          color={color}
          id={item.id}
        />
      ))}
    </>
  );
};

const SectionItem = ({
  link,
  name,
  description,
  price,
  image,
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
              <Item.Img src={image} alt={name} width={"70%"} />
            </Item.Container>
            <Item.Col alignItems="start" paddingLeft={"20px"} width={"70%"}>
              <Item.Text fontWeight={"bold"} fontSize={"32px"}>
                {name}
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
