import createDataContext from "./createDataContext";
import ApiTracker from "../api/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    // case "signup":
    // return { errorMessage: "", token: action.payload };
    // no hace falta ya que la accion es identica que para el signin
    case "signin":
      return { errorMessage: "", token: action.payload }; // no hace falta ...state ya que queremos sobreescribir, resetear
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "singout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

// const signout = (dispatch) => {
//   return () => {
//     //try to signout
//   };
// };

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("TrackList");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await ApiTracker.post("/signup", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      navigate("TrackList");
    } catch (error) {
      console.log(error);
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
      //dispatch cada vez que se updatea el estado
    }
  };
//make api request to signup
//if we do, change state and say we are authenticated
//if fails, reflect error

const signin =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await ApiTracker.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      navigate("TrackList");
    } catch (error) {
      console.log(error);
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign in",
      });
      //dispatch cada vez que se updatea el estado
    }
  };

//try to signin
//handle success updating state
//handle failure by showing error

export const { Context, Provider } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin },
  // { isSignedIn: false, errorMessage: "" }
  { token: null, errorMessage: "" }
);
