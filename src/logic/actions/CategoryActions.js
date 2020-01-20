import {
  FETCH_CATEGORY_DATA,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_ERROR,
  ACTIVE_FILTER_CATEGORY,
  DEACTIVE_FILTER_CATEGORY
} from "./actionsTypes";

import * as api from "../api";

const requestCategoryData = () => {
  return {
    type: FETCH_CATEGORY_DATA
  };
};

const receiveCategoryData = items => {
  return {
    type: FETCH_CATEGORY_SUCCESS,
    items
  };
};

const fetchCategoryError = error => {
  return {
    type: FETCH_CATEGORY_ERROR,
    error
  };
};

export const activeFilterCategory = categoryId => {
  return {
    type: ACTIVE_FILTER_CATEGORY,
    categoryId
  }
}

export const deactiveFilterCategory = _ => {
  return {
    type: DEACTIVE_FILTER_CATEGORY
  }
}

const fetchCategoryData = () => {
  return dispatch => {
    dispatch(requestCategoryData());
    api
      .getListCategory()
      .then(response => {
        const { content } = response.body;
        dispatch(receiveCategoryData(content));
      })
      .catch(error => dispatch(fetchCategoryError(error)));
  };
};

const shouldFetchCategoryData = state => {
  if(state.items.length == 0){
    return !state.isFetching;
  }else{
    return state.items.length == 0
  } 
};

export const fetchCategoryDataIfNeed = () => {
  return (dispatch, getState) => {
    const state = getState().category;
    if (shouldFetchCategoryData(state)) {
      return dispatch(fetchCategoryData());
    }
  };
};
