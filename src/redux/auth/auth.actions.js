import {apiHelper, baseUrl} from '../../constants/api';
import {storeToken} from '../../helper/storage';
export const loginUser =
  ({email, password}) =>
  async dispatch => {
    try {
      dispatch({
        type: 'auth/isLoading',
        payload: true,
      });
      const response = await fetch(`${baseUrl}/api/manager/login`);
      const data = await response.json();
      if (!data.token) {
        console.log('error', data);
        dispatch({
          type: 'auth/isLoading',
          payload: false,
        });
      }
      if (data.message === 'invalid email or password') {
        dispatch({
          type: 'auth/setPin',
          payload: false,
        });
      }

      if (data.message == 'login verified. Provide token in next request. ') {
        console.log(data.message);
        dispatch({
          type: 'auth/setPin',
          payload: true,
        });
      }

      if (data.token) {
        await storeToken(data.token);
        // console.log("data", data.token)
        // const user = jwtDecode(data.token)
        // dispatch({ type: "authenticate", payload: user })
      }

      dispatch({
        type: 'auth/isLoading',
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: 'auth/isLoading',
        payload: false,
      });
      console.log(error);
    }
  };
