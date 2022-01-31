import React from "react";
// import Axios utk melakukan panggilan ke json server
import Axios from "axios";
// import API_URL utk bisa akses url
import { API_URL } from "../constants/API";
import { useParams } from "react-router-dom"; // way 2
import { connect } from "react-redux";
import { getCartData } from "../redux/actions/cart";
import "../assets/styles/gradientStyle.css";

class ProductDetail extends React.Component {
  state = {
    // productData: menyimpan produk yg didapat sesuai dg id yg kita dpt dri route params kita
    productData: {
      price: 0,
    },

    //default value productNotFound
    productNotFound: false,
    quantity: 1,
  };

  fetchProductData = () => {
    // Axios.get utk mengambil data barang
    Axios.get(`${API_URL}/products`, {
      // pakai params krn utk mengambil id produk
      params: {
        // utk mengambil id produk menggunakan props
        // params kita dptkan dri react-router-dom berkat BrowserRouter
        // productId: nama route params di App.jsx
        id: this.props.params.productId,
      },
    })
      .then((result) => {
        // result.data.length jika id terdapat pd data produk
        if (result.data.length) {
          // result.data: sebuah array
          // result.data[0] artinya utk mendapatkan index pertama, hanya satu index karena id hanya satu digit
          this.setState({ productData: result.data[0] });
        } else {
          // jika id produk tdk ada pada data produk
          this.setState({ productNotFound: true });
        }
      })
      .catch(() => {
        alert("There is some mistake in server");
      });
  };

  qtyBtnHandler = (action) => {
    if (action === "increment") {
      this.setState({ quantity: this.state.quantity + 1 });
      // > 1 karena at least checkout min 1
    } else if (action === "decrement" && this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  addToCartHandler = () => {
    // Check apakah user sudah memiliki barang tsb di cart
    Axios.get(`${API_URL}/carts`, {
      // cari data spesifik
      params: {
        userId: this.props.userGlobal.id,
        productId: this.state.productData.id,
      },
    }).then((result) => {
      if (result.data.length) {
        // Jika barangnya sudah ada di cart user
        // hanya bisa ambil id {result.data[0].id} data cart dri qty barang yg mau diedit karena API msh pakai json.server, tdk bisa dri userid & productid karena blm buat API sendiri. Id yg diambil di sini tergantung dari userId & productId apa yg diperoleh dari data cart (yg terdapat di dlm params di atas)
        Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
          quantity: result.data[0].quantity + this.state.quantity,
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
          productId: this.state.productData.id,
          price: this.state.productData.price,
          productName: this.state.productData.productName,
          productImage: this.state.productData.productImage,
          quantity: this.state.quantity,
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

  componentDidMount() {
    this.fetchProductData();

    console.log(window.location.pathname);
  }

  render() {
    return (
      <div className="container-fluid gradient-container">
        <div className="container">
          {this.state.productNotFound ? (
            // jika this.state.productNotFound adalah true
            <div className="alert alert-warning mt-3">
              Product with ID {this.props.params.productId} has not been found
            </div>
          ) : (
            // jika this.state.productNotFound adalah false
            <div className="row mt-3">
              <div className="col-4">
                <img
                  style={{ width: "100%" }}
                  src={this.state.productData.productImage}
                  alt=""
                />
              </div>
              <div className="col-6 d-flex flex-column justify-content-center">
                <h4 className="text-white">
                  {this.state.productData.productName}
                </h4>
                <h5 className="text-white">
                  Rp {this.state.productData.price.toLocaleString("id-ID")}
                </h5>
                <p className="text-white">
                  {this.state.productData.description}
                </p>
                <div className="d-flex flex-row align-items-center">
                  <button
                    onClick={() => this.qtyBtnHandler("decrement")}
                    className="btn btn-warning text-white mx-4"
                  >
                    -
                  </button>
                  <span className="text-white">{this.state.quantity}</span>
                  <button
                    onClick={() => this.qtyBtnHandler("increment")}
                    className="btn btn-warning text-white mx-4"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={this.addToCartHandler}
                  className="btn btn-warning text-white mt-3"
                >
                  Add to cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();

  return <WrappedComponent {...props} params={params} />;
};

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

// export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProductDetail)); // way 2
