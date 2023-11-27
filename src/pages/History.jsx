import React from "react";
// utk mengambil data dri API
import Axios from "axios";
import { API_URL } from "../constants/API";
// utk mendapatkan info user yg sdg login di params fetchTransactions
import { connect } from "react-redux";
import swal from "sweetalert";

class History extends React.Component {
  state = {
    // utk menyimpan data transactionList dari fetchTransactions
    transactionList: [],
    // utk menyimpan data transactionDetails dari fetchTransactions
    transactionDetails: [],
  };

  fetchTransactions = () => {
    Axios.get(`${API_URL}/transaction`, {
      params: {
        userId: this.props.userGlobal.id,
      },
    })
      .then((result) => {
        // console.log(result.data);
        this.setState({ transactionList: result.data });
      })
      .catch((err) => {
        if (err.response.status == 404) return;
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // function utk melihat detail history transaksi // here it's said to see the history of transactions
  // transactionDetails: sebuah array
  seeDetailsBtnHandler = (transactionDetails) => {
  // seeDetailsBtnHandler = (trDetails) => {
    // this is a short way to write it when both key and value of an object is same
    this.setState({ transactionDetails }); // why we need to. I dont think it will do anything. u can try comment it, oh i understand, it will update the
    // this.setState({ transactionDetails: trDetails });

    /*
    let mykey = 100;
    let obj = {
      mykey: mykey,  //this line
      mykey   /// and this line both are same.
    }
    */
  };

  renderTransactions = () => {
    return this.state.transactionList.map((val) => {
      return (
        <tr>
          <td>{val.transactionDate}</td>
          <td>{val.transactionItems.length} {val.transactionItems.length > 1 ? "Item(s)" : "Item"}</td>
          <td>Rp{val.totalPrice.toLocaleString("id-ID")}</td>
          <td>
            <button
              // menggunakan parameter kosong di awal krn seeDetailsBtnHandler memiliki parameter di atas
              onClick={() => this.seeDetailsBtnHandler(val.transactionItems)}
              className="btn btn-warning fw-bold text-light"
            >
              See Details
            </button>
          </td>
        </tr>
      );
    });
  };

  renderTransactionDetailItems = () => {
    return this.state.transactionDetails.map((val) => {
      return (
        <div className="d-flex my-2 flex-row justify-content-between align-items-center">
          <span className="font-weight-bold">
            {val.productName} ({val.quantity})
          </span>
          <span>Rp{(val.price * val.quantity).toLocaleString("id-ID")}</span>
        </div>
      );
    });
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  render() {
    return (
      <div className="p-5 m-5 bg-light bg-gradient shadow-lg rounded bg-opacity-75">
        <h1 className="text-dark p-5 fw-bold text-start">
          Transaction History
        </h1>
        <div className="row mt-5">
          <div className="col-8 text-center">
            <table className="table table-hover border-warning">
              <thead className="thead-light">
                <tr className="bg-warning bg-opacity-50">
                  <th className="text-light fs-5">Transaction Date</th>
                  <th className="text-light fs-5">Total Item</th>
                  <th className="text-light fs-5">Total Price</th>
                  <th className="text-light fs-5">Action</th>
                </tr>
              </thead>
              <tbody className="bg-light bg-opacity-75 fs-6 fw-bold">
                {this.renderTransactions()}
              </tbody>
            </table>
          </div>
          <div className="col-4">
            {/* ketika kondisi true maka memiliki length */}
            {this.state.transactionDetails.length ? (
              <div className="card">
                <div className="card-header bg-warning bg-opacity-50 text-light fs-5">
                  <strong>Transaction Details</strong>
                </div>
                <div className="card-body bg-light bg-opacity-75 fw-bold">
                  {this.renderTransactionDetailItems()}
                </div>
              </div>
            ) : /* ketika kondisi false maka tdk memiliki length */
            null}
          </div>
        </div>
      </div>
    );
  }
}

// utk mendapatkan info user yg sdg login di params fetchTransactions
const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

export default connect(mapStateToProps)(History);
