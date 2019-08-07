import {
  UPLOAD_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGES,
  UPLOAD_AND_DELETE_PRODUCT_IMAGES,
  UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS,
  CREATE_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_ONE_PRODUCT,
  GET_ONE_PRODUCT_ECOMMERCE,
  UPDATE_ONE_PRODUCT,
  UPDATE_STOCK
} from "@/store/actions/product";

import { apiCall, api_routes } from "@/utils/api";

const getDefaultState = () => {
  return {
    addImage: null,
    deleteGuids: null,
    product: []
  };
};

const state = {
  addImage: null,
  deleteGuids: null,
  product: []
};

const getters = {};

const actions = {
  [GET_ALL_PRODUCTS]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.product.get_all, method: "get" })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [UPLOAD_PRODUCT_IMAGES]: ({ commit }, formData) => {
    let addImage;
    if (state.addImage !== null) {
      addImage = state.addImage;
    } else {
      addImage = formData;
    }

    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.s3.upload, data: addImage, method: "post" })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [DELETE_PRODUCT_IMAGES]: ({ commit }, guids) => {
    let deleteGuids;
    if (state.addImage !== null) {
      deleteGuids = state.deleteGuids;
    } else {
      deleteGuids = guids;
    }
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.s3.delete, data: deleteGuids, method: "post" })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [UPLOAD_AND_DELETE_PRODUCT_IMAGES]: (
    { commit, dispatch },
    { formData, guids }
  ) => {
    let obj = {
      formData,
      guids
    };
    commit(UPLOAD_AND_DELETE_PRODUCT_IMAGES, obj);

    let UPLOAD_PRODUCT_IMAGES = dispatch("UPLOAD_PRODUCT_IMAGES");
    let DELETE_PRODUCT_IMAGES = dispatch("DELETE_PRODUCT_IMAGES");

    return Promise.all([UPLOAD_PRODUCT_IMAGES, DELETE_PRODUCT_IMAGES])
      .then(resp => {
        commit(UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS);
        return resp;
      })
      .catch(err => {
        return err;
      });
  },

  [CREATE_PRODUCT]: ({ commit }, productObj) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.product.create,
        data: productObj,
        method: "post"
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [UPDATE_ONE_PRODUCT]: ({ commit }, productObj) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.product.update,
        data: productObj,
        method: "put"
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [UPDATE_STOCK]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_STOCK);
      apiCall({
        url: api_routes.product.update_stock + data[0] + "/" + data[1],
        method: "put"
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [GET_ONE_PRODUCT]: ({ commit }, productId) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.product.get_one + productId, method: "get" })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  [GET_ONE_PRODUCT_ECOMMERCE]: ({ commit }, productId) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.product.get_one_ecommerce + productId,
        method: "get"
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

const mutations = {
  [UPLOAD_AND_DELETE_PRODUCT_IMAGES]: (state, { formData, guids }) => {
    state.addImage = formData;
    state.deleteGuids = guids;
  },

  [UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS]: state => {
    Object.assign(state, getDefaultState());
  },
  [UPDATE_STOCK]: state => {
    state.status = "update stock";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
