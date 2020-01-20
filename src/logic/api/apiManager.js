const Frisbee = require("frisbee");
import * as constants from "../constants";

const request = new Frisbee({
  baseURI: constants.API_HOST,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

const apiManager = {
  get: (url, header) => {
    console.log("[API] request get data", url);
    return new Promise(function(resolve, reject) {
      request
        .get(url, { headers: header })
        .then(response => {
          if (response.ok) {
            console.log("[API] get", response);
            resolve(response);
          } else {
            console.log("[API] get NOK", response.status, response);
            reject(response.body);
          }
        })
        .catch(err => {
          console.log("[API] getError", err.response);
          reject(err);
        });
    });
  },
  post: (url, header, data) => {
    console.log("[API] request post data", data);
    return new Promise(function(resolve, reject) {
      request
        .post(url, { headers: header, body: data })
        .then(response => {
          console.log("response: ", response)
          if (response.ok) {
            console.log("[API] post", response);
            resolve(response);
          } else {
            console.log("[API] post NOK", response.body);
            reject(response.body);
          }
        })
        .catch(err => {
          console.log("[API] postErr", err);
          reject(err);
        });
    });
  },
  delete: (url, header, data) => {
    console.log("[API] request delete data", url);
    return new Promise(function(resolve, reject) {
      request
        .del(url, { headers: header, body: data })
        .then(response => {
          console.log("[API] delete", response);
          if (response.ok) {
            console.log("[API] delete", response);
            resolve(response);
          } else {
            console.log("[API] delete NOK", response.body);
            reject(response.body);
          }
        })
        .catch(err => {
          console.log("[API] deleteErr", err.message);
          reject(err);
        });
    });
  },
  put: (url, header, data) => {
    console.log("[API] request put data", url);
    return new Promise(function(resolve, reject) {
      request
        .put(url, { headers: header, body: data })
        .then(response => {
          if (response.ok) {
            console.log("[API] put", response);
            resolve(response);
          } else {
            console.log("[API] put NOK", response.body);
            reject(response.body);
          }
        })
        .catch(err => {
          console.log("[API] putErr", err.message);
          reject(err);
        });
    });
  }
};

export default apiManager;
