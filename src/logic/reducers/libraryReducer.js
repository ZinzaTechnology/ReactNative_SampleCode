import { GET_LIBRARY } from "../actions/actionsTypes";

const initState = {
  books: []
};

function libraryReducer(state = initState, action) {
  switch (action.type) {
    case GET_LIBRARY:
      return {
        books: action.books
      };

    default:
      return state;
  }
}

export default libraryReducer;
