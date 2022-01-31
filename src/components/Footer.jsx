import React from "react";
import "../assets/styles/productCard.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";

class Footer extends React.Component {
  render() {
    return (
      <div className="container-fluid mt-5 py-3 bg-body">
        <p className="mt-auto mb-auto"> Copyright © 2022 - ArtsyCraftial (Pvt) Ltd. - All Rights Reserved.
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
