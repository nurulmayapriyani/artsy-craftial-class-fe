import React from "react";
import { connect } from "react-redux";

class Footer extends React.Component {
  render() {
    return (
      <div className="container-fluid mt-5 py-3 bg-body">
        <p className="mt-auto mb-auto fw-bold"> Copyright © 2022 - ArtsyCraftial (Pvt) Ltd. - All Rights Reserved.
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
