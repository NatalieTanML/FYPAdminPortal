import {
  GET_ALL_HOTELS,
  GET_ONE_HOTEL,
  CREATE_HOTEL,
  UPDATE_ONE_HOTEL,
  DELETE_HOTEL
} from "@/store/actions/hotel";

import { apiCall, api_routes } from "@/utils/api";

const state = {
  hotel: [],
  status: null
};

const getters = {
  hotel: state => state.hotel,
  status: state => state.status
};

const actions = {
  [GET_ALL_HOTELS]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.hotel.get_all, method: "get" })
        .then(resp => {
          console.dir(resp);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [GET_ONE_HOTEL]: ({ commit }, hotelId) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.hotel.get_one + "/" + hotelId, method: "get" })
        .then(resp => {
          console.dir(resp);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [CREATE_HOTEL]: ({ commit }, jsonData) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.hotel.create, data: jsonData, method: "post" })
        .then(resp => {
          console.dir(resp);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [UPDATE_ONE_HOTEL]: ({ commit }, jsonData) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.hotel.update + "/" + jsonData.orderId,
        data: jsonData,
        method: "put"
      })
        .then(resp => {
          console.dir(resp);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

const mutations = {
  [GET_ALL_HOTELS]: state => {}
};

export default {
  state,
  getters,
  actions,
  mutations
};
