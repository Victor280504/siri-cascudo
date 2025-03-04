import Item from "../../components/ui/Item";
import styles from "./Home.module.css";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "../../types/Products";
import { Section, SectionList } from "./ProductItem";

const Home = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products/all"],
    queryFn: async () => await productService.getAll(),
  });

  // const sectionColors = ["#CDD5F6", "#F7DBA5", "#F8F5B8", "#FFD9E4", "#CCECCA"];

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
        <Item.Title fontFamily="SFCompact" color="#23C4DB">
          Menu
        </Item.Title>
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
                <SectionList menuItems={menuItems} color={"#caf9ff"} />
              </Section>
            );
          })}
      </Item.Container>
    </Item.Container>
  );
};

export default Home;
