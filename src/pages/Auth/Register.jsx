import React from "react";
import { Link, Navigate } from "react-router-dom";
// bcs registerUser is an action creator so we have to connect redux which is connect
import { registerUser } from "../../redux/actions/user";
import { connect } from "react-redux";

class Register extends React.Component {
  // to save value of form or input with the suitable name
  state = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    error: ""
  };

  inputHandler = (event) => {
    // value: storage of input users from register page
    const value = event.target.value;
    // name: to recognize the incoming values from which input
    const name = event.target.name;

    // name using square brackets to make the objects sent to setState is dynamic
    this.setState({ [name]: value });
  };

  registerHandler = () => {
    this.state.error = "";
    // email can contain any character then '@' then any character then '.' and then any character again.
    if (!this.state.email.match(/.+@.+[.].+/))
    {
      this.setState({
        error: "Invalid email"
      });
      return;
    }
    // username must contain alphanumeric characters with length 8 to 15
    if (!this.state.username.match(/[a-zA-Z0-9]{8,15}/)) {
      this.setState({
        error: "Invalid username"
      });
      return;
    }

    // give error if password is less than 8 or does not contain any special characters
    if (this.state.password.length < 8 || !this.state.password.match(/[$#@!%^&*]/)) {
      this.setState({
        error: "Password must be 8 characters or more and contain special characters"
      });
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
            <h1>Welcome!</h1>
            <p className="lead">Register now and start shopping ^-^</p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-4 offset-4">
            <div className="card">
              <div className="card-body">
                <h5 className="text-warning font-weight-bold mb-3">Register</h5>
                {this.state.error != "" ? (
                  <div className="alert alert-danger">{this.state.error}</div>
                ): null}
                <input
                  name="fullName"
                  onChange={this.inputHandler}
                  placeholder="Full Name"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="username"
                  onChange={this.inputHandler}
                  placeholder="Username"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="email"
                  onChange={this.inputHandler}
                  placeholder="Email"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="password"
                  onChange={this.inputHandler}
                  placeholder="Password"
                  type="password"
                  className="form-control my-2"
                />
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <button
                  // vidlearn: onClick={() => this.props.registerUser(this.state)}
                    onClick={this.registerHandler}
                    className="btn btn-warning text-light mt-2"
                  >
                    Register
                  </button>
                  <Link
                    to="/login"
                    className="text-warning text-decoration-none"
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
