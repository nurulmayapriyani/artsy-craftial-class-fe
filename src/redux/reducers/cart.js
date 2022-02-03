const init_state = {
  // cartList adalah result.data yaitu barang apa saja di dlm cart yg dimiliki oleh user
  cartList: [],
}

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "FILL_CART":
        // cartList: array of objects dri cart yg dimiliki oleh user
        return { ...state, cartList: action.payload }
      default:
        return state;
    }
  }
  
  export default reducer;