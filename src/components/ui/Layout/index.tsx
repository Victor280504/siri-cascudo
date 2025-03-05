// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../../navigation/Navbar";
import Footer from "../../navigation/Footer";

const Layout = () => {
  return (
    <div id="layout">
      <div id="inner" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh" }}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
