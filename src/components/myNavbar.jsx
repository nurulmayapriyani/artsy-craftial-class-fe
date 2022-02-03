import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  NavbarBrand,
  NavbarText,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Link: has the same function like tag a but it's from react-router-dom. It has props named "to"
import { Link, Navigate } from "react-router-dom";
// connect from react-redux karena kita ingin menunjukkan username di dlm navbar
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import logo from "../assets/styles/logo.png";
import { FaShoppingCart } from "react-icons/fa";

class MyNavbar extends React.Component {
  state = {
    navigate: false,
  };

  onLogout = () => {
    this.props.logoutUser();
    // navigate logout to home page so page will reload and clearing all state or store
    window.location.href = "/";
  };

  render() {
    if (this.state.navigate) {
      this.state.navigate = false;
      return <Navigate to="/" />;
    }

    return (
      <Navbar color="body" light>
        {/* to make brand send us to home page when it's clicked */}
        <NavbarBrand
          tag={Link}
          to="/"
          className="text-warning font-weight-bold text-align-start"
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "60px",
              marginRight: "10px",
            }}
          />
          <span className="fw-bold fs-4">Artsy Craftial</span>
        </NavbarBrand>
        <Nav>
          {/* jika true jalankan yg di dlm react fragment*/}
          {this.props.userGlobal.username ? (
            <>
              {/*react fragment memiliki fungsi spt div, utk menyatukan dua element terpisah yaitu NavItem & UncontrolledDropdown*/}
              <NavItem
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <NavbarText nav className="text-warning fs-4 fw-bold">
                  Hello, {this.props.userGlobal.username}
                </NavbarText>
              </NavItem>
              <NavItem
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "10px",
                }}
              >
                {this.props.userGlobal.role !== "admin" ? (
                  <Link
                    to="/cart"
                    className="text-decoration-none text-warning fw-bold fs-4"
                  >
                    <FaShoppingCart />
                    {/* cartList berasal dari cart.js reducer */}(
                    {this.props.cartGlobal.cartList.length})
                  </Link>
                ) : null}
              </NavItem>
              {/* nav to declare if the dropdown is in navbar */}
              <UncontrolledDropdown nav inNavbar>
                {/* caret to give a small arrow */}
                <DropdownToggle nav caret className="text-warning fs-4 fw-bold">
                  Pages
                </DropdownToggle>
                {/* to make align dropdown menu move to left so they can compeletely show not cut*/}
                <DropdownMenu end>
                  {this.props.userGlobal.role !== "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/history"
                        className="text-decoration-none text-warning fs-5 fw-bold"
                      >
                        History
                      </Link>
                    </DropdownItem>
                  ) : null}

                  {/* hanya jika login sbg admin yg dpt melihat dan masuk ke admin page */}
                  {this.props.userGlobal.role === "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/admin"
                        className="text-decoration-none text-warning fw-bold fs-5"
                      >
                        Admin
                      </Link>
                    </DropdownItem>
                  ) : null}

                  {/* divider: memberikan garis tipis pemisah antara dropdown item sebelumnya */}
                  <DropdownItem divider />
                  <DropdownItem
                    className="text-warning fw-bold fs-5"
                    onClick={this.onLogout}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            // jika salah jalankan yg di dlm kurung setelah titik dua
            <NavItem>
              <NavbarText>
                {/* Link memiliki default display inline */}
                <Link
                  className="text-warning text-decoration-none fs-4 fw-bold"
                  to="/login"
                >
                  Login
                </Link>{" "}
                |{" "}
                <Link
                  className="text-warning text-decoration-none fs-4 fw-bold"
                  to="/register"
                >
                  Register
                </Link>
              </NavbarText>
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);
