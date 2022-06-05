import Axios from "axios";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";

// username, password: sama spt yg ada di state login
export const loginUser = ({ username, password }) => {
  // bcs we will call to API, we have to use redux thunk/middleware
  return (dispatch) => {
    // request to API
    Axios.get(`${API_URL}/users`, {
      // we can ask specific items from db.json inside params, example: username: "lovelybug"
      // condition inside params is &&, so all the fields and value should be fulfill, otherwise result.data will return empty array
      params: {
        // username: username,
        username,
      },
    })
      .then((result) => {
        // hanya jika user input username yg benar sehingga result.data memiliki length [0], jika tdk maka result.data berisi empty array dan muncul error
        if (result.data.length) {
          // jika password yg diinput user sama dg yg ada di result.data
          // result.data: data array of objects yg dicreate API json server db.json
          if (password === result.data[0].password) {
            // delete: agar password tdk masuk ke localStorage
            delete result.data[0].password;

            // setItem menerima dua parameter sama halnya dg object, yaitu key dan value
            localStorage.setItem(
              "userDataEmmerce",
              // JSON.stringify: membuat sebuah object/json menjadi sebuah string supaya dpt disimpan di localStorage
              JSON.stringify(result.data[0])
            );

            // dispatch hanya jika passwordnya sesuai
            dispatch({
              // USER_LOGIN: sesuai yg ada di reducer
              type: "USER_LOGIN",
              // otomatis payload akan masuk ke reducer di dlm ...action.payload
              payload: result.data[0],
            });
          } else {
            // handle error wrong password
            dispatch({
              // USER_ERROR: sesuai yg ada di reducer
              type: "USER_ERROR",
              // otomatis payload akan masuk ke reducer di dlm errMsg
              payload: "Wrong password",
            });
          }
        } else {
          // handle error username not found
          dispatch({
            // USER_ERROR: sesuai yg ada di reducer
            type: "USER_ERROR",
            // otomatis payload akan masuk ke reducer di dlm errMsg
            payload: "User not found",
          });
        }
      })
      .catch((err) => {
        // alert("There is some mistake in server");
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };
};

// function logoutUser no need asynchronous process so it's not must return a function
export const logoutUser = () => {
  // if logout must remove localStorage
  // if we dont do it then data for the user will keep stored inside local storeage even after logout
  // we used localstoreage so user stays logged in even if we refresh page or close and reopen tab.
  localStorage.removeItem("userDataEmmerce");

  return {
    // USER_LOGOUT: based on in reducer
    type: "USER_LOGOUT",
  };
};

// userData: data user yg kita dptkan dari userLocalStorage
export const userKeepLogin = (userData) => {
  // menerima proses asynchronous
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        // jika sdh login pasti akan dpt id nya utk dptkan data user di dlm fake api
        id: userData.id,
      },
    })
      // di dlm result bisa dpt user yg memiliki id tsb
      .then((result) => {
        // copy delete to localStorage from localUser supaya data yg kita set di dlm user data emmerce adalah data yg paling baru
        // .password supaya ketika navbar menggunakan userGlobal.password, password user tdk tampil
        delete result.data[0].password;

        localStorage.setItem("userDataEmmerce", JSON.stringify(result.data[0]));

        // dispatch: utk menaruh data user di dlm redux
        dispatch({
          // USER_LOGIN: sesuai yg ada di reducer
          type: "USER_LOGIN",
          // otomatis payload akan masuk ke reducer di dlm ...action.payload
          payload: result.data[0],
        });
      })
      .catch(() => {
        // alert("There is some mistake in server");
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };
};

export const checkStorage = () => {
  return {
    // tdk ada proses asynchronous jd langsung mereturn sebuah object
    type: "CHECK_STORAGE",
  };
};
