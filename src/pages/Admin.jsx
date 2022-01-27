import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import "../assets/styles/admin.css";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

class Admin extends React.Component {
  state = {
    // untuk menyimpan data add
    productList: [],

    addProductName: "",
    addPrice: 0,
    addProductImage: "",
    addDescription: "",
    addCategory: "",

    // untuk edit
    editId: 0,

    editProductName: "",
    editPrice: 0,
    editProductImage: "",
    editDescription: "",
    editCategory: "",
  };

  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        this.setState({ productList: result.data });
      })
      .catch(() => {
        alert("There is some mistake in server");
      });
  };

  // karena mau digunakan di renderProducts maka sebaiknya ditempatkan di atas renderProducts
  editToggle = (editData) => {
    this.setState({
      editId: editData.id,
      editProductName: editData.productName,
      editPrice: editData.price,
      editProductImage: editData.productImage,
      editDescription: editData.description,
      editCategory: editData.category,
    });
  };

  // jika edit dicancel maka hasil edit spt semula
  cancelEdit = () => {
    this.setState({ editId: 0 });
  };

  saveBtnHandler = () => {
    Axios.patch(`${API_URL}/products/${this.state.editId}`, {
      productName: this.state.editProductName,
      price: parseInt(this.state.editPrice),
      productImage: this.state.editProductImage,
      description: this.state.editDescription,
      category: this.state.editCategory,
    })
      .then(() => {
        this.fetchProducts();
        this.cancelEdit();
      })
      .catch(() => {
        alert("There is some mistake in server");
      });
  };

  deleteBtnHandler = (deleteId) => {
    const confirmDelete = window.confirm("Are you sure to delete this?");
    if (confirmDelete) {
      Axios.delete(`${API_URL}/products/${deleteId}`)
        .then(() => {
          this.fetchProducts();
        })
        .catch(() => {
          alert("There is some mistake in server");
        });
    } else {
      alert("Delete canceled");
    }
  };

  renderProducts = () => {
    return this.state.productList.map((val) => {
      // jika barang sdg diedit maka yg ditampilkan berupa form yg bisa diinput
      if (val.id === this.state.editId) {
        return (
          <tr>
            <td>{val.id}</td>
            <td>
              <input
                value={this.state.editProductName}
                onChange={this.inputHandler}
                type="text"
                className="form-control"
                name="editProductName"
              />
            </td>
            <td>
              <input
                value={this.state.editPrice}
                onChange={this.inputHandler}
                type="number"
                className="form-control"
                name="editPrice"
              />
            </td>
            <td>
              <input
                value={this.state.editProductImage}
                onChange={this.inputHandler}
                type="text"
                className="form-control"
                name="editProductImage"
              />
            </td>
            <td>
              <input
                value={this.state.editDescription}
                onChange={this.inputHandler}
                type="text"
                className="form-control"
                name="editDescription"
              />
            </td>
            <td>
              <select
                value={this.state.editCategory}
                onChange={this.inputHandler}
                name="editCategory"
                className="form-control"
              >
                <option value="">All Items</option>
                <option value="softcover">Softcover Notebook</option>
                <option value="spiral">Spiral Notebook</option>
                {/* <option value="aksesoris">Aksesoris</option> */}
              </select>
            </td>
            <td>
              <button onClick={this.saveBtnHandler} className="btn btn-success">
                Save
              </button>
            </td>
            <td>
              <button onClick={this.cancelEdit} className="btn btn-danger">
                Cancel
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr>
          <td>{val.id}</td>
          <td>{val.productName}</td>
          <td>{val.price}</td>
          <td>
            <img
              className="admin-product-image"
              src={val.productImage}
              alt=""
            />
          </td>
          <td>{val.description}</td>
          <td>{val.category}</td>
          <td>
            {/* editToggle menerima parameter yaitu id dri produk jadi pada onClick hrs dibungkus dg anonymous function supaya kita bisa kasih parameter yaitu val*/}
            <button
              onClick={() => this.editToggle(val)}
              className="btn btn-secondary"
            >
              Edit
            </button>
          </td>
          <td>
            <button
              onClick={() => this.deleteBtnHandler(val.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  addNewProduct = () => {
    Axios.post(`${API_URL}/products`, {
      productName: this.state.addProductName,
      price: parseInt(this.state.addPrice),
      productImage: this.state.addProductImage,
      description: this.state.addDescription,
      category: this.state.addCategory,
    })
      .then(() => {
        // refresh dg data terbaru
        this.fetchProducts();
        // reset form menjadi kosong kembali setelah memberikan value di input form
        this.setState({
          addProductName: "",
          addPrice: 0,
          addProductImage: "",
          addDescription: "",
          addCategory: "",
        });
      })
      .catch(() => {
        alert("There is some mistake in server");
      });
  };

  inputHandler = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  componentDidMount() {
    this.fetchProducts();
  }

  render() {
    if (this.props.userGlobal.role !== "admin") {
      return <Navigate to="/" />;
    }

    return (
      <div className="p-5">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Manage Products</h1>
            <table className="table mt-4">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>{this.renderProducts()}</tbody>
              <tfoot className="bg-light">
                <tr>
                  <td></td>
                  <td>
                    <input
                      value={this.state.addProductName}
                      onChange={this.inputHandler}
                      name="addProductName"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addPrice}
                      onChange={this.inputHandler}
                      name="addPrice"
                      type="number"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addProductImage}
                      onChange={this.inputHandler}
                      name="addProductImage"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addDescription}
                      onChange={this.inputHandler}
                      name="addDescription"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      onChange={this.inputHandler}
                      name="addCategory"
                      className="form-control"
                    >
                      <option value="">All Items</option>
                      <option value="softcover">Softcover Notebook</option>
                      <option value="spiral">Spiral Notebook</option>
                      {/* <option value="aksesoris">Aksesoris</option> */}
                    </select>
                  </td>
                  <td colSpan="2">
                    <button
                      onClick={this.addNewProduct}
                      className="btn btn-info"
                    >
                      Add Product
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

export default connect(mapStateToProps)(Admin);
