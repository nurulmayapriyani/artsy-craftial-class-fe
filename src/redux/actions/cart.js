import Axios from 'axios'
import { API_URL } from '../../constants/API'

export const getCartData = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        // userId: userId
        userId,
      }
    })
    .then((result) => {
      // Dispatch to cart reducer dengan payload -> result.data
      dispatch({
        // sesuai dari nama dari case di cart reducer
        type: "FILL_CART",
        // result.data menyimpan cartnya user (array)
        payload: result.data,
      })
    })
    .catch(() => {
      alert("Terjadi kesalahan di server")
    })
  }
}