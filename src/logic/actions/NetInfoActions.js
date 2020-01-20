import { NETINFO_CHANGE } from "./actionsTypes";

function _netInfoChange(netInfoType) {
  return {
    type: NETINFO_CHANGE,
    netInfoType: netInfoType
  };
}

export function netInfoChange(netInfoType) {
  return dispatch => {
    dispatch(_netInfoChange(netInfoType));
  };
}
