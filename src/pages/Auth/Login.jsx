import React from "react";
import { Link, Navigate } from "react-router-dom";
// bcs we also want to enter loginUser to redux flow so we have to connect redux which is connect
import { loginUser } from "../../redux/actions/user";
import { connect } from "react-redux";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
  };

  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value });
  };

  render() {
    // jika sdh punya id di dlm redux brrti otomatis sdh ada yg login
    if (this.props.userGlobal.id) {
      // setelah login berhasil diarahkan ke home page
      return <Navigate to="/" />;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="text-white mt-5 col-12 text-center">
            <h1>Log in now!</h1>
            <p className="lead">
              Log in now and start shopping ^-^
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-4 offset-4">
            {/* jika string ada isinya akan memberikan value true */}
            {/* krn di dlm return render tdk bisa pakai if biasa jd pakai ternary */}
            {/* jika true maka jalankan yg di dlm kurung biasa, jika salah maka null */}
            {this.props.userGlobal.errMsg ? (
              <div className="alert alert-danger">
                {this.props.userGlobal.errMsg}
              </div>
            ) : null}

            <div className="card">
              <div className="card-body">
                <h5 className="text-warning font-weight-bold mb-3">Log in</h5>
                <input
                  onChange={this.inputHandler}
                  name="username"
                  placeholder="Username"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  onChange={this.inputHandler}
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="form-control my-2"
                />
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <button
                  // (this.state) bcs it is object that state username and password that suit the action creator in redux
                    onClick={() => this.props.loginUser(this.state)}
                    className="btn btn-warning text-light mt-2"
                  >
                    Login
                  </button>
                  <Link
                    to="/register"
                    className="text-warning text-decoration-none"
                  >
                    or Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // state.user: object di dlm init_state
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
