const init_state = {
    cartList: [],
  }
  
  const reducer = (state = init_state, action) => {
    switch (action.type) {
      case "FILL_CART":
        // cartList adalah result.data yaitu array of objects dari cart yg dimiliki oleh user
        return { ...state, cartList: action.payload }
      default:
        return state;
    }
  }
  
  export default reducer;