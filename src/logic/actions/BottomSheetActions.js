import { UPDATE_BOTTOM_SHEET_STATE } from "./actionsTypes";

export const updateBottomSheetState = state => {
  return {
    type: UPDATE_BOTTOM_SHEET_STATE,
    state
  };
};
