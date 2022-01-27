import React from "react";
import ProductCard from "../components/productCard";
import Axios from "axios";
import { API_URL } from "../constants/API";
import "../assets/styles/gradientStyle.css";

class Home extends React.Component {
  state = {
    // untuk menyimpan data
    productList: [],
    // untuk menyimpan data
    filteredProductList: [],
    // setiap masuk ke page 1 dulu
    page: 1,
    maxPage: 0,
    itemPerPage: 8,
    searchProductName: "",
    searchCategory: "",
    sortBy: "",
  };

  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        this.setState({
          productList: result.data,
          maxPage: Math.ceil(result.data.length / this.state.itemPerPage),
          // muncul pertama kali sblm filter semua produk
          filteredProductList: result.data,
        });
      })
      .catch((err) => {
        console.log(err);
        alert("There is some mistake in server");
      });
  };

  renderProducts = () => {
    const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;
    // rawData berisi cloning dari filteredProductList agar kita dpt memanipulasi array berikut scr langsung, karena kita tdk boleh manipulasi state jika bukan melewati setState, dan ketika kita sort sebuah array maka array akan otomatis berubah, tapi kita akan mengubahnya menggunakan sort bukan setState jd itu tdk boleh di dlm react, maka kita sediakan rawData yg isinya cloning filteredProductList
    let rawData = [...this.state.filteredProductList];

    const compareString = (a, b) => {
      if (a.productName < b.productName) {
        return -1;
      }

      if (a.productName > b.productName) {
        return 1;
      }

      return 0;
    };

    switch (this.state.sortBy) {
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

    const currentData = rawData.slice(
      beginningIndex,
      beginningIndex + this.state.itemPerPage
    );

    // productList isinya array of object dari products di db.json
    return currentData.map((val) => {
      return <ProductCard productData={val} />;
    });
  };

  paginationHandler = (page) => {
    if ((page <= this.state.maxPage) && (page >= 1) ) {
      this.setState({ page: page });
    }    
  }

  // nextPageHandler = () => {
  //   if (this.state.page < this.state.maxPage) {
  //     this.setState({ page: this.state.page + 1 });
  //   }
  // };

  // nextNextPageHandler = () => {
  //   if (this.state.page < this.state.maxPage) {
  //     this.setState({ page: this.state.page + 2 });
  //   }
  // };

  // prevPageHandler = () => {
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
    const filteredProductList = this.state.productList.filter((val) => {
      return (
        val.productName
          .toLowerCase()
          .includes(this.state.searchProductName.toLowerCase()) &&
        val.category
          .toLowerCase()
          .includes(this.state.searchCategory.toLowerCase())
      );
    });

    this.setState({
      filteredProductList,
      maxPage: Math.ceil(filteredProductList.length / this.state.itemPerPage),
      page: 1,
    });
  };

  componentDidMount() {
    this.fetchProducts();
  }

  render() {
    return (
      <div className="container-fluid gradient-container">
        <div className="container-fluid pt-5">
          <div className="row">
            <div className="col-3">
              <div className="card filsort-card">
                <div className="card-header bg-warning text-light">
                  <strong>Filter Products</strong>
                </div>
                <div className="card-body">
                  <label htmlFor="searchProductName">Product Name</label>
                  <input
                    onChange={this.inputHandler}
                    name="searchProductName"
                    type="text"
                    className="form-control mb-3"
                  />
                  <label htmlFor="searchCategory">Product Category</label>
                  <select
                    onChange={this.inputHandler}
                    name="searchCategory"
                    className="form-control"
                  >
                    <option value="">All Items</option>
                    <option value="softcover">Softcover Notebook</option>
                    <option value="spiral">Spiral Notebook</option>
                    {/* <option value="aksesoris">Aksesoris</option> */}
                  </select>
                  <button
                    onClick={this.searchBtnHandler}
                    className="btn btn-warning mt-3 text-light"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="card filsort-card mt-4">
                <div className="card-header bg-warning text-light">
                  <strong>Sort Products</strong>
                </div>
                <div className="card-body">
                  <label htmlFor="sortBy">Sort by</label>
                  <select
                    onChange={this.inputHandler}
                    name="sortBy"
                    className="form-control"
                  >
                    <option value="">Default</option>
                    <option value="lowPrice">Lowest Price</option>
                    <option value="highPrice">Highest Price</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>
                </div>
              </div>
              <div className="card filsort-card mt-4 d-flex justify-content-center flex-row">

                {/* first page */}
                <a className="btn btn-warning" style={{
                  marginRight: "auto"
                }} onClick={() => this.paginationHandler(1)}>{'<<'}</a>

                {/* previous page */}
                { this.state.page > 1? (
                  <a className="btn btn-warning" onClick={() => this.paginationHandler(this.state.page - 1)}>{this.state.page - 1}</a>
                ): null }

                
                {/* current page */}
                <a className="btn btn-warning" style={{ border: "1px solid gray" }}>{this.state.page}</a>
                
                {/* next page */}
                { this.state.page < this.state.maxPage? (
                  <a className="btn btn-warning" onClick={() => this.paginationHandler(this.state.page + 1)}>{this.state.page + 1}</a>
                ): null }


                {/* last page */}
                <a className="btn btn-warning" style={{
                  marginLeft: "auto"
                }} onClick={() => this.paginationHandler(this.state.maxPage)}>{'>>'}</a>
              </div>
              {/* <nav aria-label="Page navigation example" className="mt-4">
                <ul class="pagination">
                  <li
                    class="page-item"
                    disabled={this.state.page === 1}
                    onClick={this.prevPageHandler}
                  >
                    <a class="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li class="page-item" onClick={this.state.page}>
                    <a class="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li class="page-item" onClick={this.nextPageHandler}>
                    <a class="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li class="page-item" onClick={this.nextNextPageHandler}>
                    <a class="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li
                    class="page-item"
                    disabled={this.state.page === this.state.maxPage}
                    onClick={this.nextPageHandler}
                  >
                    <a class="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav> */}
            </div>
            <div className="col-9">
              <div className="d-flex flex-wrap flex-row">
                {/* Render products here */}
                {this.renderProducts()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
