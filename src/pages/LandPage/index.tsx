import styles from "./LandPage.module.css";
import Item from "../../components/ui/Item";
import {
  BackgroundLandpage,
  HamburguerLandpage,
  LandpageSection,
  ProfileWB,
} from "../../assets";
import { PropsWithChildren } from "react";

const LandPage = () => {
  return (
    <Item.Container display={"flex"} flexDirection={"column"}>
      <img src={BackgroundLandpage} alt="" className={styles.background} />
      <img src={LandpageSection} alt="" className={styles.section} />
      <div className={styles.sectionOne}>
        <Item.Col
          margin={"0 0 0 5%"}
          width={"50%"}
          height={"600px"}
          justifyContent="center"
          alignItems="flex-start"
          gap={"15px"}
        >
          <Item.Title color="#23C4DB">Caiu na rede, é peixe!</Item.Title>
          <Item.Subtitle color="#24C5DB">
            Novo Hambúrguer de Peixe
          </Item.Subtitle>
          <Item.Text width={"566px"} color="#AD7405">
            O ’Maré Burger’ possui uma combinação irresistível de filé de peixe
            selecionado, tempero especial e ingredientes frescos. Feito para
            quem busca sabor e qualidade em cada mordida.
          </Item.Text>
          <Item.Text width={"566px"} color="#AD7405">
            Peça agora e experimente o sabor único do fundo do mar!
          </Item.Text>
        </Item.Col>
        <Item.Img src={HamburguerLandpage} alt="" />
      </div>
      <div className={styles.sectionDiv}>
        <Item.Row
          width={"100%"}
          justifyContent="space-between"
          marginLeft={"3%"}
          marginRight={"3%"}
        >
          <Actions link="/home#sanduiches">Sanduíches</Actions>
          <Actions link="/home#combos">Combos</Actions>
          <Actions link="/home#acompanhamentos">Guarnições</Actions>
          <Actions link="/home#bebidas">Bebidas</Actions>
          <Actions link="/home#sobremesas">sobremesas</Actions>
        </Item.Row>
        <Item.Row
          width={"100%"}
          height={"70%"}
          display="flex"
          justifyContent="space-between"
          paddingRight={"3%"}
          paddingLeft={"3%"}
        >
          <Item.Subtitle
            color="#FFFFFF"
            width={"25%"}
            alignSelf="end"
            margin={0}
            paddingBottom={"20px"}
          >
            Hambúrguer de Siri Original
          </Item.Subtitle>
          <Item.Subtitle
            color="#FFFFFF"
            width={"25%"}
            alignSelf="end"
            paddingBottom={"20px"}
            margin={0}
          >
            Hambúrguer de Siri Original
          </Item.Subtitle>
          <Item.Title
            color="#FFFFFF"
            width={"30%"}
            paddingLeft={"2%"}
            textAlign="center"
          >
            <Item.Link to="/home">Ver Todo o Catálogo</Item.Link>
          </Item.Title>
        </Item.Row>
      </div>
      <Item.Container
        width={"100%"}
        justifyContent="flex-start"
        paddingTop={"5%"}
        alignItems="start"
        height={"700px"}
        backgroundColor="#CAF9FF"
        gap={"15px"}
      >
        <Item.Row
          width={"100%"}
          justifyContent="start"
          alignItems="flex-start"
          paddingLeft={"5%"}
          gap={"30px"}
        >
          <ProfileWB className={styles.bigProfile} />
          <Item.Col alignItems="flex-start" gap={"5px"} width={"65%"}>
            <Item.Row gap={"25px"}>
              <Actions
                isLink={false}
                tam="smallProfile"
                fontSize="24px"
                color="#AD7405"
                fontWeight="400"
              >
                M.Clara
              </Actions>
              <Actions
                isLink={false}
                tam="smallProfile"
                fontSize="24px"
                color="#AD7405"
                fontWeight="400"
              >
                Victor
              </Actions>
              <Actions
                isLink={false}
                tam="smallProfile"
                fontSize="24px"
                color="#AD7405"
                fontWeight="400"
              >
                Edmara
              </Actions>
              <Actions
                isLink={false}
                link="/home"
                tam="smallProfile"
                fontSize="24px"
                color="#AD7405"
                fontWeight="400"
              >
                Bruno A.
              </Actions>
            </Item.Row>
            <Item.Text
              color="#23C5DB"
              fontWeight={"bold"}
              marginBottom={"0"}
              marginTop={"10px"}
            >
              Projeto
            </Item.Text>
            <Item.Text color="#23C5DB" fontSize={"24px"}>
              O ’Maré Burger’ possui uma combinação irresistível de filé de
              peixe selecionado, tempero especial e ingredientes frescos. Feito
              para quem busca sabor e qualidade em cada mordida.
            </Item.Text>
            <Item.Text color="#23C5DB">
              Peça agora e experimente o sabor único do fundo do mar!
            </Item.Text>
          </Item.Col>
        </Item.Row>
      </Item.Container>
    </Item.Container>
  );
};

const Actions = ({
  children,
  link = "/",
  tam = "profile",
  fontSize = "30px",
  color = "#FFFFFF",
  fontWeight = "bold",
  isLink = true,
}: PropsWithChildren & {
  isLink?: boolean;
  link?: string;
  tam?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
}) => {
  return (
    <Item.Container
      width={"100%"}
      justifyContent="center"
      alignItems="center"
      gap={"15px"}
    >
      {isLink ? (
        <Item.Link to={link}>
          <ProfileWB className={styles[tam]} />
          <Item.Subtitle
            color={color}
            textAlign="center"
            fontSize={fontSize}
            marginTop={"10px"}
            fontWeight={fontWeight}
          >
            {children}
          </Item.Subtitle>
        </Item.Link>
      ) : (
        <Item.Col>
          <ProfileWB className={styles[tam]} />
          <Item.Subtitle
            color={color}
            textAlign="center"
            fontSize={fontSize}
            marginTop={"10px"}
            fontWeight={fontWeight}
          >
            {children}
          </Item.Subtitle>
        </Item.Col>
      )}
    </Item.Container>
  );
};

export default LandPage;
