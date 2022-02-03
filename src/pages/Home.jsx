import React from "react";
import ProductCard from "../components/productCard";
import { connect } from "react-redux";
// import Axios setiap kali terdapat panggilan ke API
import Axios from "axios";
import { getCartData } from "../redux/actions/cart";
// import API_URL krn kita mau data dari halaman url API
import { API_URL } from "../constants/API";
import swal from "sweetalert";

class Home extends React.Component {
  state = {
    // productList: untuk menampung result.data
    productList: [],
    // filteredProductList: untuk menyimpan data yg sdh difilter pd searchBtnHandler
    filteredProductList: [],
    // page: 1 ==> default value page, agar setiap masuk app ke page 1 dulu
    page: 1,
    // maxPage: 0 ==> krn tergantung pd length of produk
    maxPage: 0,
    // itemPerPage: declare amount of product item per page
    itemPerPage: 8,
    // searchProductName: utk menyimpan input product name
    searchProductName: "",
    // searchCategory: utk menyimpan input product category
    searchCategory: "",
    // sortBy: utk menyimpan input sort by
    sortBy: "",
  };

    
  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        this.setState({
          // setState productList menjadi data yg dikirim lewat result
          // productList (result.data) isinya array of object dari products di db.json
          productList: result.data,
          maxPage: Math.ceil(result.data.length / this.state.itemPerPage),
          // default value sblm filteredProductList: result.data
          filteredProductList: result.data,
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true
        });
      });
  };

  renderProducts = () => {
    // beginningIndex: index pertama dari produk yg ditampilkan dari setiap currentData
    const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;
    // rawData berisi cloningan array dari filteredProductList agar kita dpt memanipulasi array tsb scr langsung, karena kita tdk boleh manipulasi state jika bukan melewati setState, dan ketika kita sort sebuah array maka array dari filteredProductList akan otomatis berubah, tapi kita akan mengubahnya menggunakan sort bukan setState jd itu tdk boleh di dlm react, maka kita sediakan rawData yg isinya cloningan array dari filteredProductList
    let rawData = [...this.state.filteredProductList];

    // function utk mengurangi data productName di dlm switch yg merupakan string
    const compareString = (a, b) => {
      if (a.productName < b.productName) {
        // produk dg huruf lebih kecil akan muncul pertama
        return -1;
      }

      // produk dg huruf lebih besar akan muncul setelah produk dg huruf lebih kecil
      if (a.productName > b.productName) {
        return 1;
      }

      // tidak melakukan sort by produkName
      return 0;
    };

    // sort data berdasarkan kondisi sortby yg hasilnya disimpan ke dlm state sortby
    switch (this.state.sortBy) {
      // manipulasi data by sort
      // cara kerja sort: menerima callback function dan callback function tsb akan mereturn sebuah value yaitu number yg either positif or negatif or 0
      // parameter a & b mewakili key object product di dlm db.json
      case "lowPrice":
        rawData.sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        rawData.sort((a, b) => b.price - a.price);
        break;
      case "az":
        rawData.sort(compareString);
        break;
      case "za":
        rawData.sort((a, b) => compareString(b, a));
        break;
      default:
        rawData = [...this.state.filteredProductList];
        break;
    }

    // currentData: menentukan index produk ke berapa saja yg ditampilkan pada setiap pagenya
    const currentData = rawData.slice(
      beginningIndex,
      beginningIndex + this.state.itemPerPage
    );

    return currentData.map((val) => {
      return <ProductCard productData={val} />;
    });
  };

  paginationHandler = (page) => {
    if (page <= this.state.maxPage && page >= 1) {
      this.setState({ page: page });
    }
  };

  // nextPageHandler = () => {
  // // jika page lebih dri maxPage maka tdk menjalankan apapun
  //   if (this.state.page < this.state.maxPage) {
  //     this.setState({ page: this.state.page + 1 });
  //   }
  // };

  // prevPageHandler = () => {
  // // jika page kurang dri 1 maka tdk menjalankan apapun
  //   if (this.state.page > 1) {
  //     this.setState({ page: this.state.page - 1 });
  //   }
  // };

  inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  searchBtnHandler = () => {
    // filteredProductList: productList yg sdh difilter
    const filteredProductList = this.state.productList.filter((val) => {
      // cara filter bekerja yaitu akan meminta boolean sbg returnnya
      // jika true maka akan dimasukkan array baru
      // jika false maka akan diskip
      return (
        val.productName
          .toLowerCase()
          // includes: method utk cek pd sebuah string terhadap karakter tertentu yg kita tentukan
          .includes(this.state.searchProductName.toLowerCase()) &&
        val.category
          .toLowerCase()
          // includes: method utk cek pd sebuah string terhadap karakter tertentu yg kita tentukan
          .includes(this.state.searchCategory.toLowerCase())
      );
    });

    this.setState({
      // filteredProductList: filteredProductList
      // menentukan filteredProductList sbg sumber data product list
      filteredProductList,
      // menentukan maxPage dari filteredProductList
      maxPage: Math.ceil(filteredProductList.length / this.state.itemPerPage),
      // menentukan default value page dari filteredProductList
      page: 1,
    });
  };

  // utk membuat fetchProducts trigger ketika masuk home page tanpa mencet apapun
  componentDidMount() {
    this.fetchProducts();

    // update cart when user comes to this page so the user only able to see their own cart
    this.props.getCartData(this.props.userGlobal.id);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row pt-5">
          <div className="col-auto">
            <div className="card filsort-card">
              <div className="card-header bg-warning text-light fs-5">
                <strong>Filter Products</strong>
              </div>
              <div className="card-body">
                <label htmlFor="searchProductName" className="fw-bold">Product Name</label>
                <input
                  onChange={this.inputHandler}
                  name="searchProductName"
                  type="text"
                  className="form-control mb-3 fw-bold"
                />
                <label htmlFor="searchCategory" className="fw-bold">Product Category</label>
                <select
                  onChange={this.inputHandler}
                  name="searchCategory"
                  className="form-control fw-bold"
                >
                  <option value="" className="fw-bold">All Items</option>
                  <option value="softcover" className="fw-bold">Softcover Notebook</option>
                  <option value="spiral" className="fw-bold">Spiral Notebook</option>
                  <option value="pop socket" className="fw-bold">Pop Socket</option>
                </select>
                <button
                  onClick={this.searchBtnHandler}
                  className="btn btn-warning mt-3 text-light fw-bold"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="card filsort-card mt-4">
              <div className="card-header bg-warning text-light fs-5">
                <strong>Sort Products</strong>
              </div>
              <div className="card-body">
                <label htmlFor="sortBy" className="fw-bold">Sort by</label>
                <select
                  onChange={this.inputHandler}
                  name="sortBy"
                  className="form-control fw-bold"
                >
                  <option value="" className="fw-bold">Default</option>
                  <option value="lowPrice" className="fw-bold">Lowest Price</option>
                  <option value="highPrice" className="fw-bold">Highest Price</option>
                  <option value="az" className="fw-bold">A-Z</option>
                  <option value="za" className="fw-bold">Z-A</option>
                </select>
              </div>
            </div>
            <div className="card filsort-card mt-4 d-flex justify-content-center flex-row">
              {/* first page */}
              <a
                className="btn btn-warning text-light fw-bold"
                style={{
                  marginRight: "auto",
                }}
                onClick={() => this.paginationHandler(1)}
              >
                {"<<"}
              </a>

              {/* previous page 2 */}
              {/* page: current page*/}
              {this.state.page > 2 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page - 2)}
                >
                  {this.state.page - 2}
                </a>
              ) : null}

              {/* previous page */}
              {/* page: current page */}
              {this.state.page > 1 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page - 1)}
                >
                  {this.state.page - 1}
                </a>
              ) : null}

              {/* current page */}
              {/* page: current page */}
              <a
                className="btn btn-warning text-light active fw-bold"
                style={{ border: "3px solid white" }}
              >
                {this.state.page}
              </a>

              {/* next page */}
              {/* page: current page */}
              {this.state.page < this.state.maxPage ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page + 1)}
                >
                  {this.state.page + 1}
                </a>
              ) : null}

              {/* next page 2 */}
              {/* page: current page */}
              {this.state.page < this.state.maxPage - 1 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page + 2)}
                >
                  {this.state.page + 2}
                </a>
              ) : null}

              {/* last page */}
              <a
                className="btn btn-warning text-light fw-bold"
                style={{
                  marginLeft: "auto",
                }}
                onClick={() => this.paginationHandler(this.state.maxPage)}
              >
                {">>"}
              </a>
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-wrap flex-row">
              {/* Render products here */}
              {this.renderProducts()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// mapStateToProps dibuat ketika connect from react-redux
const mapStateToProps = (state) => {
  return {
    // supaya bisa dapat data user dri redux yaitu user id yg digunakan dg getCartData pd function deleteCartHandler
    userGlobal: state.user,
  };
};

// mapDispatchToProps dibuat ketika import getCartData dibutuhkan
const mapDispatchToProps = {
  getCartData,
};

// export default Home;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
