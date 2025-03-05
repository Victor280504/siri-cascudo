import styles from "./LandPage.module.css";
import Item from "../../components/ui/Item";
import {
  AcompImg,
  BackgroundLandpage,
  BebImg,
  BrunoImg,
  CombImg,
  EdmaraImg,
  HambImg,
  HamburguerLandpage,
  LandpageSection,
  MClaraImg,
  ProfileWB,
  SobrImg,
  VictorImg,
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
          <Item.Title color="#23C4DB" fontFamily="SFCompact">Caiu na rede, é peixe!</Item.Title>
          <Item.Subtitle color="#24C5DB"  fontFamily="SFCompactMedium" fontWeight={200}>
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
          <Actions link="/home#sanduiches" img={HambImg}>Sanduíches</Actions>
          <Actions link="/home#combos" img={CombImg}>Combos</Actions>
          <Actions link="/home#acompanhamentos" img={AcompImg}>Guarnições</Actions>
          <Actions link="/home#bebidas" img={BebImg}>Bebidas</Actions>
          <Actions link="/home#sobremesas" img={SobrImg}>sobremesas</Actions>
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
          <Item.Text
              color="#23C5DB"
              fontWeight={"bold"}
              marginBottom={"0"}
              marginTop={"0px"}
              fontSize={"60px"}
            >
              Sobre Nós
            </Item.Text>

            <Item.Text
              color="#252525"
              fontWeight={"bold"}
              marginBottom={"0"}
              marginTop={"10px"}
            >
              Projeto
            </Item.Text>
            <Item.Text color="#252525" fontSize={"24px"} fontWeight={400}>
            Desenvolvido na disciplina de Programação para Web,
            o E-commerce Siri Cascudo é uma página web destinada a
            facilitar e administrar as vendas de uma hamburgueria.
            </Item.Text>
            <Item.Text color="#252525">
              Clique abaixo e saiba mais sobre os desenvolvedores do projeto
            </Item.Text>
            <Item.Row gap={"25px"}>
              <Actions
                isLink={true}
                link="https://www.linkedin.com/in/maria-clara-de-oliveira-alexandre-173ba8245/"
                tam="smallProfile"
                fontSize="24px"
                color="#8260D7"
                fontWeight="500"
                img= {MClaraImg}
              >
                M.Clara
              </Actions>
              <Actions
                isLink={true}
                link="https://www.linkedin.com/in/victor-emanuel-tomaz-das-neves-226268292/"
                tam="smallProfile"
                fontSize="24px"
                color="#3D94E4"
                fontWeight="500"
                img={VictorImg}
              >
                Victor
              </Actions>
              <Actions
                isLink={true}
                link="https://www.linkedin.com/in/edmarar/"
                tam="smallProfile"
                fontSize="24px"
                color="#E35F5F"
                fontWeight="500"
                img={EdmaraImg}
              >
                Edmara
              </Actions>
              <Actions
                isLink={true}
                link="https://www.linkedin.com/in/brunoalejandrodev/"
                tam="smallProfile"
                fontSize="24px"
                color="#65BE4F"
                fontWeight="500"
                img={BrunoImg}
              >
                Bruno A.
              </Actions>
            </Item.Row>
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
  img,
}: PropsWithChildren & {
  isLink?: boolean;
  img?: string;
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
          <img src={img} className={styles[tam]} />
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
