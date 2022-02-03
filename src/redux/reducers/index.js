import { combineReducers } from 'redux';
import userReducer from './user';
import cartReducer from './cart';

// cartReducer ditambahkan agar ketika di mapStateToProps pada ProductDetail.jsx statenya sdh ada cart bukan hanya user saja
export default combineReducers({
    user: userReducer,
    cart: cartReducer
});

