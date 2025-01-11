import { FooterWave } from "../../../assets";
import Item from "../../ui/Item";

const Footer = () => {
  return (
    <footer style={{ width: "100%", height: "15vh" }}>
      <img
        src={FooterWave}
        alt=""
        width={"100%"}
        style={{ position: "absolute", zIndex: "10", bottom: "0" }}
      />
      <Item.Col
        width={"100%"}
        position="absolute"
        zIndex={11}
        justifyContent="center"
      >
        <Item.Text color="#FFFFFF" marginBottom={"5px"}>
          Desenvolvido na cadeira de Desenvolvimento Web 2024.2 - Sistemas e
          Mídias Digitais
        </Item.Text>
        <Item.Text color="#FFFFFF" fontWeight={'bold'}>Universidade Federal do Ceará</Item.Text>
      </Item.Col>
    </footer>
  );
};

export default Footer;
