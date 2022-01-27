import React from "react";
import "../assets/styles/productCard.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";

class ProductCard extends React.Component {
  addToCartHandler = () => {
    // Check apakah user sudah memiliki barang tsb di cart
    Axios.get(`${API_URL}/carts`, {
      // cari data spesifik
      params: {
        userId: this.props.userGlobal.id,
        productId: this.props.productData.id,
      },
    }).then((result) => {
      console.log(result);
      if (result.data.length) {
        // Jika barangnya sudah ada di cart user
        // hanya bisa ambil id {result.data[0].id} data cart dri qty barang yg mau diedit karena API msh pakai json.server, tdk bisa dri userid & productid karena blm buat API sendiri. Id yg diambil di sini tergantung dari userId & productId apa yg diperoleh dari data cart (yg terdapat di dlm params di atas)
        Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
          quantity: result.data[0].quantity + 1,
        })
          .then(() => {
            alert("Berhasil menambahkan barang");
            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            alert("Terjadi kesalahan di server");
          });
      } else {
        // Jika barangnya belum ada di cart user
        Axios.post(`${API_URL}/carts`, {
          userId: this.props.userGlobal.id,
          productId: this.props.productData.id,
          price: this.props.productData.price,
          productName: this.props.productData.productName,
          productImage: this.props.productData.productImage,
          quantity: 1,
        })
          .then(() => {
            alert("Berhasil menambahkan barang");
            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            alert("Terjadi kesalahan di server");
          });
      }
    });
  };

  render() {
    return (
      <div className="card product-card">
        <img
          src={process.env.PUBLIC_URL + this.props.productData.productImage}
          alt=""
        />
        <div className="mt-2">
          <div>
            <Link
              to={`/product-detail/${this.props.productData.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h6>{this.props.productData.productName}</h6>
            </Link>
            <span className="text-muted">Rp{this.props.productData.price}</span>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button
              onClick={this.addToCartHandler}
              className="btn btn-warning text-light mt-2"
            >
              Add to cart
            </button>
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

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
