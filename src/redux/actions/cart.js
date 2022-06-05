// cart.js: action creator utk reducer cart

import Axios from "axios";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";

// function utk mengambil data cart user dan disimpan di dlm redux
// userId: supaya kita tau dia mau dapetin cartnya user mana
export const getCartData = (userId) => {
  console.log(userId);
  // terdapat proses acyncronus jd mereturn sebuah function
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      // params: utk data tertentu saja
      params: {
        // userId: userId
        // userId: utk menandakan kepemilikan user yg mana dri suatu object di carts db.json
        userId,
      },
    })
      .then((result) => {
        // Dispatch to cart reducer dengan payload yg isinya result.data, supaya payload masuk ke dlm cartList di reducer cart.js
        dispatch({
          // sesuai dari nama dari case di cart reducer
          type: "FILL_CART",
          // result.data menyimpan cartnya user (array)
          payload: result.data,   // this is the payload. 
        });
      })
      .catch(() => {
        // alert("There is some error in server")
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };
};
