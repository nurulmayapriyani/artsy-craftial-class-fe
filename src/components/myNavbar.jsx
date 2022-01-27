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
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import logo from "../assets/styles/logo.png";

class MyNavbar extends React.Component {
  render() {
    return (
      <Navbar color="body" light>
        <img src= {logo} alt="Logo" style={{
          height: "60px"
        }}/>
        <NavbarBrand
          tag={Link}
          to="/"
          className="text-warning font-weight-bold"
        >
          Artsy Craftial
        </NavbarBrand>
        <Nav>
          {this.props.userGlobal.username ? (
            <>
              {/*react fragment fungsi spt div.. its comment budu*/}
              <NavItem
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <NavbarText nav className="text-warning">
                  Hello, {this.props.userGlobal.username}
                </NavbarText>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="text-warning">
                  Pages
                </DropdownToggle>
                <DropdownMenu end>

                  {this.props.userGlobal.role !== "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/cart"
                        className="text-decoration-none text-warning"
                      >
                        Cart ({this.props.cartGlobal.cartList.length})
                      </Link>
                    </DropdownItem>
                  ): null}

                  {this.props.userGlobal.role !== "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/history"
                        className="text-decoration-none text-warning"
                      >
                        History
                      </Link>
                    </DropdownItem>
                  ): null}


                  {this.props.userGlobal.role === "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/admin"
                        className="text-decoration-none text-warning"
                      >
                        Admin
                      </Link>
                    </DropdownItem>
                  ) : null}

                  <DropdownItem divider />
                  <DropdownItem
                    className="text-warning"
                    onClick={this.props.logoutUser}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            <NavItem>
              <NavbarText>
                <Link to="/login">Login</Link> |{" "}
                <Link to="/register">Register</Link>
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
