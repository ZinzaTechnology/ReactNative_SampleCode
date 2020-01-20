import apiManager from "./apiManager";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "../constants";

const getAuthorization = async () => {
  const authorization = await RNSecureStorage.get(constants.AS_AUTHORIZATION);
  return authorization;
};

const resetAuthorization = () => {
  authorization = null;
};

const signUpWithEmail = email => {
  return apiManager.post(
    "user/register",
    {},
    {
      email,
      method: "EMAIL"
    }
  );
};

const uploadCardImage = file => {
  return apiManager.post(
    "user/register/upload-file",
    {
      "Content-Type": "multipart/form-data"
    },
    file
  );
};

const signUpWithCards = (email, idCardFileIds, memberCardFileIds) => {
  return apiManager.post(
    "user/register",
    {},
    {
      email,
      idCardFileIds: [idCardFileIds],
      memberCardFileIds: [memberCardFileIds],
      method: "ID_CARD_AND_MEMBER_CARD"
    }
  );
};

const signIn = (userName, password, deviceToken, uuid) => {
  return apiManager.post(
    "auth-service/auth",
    {},
    {
      userName,
      password,
      deviceToken,
      uuid
    }
  );
};

const addBookmark = async (bookId, chapterId, comment, duration) => {
  return apiManager.post(
    `play-service/end-user/books/${bookId}/chapters/${chapterId}/bookmarks`,
    {
      Authorization: await getAuthorization()
    },
    {
      comment,
      duration
    }
  );
};

const addHistory = async (bookId, chapterId) => {
  return apiManager.post(
    `play-service/end-user/books/${bookId}/chapters/${chapterId}/histories`,
    {
      Authorization: await getAuthorization()
    },
    {}
  );
};

const getBookmark = async (bookId, chapterId) => {
  return apiManager.get(
    `play-service/end-user/bookmarks/all?bookId=${bookId}&chapterId=${chapterId}`,
    {
      Authorization: await getAuthorization()
    }
  );
};

const getHistory = async (page, size) => {
  return apiManager.get(
    `play-service/end-user/histories?page=${page}&size=${size}`,
    {
      Authorization: await getAuthorization()
    }
  );
};

const getListBookmark = async (page, size) => {
  return apiManager.get(
    `play-service/end-user/bookmarks?page=${page}&size=${size}`,
    {
      Authorization: await getAuthorization()
    }
  );
};

const getListAuthor = async () => {
  const Authorization = await getAuthorization();
  return apiManager.get("book-service/end-user/authors", {
    Authorization
  });
};

const getListCategory = async () => {
  return apiManager.get("book-service/end-user/categories", {
    Authorization: await getAuthorization()
  });
};

const getSearchList = async (
  requestPage,
  itemPerPage,
  searchText,
  authorFilter,
  categoryFilter,
  speakerFilter,
  sponsorFilter
) => {
  let searchApi = `book-service/end-user/books?page=${requestPage}&size=${itemPerPage}`;
  if (searchText.length > 0) searchApi = `${searchApi}&keyword=${searchText}`;
  if (authorFilter != null) searchApi = `${searchApi}&authorId=${authorFilter}`;
  if (categoryFilter != null)
    searchApi = `${searchApi}&categoryId=${categoryFilter}`;
  if (speakerFilter != null)
    searchApi = `${searchApi}&speakerId=${speakerFilter}`;
  if (sponsorFilter != null)
    searchApi = `${searchApi}&sponsorId=${sponsorFilter}`;
  return apiManager.get(searchApi, {
    Authorization: await getAuthorization()
  });
};

const getListSponsor = async () => {
  return apiManager.get("book-service/end-user/sponsors", {
    Authorization: await getAuthorization()
  });
};

const getListSpeaker = async () => {
  return apiManager.get("book-service/end-user/speakers", {
    Authorization: await getAuthorization()
  });
};

const getBookDetail = async (bookId, page, size) => {
  const chapterApi = `book-service/end-user/books/${bookId}/chapters?page=${page}&size=${size}`;
  return apiManager.get(chapterApi, {
    Authorization: await getAuthorization()
  });
};

const getBookData = async bookId => {
  const bookDataApi = `book-service/end-user/books/${bookId}`;
  return apiManager.get(bookDataApi, {
    Authorization: await getAuthorization()
  });
};

const deleteBookmark = async bookmarkId => {
  const api = `play-service/end-user/bookmarks/${bookmarkId}`;
  return apiManager.delete(api, {
    Authorization: await getAuthorization()
  });
};

const editBookmark = async (bookmarkId, comment) => {
  const api = `play-service/end-user/bookmarks/${bookmarkId}`;
  return apiManager.put(
    api,
    {
      Authorization: await getAuthorization()
    },
    {
      comment
    }
  );
};

const getListNotification = async (page, size) => {
  return apiManager.get(
    `user-service/member/notifications?page=${page}&size=${size}`,
    {
      Authorization: await getAuthorization()
    }
  );
};

const signOut = async uuid => {
  const signOutApi = `user-service/member/logout`;
  return apiManager.post(
    signOutApi,
    {
      Authorization: await getAuthorization()
    },
    {
      uuid
    }
  );
};

const getConfig = async () => {
  const configApi = `user-service/mobile-config`;
  return apiManager.get(configApi, {
    Authorization: await getAuthorization()
  });
};

const changePassword = async (oldPassword, newPassword, newPasswordConfirm) => {
  return apiManager.put(
    "user-service/member/users/change-password",
    {
      Authorization: await getAuthorization()
    },
    {
      oldPassword,
      newPassword,
      newPasswordConfirm
    }
  );
};

export {
  addBookmark,
  addHistory,
  getBookmark,
  getHistory,
  resetAuthorization,
  signUpWithEmail,
  signUpWithCards,
  uploadCardImage,
  signIn,
  getListBookmark,
  getListAuthor,
  getListCategory,
  getSearchList,
  getBookDetail,
  getListSponsor,
  getListSpeaker,
  getBookData,
  deleteBookmark,
  editBookmark,
  getListNotification,
  signOut,
  getConfig,
  changePassword
};
