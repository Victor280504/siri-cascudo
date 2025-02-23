import { Button } from "@radix-ui/themes";
import {
  AboutWave,
  HighLightsWave,
  Logo,
  ProductsWave,
  ProfileWB,
  Store,
} from "../../../assets";
import Item from "../../ui/Item";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import UserPopover from "../Popover";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <nav className={styles.navbar}>
      <Item.Row
        width={"100%"}
        justifyContent={"space-between"}
        marginTop={"10px"}
        marginLeft={"5%"}
        marginRight={"5%"}
      >
        <Item.Link to="/">
          <Item.Img src={Logo} alt="" width={"80px"} height={"80px"} />
        </Item.Link>
        {window.location.pathname === "/" && (
          <div className={styles.links}>
            <Item.Link to="/">
              <Item.Img
                src={HighLightsWave}
                alt=""
                position="absolute"
                height={"170px"}
                zIndex={10}
                top={0}
                left={"20%"}
                boxSizing="border-box"
              />
            </Item.Link>
            <Item.Link to="/products">
              <Item.Img
                src={ProductsWave}
                alt=""
                position="absolute"
                height={"170px"}
                zIndex={11}
                top={0}
                left={"32%"}
              />
            </Item.Link>
            <Item.Link to="/about">
              <Item.Img
                src={AboutWave}
                alt=""
                position="absolute"
                height={"170px"}
                zIndex={12}
                top={0}
                left={"44%"}
              />
            </Item.Link>
          </div>
        )}
        <Item.Container gap={"20px"}>
          {auth ? (
            <UserPopover
              homeButton={true}
              isOpen={open}
              setModalOpen={() => setOpen(!open)}
            >
              <Button radius="full" className={`${styles.button} ${styles.active}`}>
                <ProfileWB className={styles.profile} />
                Olá, {currentUser?.name.split(" ")[0]}
              </Button>
            </UserPopover>
          ) : (
            <Button
              radius="full"
              className={`${styles.button} ${styles.active}`}
              onClick={() => navigate("/login")}
            >
              <ProfileWB className={styles.profile} />
              Login
            </Button>
          )}
          <div className={styles.store}>
            <Store className={styles.profile} />
            <div className={styles.storeText}>1</div>
          </div>
        </Item.Container>
      </Item.Row>
    </nav>
  );
};

export default Navbar;
