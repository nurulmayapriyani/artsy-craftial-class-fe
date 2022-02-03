// di dlm Cart.jsx tdk perlu get data cartnya krn cart datanya sdh ada di dlm redux yg sdh diget oleh App.jsx
import React from "react";
import { connect } from "react-redux";
// Axios & API_URL digunakan pd function deleteCartHandler
import Axios from "axios";
import { API_URL } from "../constants/API";
// getCartData digunakan pd function deleteCartHandler
import { getCartData } from "../redux/actions/cart";
import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    // sbg acuan utk mengetahui apakah button checkout sdh diklik atau blm
    isCheckoutMode: false,
    // utk menyimpan input dari form order summary
    recipientName: "",
    // utk menyimpan input dari form order summary
    address: "",
    // utk menyimpan input dari form order summary
    payment: 0,
  };

  // update cart when user comes to this page so the user only able to see their own cart
  componentDidMount() {
    this.props.getCartData(this.props.userGlobal.id);
  }

  // function utk delete barang di cart
  deleteCartHandler = (cartId) => {
    // cartId berasal dari parameter
    Axios.delete(`${API_URL}/carts/${cartId}`)
      .then(() => {
        // getCartData dipanggil agar ketika button delete diklik, barang langsung terhapus, dan data berkurang dri shopping cart tanpa direfresh
        this.props.getCartData(this.props.userGlobal.id);
      })
      .catch(() => {
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // function utk render cart
  renderCart = () => {
    // cartGlobal krn array yg dimap dg state Global bukan Local lagi
    return this.props.cartGlobal.cartList.map((val) => {
      return (
        <tr>
          {/* (bootstrap) align-middle = (css) verticalAlign: "middle*/}
          <td className="align-middle">{val.productName}</td>
          <td className="align-middle">Rp{val.price.toLocaleString("id-ID")}</td>
          <td className="align-middle">
            <img src={val.productImage} alt="" style={{ height: "125px" }} />
          </td>
          <td className="align-middle">{val.quantity}</td>
          <td className="align-middle">Rp{(val.quantity * val.price).toLocaleString("id-ID")}</td>
          <td className="align-middle">
            {/* deleteCartHandler ada parameternya jd pada onClick kita beri anonymous function*/}
            <button
              // menggunakan parameter kosong di awal krn dlm function deleteCartHandler terdapat parameter
              // val.id: utk mendapatkan id dri cart itemnya
              onClick={() => this.deleteCartHandler(val.id)}
              className="btn btn-danger fw-bold"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  // function utk menghitung subtotal price pada order summary
  renderSubtotalPrice = () => {
    let subTotal = 0;
    // loop sebanyak jumlah item pd cart
    for (let i = 0; i < this.props.cartGlobal.cartList.length; i++) {
      subTotal +=
        // setiap loop subtotal bertambah dg:
        this.props.cartGlobal.cartList[i].price *
        this.props.cartGlobal.cartList[i].quantity;
    }
    return subTotal;
  };

  // function utk menghitung tax fee pada order summary
  renderTaxFee = () => {
    return this.renderSubtotalPrice() * 0.1;
  };

  // function utk menghitung total price pada order summary
  renderTotalPrice = () => {
    return this.renderSubtotalPrice() + this.renderTaxFee();
  };

  // function yg menentukan isCheckoutMode sedang true atau false
  checkoutModeToggle = () => {
    this.setState({ isCheckoutMode: !this.state.isCheckoutMode });
  };

  inputHandler = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  // function utk button payment
  payBtnHandler = () => {
    // 1. post ke /transactions
    // 2. delete semua cart item yg sudah dibayar

    if (this.state.payment < this.renderTotalPrice()) {
      swal({
        title: `Sorry, amount of money you input can't afford the total price.\nIt still need ${
          this.renderTotalPrice() - this.state.payment
        } more.`,
        icon: "warning",
        confirm: true,
      });
      return; // jika sebuah function sdh mereturn sesuatu maka function akan berhenti
    }

    if (this.state.payment > this.renderTotalPrice()) {
      swal({
        title: `Payment success. Your change: ${
          this.state.payment - this.renderTotalPrice()
        }. Thank you for your order!`,
        icon: "success",
        confirm: true,
      });
    } else if (this.state.payment == this.renderTotalPrice()) {
      swal({
        title: "Payment success. Thank you for your order!",
        icon: "success",
        confirm: true,
      });
    }

    const d = new Date();
    Axios.post(`${API_URL}/transaction`, {
      // userGlobal: utk mendapatkan user yg sdg login saat ini
      userId: this.props.userGlobal.id,
      address: this.state.address,
      recipientName: this.state.recipientName,
      totalPrice: parseInt(this.renderTotalPrice()),
      totalPayment: parseInt(this.state.payment),
      // + 1 karena month 0 - 11, jd jan = 0, des = 11
      transactionDate: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`, // DD-MM-YYYY
      transactionItems: this.props.cartGlobal.cartList, // array of objects isi cart
    })
      .then((result) => {
        swal({
          title: "Payment Success",
          icon: "success",
          confirm: true,
        });
        // result.data: data yg sdh kita post ke db.json
        // satu object di transaction item sama dengan object di carts pd db.json
        result.data.transactionItems.forEach((val) => {
          // val.id: id dri sebuah cart
          this.deleteCartHandler(val.id);
        });
        this.checkoutModeToggle();
      })
      .catch((err) => {
        console.log(err); // always print errors if the error happen so we could see

        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  render() {
    return (
      <div className="p-5 m-5 text-center bg-light bg-gradient shadow-lg rounded bg-opacity-75">
        <h1 className="text-warning p-5 fw-bold text-start">Shopping Cart</h1>
        <div className="row mt-3">
          <div className="col-9 text-center">
            <table className="table table-hover border-warning">
              <thead className="thead-light">
                <tr className="bg-warning bg-opacity-50">
                  <th className="text-light fs-5">Name</th>
                  <th className="text-light fs-5">Price</th>
                  <th className="text-light fs-5">Image</th>
                  <th className="text-light fs-5">Quantity</th>
                  <th className="text-light fs-5">Total Price</th>
                  <th className="text-light fs-5">Action</th>
                </tr>
              </thead>
              <tbody className="bg-light bg-opacity-75 fs-6 fw-bold">
                {this.renderCart()}
              </tbody>
              <tfoot className="bg-warning bg-opacity-25">
                <tr>
                  <td colSpan="6">
                    <button
                      onClick={this.checkoutModeToggle}
                      className="btn btn-warning text-light fw-bold"
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* ketika isCheckoutMode true, berarti ditampilkan */}
          {this.state.isCheckoutMode ? (
            <div className="col-3">
              {/* form checkout */}
              <div className="card">
                <div className="card-header bg-warning bg-opacity-50 text-light fs-5">
                  <strong>Order Summary</strong>
                </div>
                <div className="card-body bg-light bg-opacity-75">
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center fw-bold">
                    <span className="font-weight-bold">Subtotal Price</span>
                    <span>Rp{this.renderSubtotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center fw-bold">
                    <span className="font-weight-bold">Tax Fee (10%)</span>
                    <span>Rp{this.renderTaxFee().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center fw-bold">
                    <span className="font-weight-bold">Total Price</span>
                    <span>Rp{this.renderTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="card-body border-top bg-light bg-opacity-75">
                  <label htmlFor="recipientName" className="fw-bold">
                    Recipient Name
                  </label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control mb-3 fw-bold"
                    name="recipientName"
                  />
                  <label htmlFor="address" className="fw-bold">
                    Address
                  </label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control fw-bold"
                    name="address"
                  />
                </div>
                <div className="card-footer bg-warning bg-opacity-25">
                  <div className="d-flex flex-row justify-content-between align-items-center"></div>
                  <input
                    onChange={this.inputHandler}
                    name="payment"
                    className="form-control mx-1 mb-2 fw-bold"
                    type="number"
                  />
                  <button
                    onClick={this.payBtnHandler}
                    className="btn btn-warning mx-1 text-light fw-bold"
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          ) : /* ketika isCheckoutMode false, berarti tdk tampil */
          null}
        </div>
      </div>
    );
  }
}

// mapStateToProps dibuat ketika connect from react-redux
const mapStateToProps = (state) => {
  return {
    // supaya bisa dapat data cart
    cartGlobal: state.cart,
    // supaya bisa dapat data user dri redux yaitu user id yg digunakan dg getCartData pd function deleteCartHandler
    userGlobal: state.user,
  };
};

// mapDispatchToProps dibuat ketika import getCartData dibutuhkan
const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
