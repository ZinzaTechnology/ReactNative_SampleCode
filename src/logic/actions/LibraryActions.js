import { GET_LIBRARY } from "./actionsTypes";
import openConnection from "../realm";

export const getLibraryData = () => {
  return dispatch => {
    openConnection().then(realm => {
      let books = realm.objects("Book").filtered(`isDownloaded = true`);
      console.log({books});
      
      dispatch({
        type: GET_LIBRARY,
        books
      });
    });
  };
};
