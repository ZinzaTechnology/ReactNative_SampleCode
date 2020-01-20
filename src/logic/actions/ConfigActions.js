import {
  FETCH_CONFIG,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_ERROR
} from "./actionsTypes";
import * as api from "../api";

const requestConfigData = _ => {
  return {
    type: FETCH_CONFIG
  };
};

const receiveConfigData = data => {
  return {
    type: FETCH_CONFIG_SUCCESS,
    data
  };
};

const fetchConfigError = error => {
  return {
    type: FETCH_CONFIG_ERROR,
    error
  };
};

export const fetchConfigData = () => {
  return async dispatch => {
    dispatch(requestConfigData());
    api
      .getConfig()
      .then(response => {
        const { status } = response;

        if (status == 200) {
          const content = response.body;
          dispatch(receiveConfigData(content));
        } else {
          dispatch(fetchConfigError(response));
        }
      })
      .catch(error => dispatch(fetchConfigError(error)));
  };
};
