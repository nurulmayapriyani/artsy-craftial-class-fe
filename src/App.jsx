import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import History from "./pages/History";
import ProductDetail from "./pages/ProductDetail";
import MyNavbar from "./components/myNavbar";
import Footer from "./components/Footer";
import "./App.css";
// krn ingin menggunakan actions creator dari redux yaitu userKeepLogin maka harus import connect dri react-redux juga
import { connect } from "react-redux";
import { userKeepLogin, checkStorage } from "./redux/actions/user";
import { getCartData } from "./redux/actions/cart";
// import background from "./assets/main_bg.jpg";
import "./assets/styles/gradientStyle.css";

class App extends React.Component {
  // componentDidMount: supaya userKeepLogin trigger setiap kali app kita masuk
  componentDidMount() {
    // userDataEmmerce: key dari item yg kita ingin cari
    // jika bisa dpt datanya yg direturn adalah datanya, jika tdk bisa dpt datanya yg direturn adalah null
    // jika kita tdk dpt data userLocalStorage brrti user blm login
    const userLocalStorage = localStorage.getItem("userDataEmmerce");

    // if jika ada isi condition akan true, jika tdk ada isi akan menjadi null yg berarti akan false
    if (userLocalStorage) {
      // krn yg di setItem adalah object yg distringify (membuat sebuah object/json menjadi sebuah string) maka harus ubah string menjadi object lagi
      // JSON.parse mengubah object yg mnjd string menjadi object lagi
      const userData = JSON.parse(userLocalStorage);
      // alasan getCartData di simpan bersama userKeep Login karena kita mau ambil cart dari user yg sdh login
      this.props.userKeepLogin(userData);
      // getCartData meminta userId yg blm bisa kita dapatkan dri redux karena justru di dlm userKeepLogin dia yg set reduxnya tp kita bisa dapatkan dari variable userdata di atas
      this.props.getCartData(userData.id);
    } else {
      // jika ini tdk ada, ketika logout dan direfresh akan muncul Loading karena checkstorage tdk dipanggil maka tdk ada yg mengubah storageIsChecked menjadi true sdgkn storageIsChecked yg menjadi kunci utk masuk ke dlm aplikasi kita yaitu di dlm render
      this.props.checkStorage();
    }
  }

  render() {
    // kondisi ketika refresh dan masih login
    if (this.props.userGlobal.storageIsChecked) {
      return (
        <div className="App ">
          {/* BrowserRouter, Route, Routes: condition when changing url will show different pages, import all the elements above */}
          {/* BrowerRouter:  to make apperance of UI or page synchronize the url */}
          <BrowserRouter tag="div">
            {/* MyNavBar is outside to make it state for every pages */}
            <MyNavbar />
            <div className="flex-grow-1">
              {/* Routes: to check its children which are the Route and render the first one that matched the url*/}
              {/* Route: to declare every path render to each element*/}
              <Routes>
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<Admin />} path="/admin" />
                <Route element={<Cart />} path="/cart" />
                <Route element={<History />} path="/history" />
                <Route
                  element={<ProductDetail />}
                  // :/productid agar bisa akses produk detail dg id masing2 produk
                  path="/product-detail/:productId"
                />
                <Route element={<Home />} path="/" />
              </Routes>
            </div>
            <Footer></Footer>
          </BrowserRouter>
          {/* <img className="bg-image" src={background}></img> */}
        </div>
      );
    }

    // kondisi ketika refresh tidak login
    return <div>Loading...</div>;
  }
}

// jika memanggil lewat redux maka harus buat mapStateToProps
const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
