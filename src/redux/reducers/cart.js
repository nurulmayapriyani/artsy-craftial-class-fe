const init_state = {
  // cartList is result.data: contain products inside cart by each user
  cartList: [],
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "FILL_CART":
      // cartList: array of objects dri cart yg dimiliki oleh user
      return { ...state, cartList: action.payload }; // is it bcs of this return? so payload can access to cartlist? this payload comes from action. yes but without action.payload it can't be sent to here right? yes
    default:
      return state;
  }
};

export default reducer;
