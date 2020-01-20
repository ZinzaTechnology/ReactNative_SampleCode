import { UPDATE_DRAWER_STATE } from "./actionsTypes";

export const updateDrawerState = state => {
  return {
    type: UPDATE_DRAWER_STATE,
    state
  };
};
