import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
// bcs registerUser is an action creator so we have to connect redux which is connect
// import { registerUser } from "../../redux/actions/user";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";
import axios from "axios";

class Register extends React.Component {
  // to save value of form or input with the suitable name
  state = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    error: "",
  };

  inputHandler = (event) => {
    // value: storage of input users from register page
    const value = event.target.value;
    // name: to recognize the incoming values from which input
    const name = event.target.name;

    // name using square brackets to make the objects sent to setState is dynamic
    this.setState({ [name]: value });
  };

  // async is needed to use await inside the function
  registerHandler = async () => {
    this.setState({
      error: "",
    });
    // sorry, we should always use setState to change the state

    // email can contain any character then '@' then any character then '.' and then any character again.
    if (!this.state.email.match(/.+@.+[.].+/)) {
      this.setState({
        error: "Invalid email",
      });
      return;
    }

    // username must contain alphanumeric characters with length 8 to 15
    if (!this.state.username.match(/[a-zA-Z0-9]{8,15}/)) {
      this.setState({
        error: "Invalid username",
      });
      return;
    }

    // give error if password is less than 8 or does not contain any special characters
    if (
      this.state.password.length < 8 ||
      !this.state.password.match(/[$#@!%^&*]/)
    ) {
      this.setState({
        error:
          "Password must be 8 characters or more and contain special characters",
      });
      return;
    }

    try {
      let res = await Axios.get(`${API_URL}/users`);
      for (let user of res.data) {
        if (user.username === this.state.username) {
          this.setState({
            error: "User already exists",
          });
          return;
        }
      }
      // catch code is executed if any line inside try has error.
    } catch (err) {
      console.log("Internet not working: ", err); // u can try later without internet, it will execute code inside catch.
      return;
    }

    this.props.registerUser(this.state);
  };

  render() {
    if (this.props.userGlobal.id) {
      return <Navigate to="/" />;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="text-white mt-5 col-12 text-center">
            <h1 className="fw-bold">Welcome!</h1>
            <p className="lead fs-3 fw-bold">
              Register now and start shopping ^-^
            </p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-4 offset-4">
            <div className="card">
              <div className="card-body">
                <h5 className="text-warning font-weight-bold mb-3 fs-4 fw-bold">
                  Register
                </h5>
                {this.state.error != "" ? (
                  <div className="alert alert-danger">{this.state.error}</div>
                ) : null}
                <input
                  name="fullName"
                  onChange={this.inputHandler}
                  placeholder="Full Name"
                  type="text"
                  className="form-control my-2 fw-bold fs-5"
                />
                <input
                  name="username"
                  onChange={this.inputHandler}
                  placeholder="Username"
                  type="text"
                  className="form-control my-2 fw-bold fs-5"
                />
                <input
                  name="email"
                  onChange={this.inputHandler}
                  placeholder="Email"
                  type="text"
                  className="form-control my-2 fw-bold fs-5"
                />
                <input
                  name="password"
                  onChange={this.inputHandler}
                  placeholder="Password"
                  type="password"
                  className="form-control my-2 fw-bold fs-5"
                />
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <button
                    // vidlearn: onClick={() => this.props.registerUser(this.state)}
                    onClick={this.registerHandler}
                    className="btn btn-warning text-light mt-2 fw-bold"
                  >
                    Register
                  </button>
                  <Link
                    to="/login"
                    className="text-warning text-decoration-none fw-bold fs-5"
                  >
                    or Login
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

// fullName, username, email, password: sama spt yg ada di state register
export const registerUser = ({ fullName, username, email, password }) => {
  // bcs Axios.post is asynchronous method, we have to use redux thunk/middleware
  return (dispatch) => {
    Axios.post(`${API_URL}/users`, {
      fullName,
      username,
      email,
      password,
      role: "user",
    })
      // ketika kita post ke API json server, isinya result.data: data yg dicreate API json server db.json maka dari itu id muncul
      .then((result) => {
        delete result.data.password;
        // dispatch ke reducer dg sebuah user login dan payloadnya semua yg di dlm axios.post
        dispatch({
          // USER_LOGIN: sesuai yg ada di reducer
          type: "USER_LOGIN",
          // otomatis payload akan masuk ke reducer di dlm ...action.payload
          payload: result.data,
        });
        // alert("Register Success");
        swal({
          title: "Register Success",
          icon: "success",
          confirm: true,
        });
      })
      .catch(() => {
        // alert("Register Failed");
        swal({
          title: "Register Failed",
          icon: "error",
          confirm: true,
        });
      });
  };
};

// mapStateToProps must be a function even if it's only return empty string
const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  // object field & value both registerUser
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
