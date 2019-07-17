import {
    UPLOAD_PRODUCT_IMAGES,
    DELETE_PRODUCT_IMAGES,
    UPLOAD_AND_DELETE_PRODUCT_IMAGES,
    UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_ERROR,
    GET_ALL_PRODUCTS,
    GET_ALL_PRODUCTS_SUCCESS,
    GET_ALL_PRODUCTS_ERROR,
    GET_ONE_PRODUCT,
    GET_ONE_PRODUCT_SUCCESS,
    GET_ONE_PRODUCT_ERROR,
    UPDATE_ONE_PRODUCT,
    UPDATE_ONE_PRODUCT_SUCCESS,
    UPDATE_ONE_PRODUCT_ERROR,
    DELETE_PRODUCT,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_ERROR,
    UPDATE_STOCK,
} from "@/store/actions/product"

import { apiCall, api_routes } from "@/utils/api";

const getDefaultState = () => {
    return {
        addImage: null,
        deleteGuids: null,
        product: [],
    }
}

const state = {
    addImage: null,
    deleteGuids: null,
    product: [],
}

const getters = {

}


const actions = {
    [GET_ALL_PRODUCTS]: ({ commit }) => {
        console.log("GET_ALL_PRODUCTS called")
        return new Promise((resolve, reject) => {
            commit(GET_ALL_PRODUCTS);
            apiCall({ url: api_routes.product.get_all, method: "get" })
                .then(resp => {
                    console.dir(resp)

                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    [UPLOAD_PRODUCT_IMAGES]: ({ commit }, formData) => {
        let addImage;
        if (state.addImage !== null) {
            addImage = state.addImage;
        } else {
            addImage = formData
        }

        for (var pair of addImage.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }

        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.s3.upload, data: addImage, method: 'post' })
                .then(resp => {
                    console.dir(resp)
                    resolve(resp);
                })
                .catch(err => {
                })
        })
    },

    [DELETE_PRODUCT_IMAGES]: ({ commit }, guids) => {
        let deleteGuids;
        if (state.addImage !== null) {
            deleteGuids = state.deleteGuids;
        } else {
            deleteGuids = guids
        }
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.s3.delete, data: deleteGuids, method: 'post' })
                .then(resp => {
                    console.dir(resp)
                    resolve(resp);
                })
                .catch(err => {
                })
        })
    },

    [UPLOAD_AND_DELETE_PRODUCT_IMAGES]: ({ commit, dispatch }, { formData, guids }) => {
        let obj = {
            formData,
            guids
        }
        commit(UPLOAD_AND_DELETE_PRODUCT_IMAGES, obj)

        let UPLOAD_PRODUCT_IMAGES = dispatch("UPLOAD_PRODUCT_IMAGES");
        let DELETE_PRODUCT_IMAGES = dispatch("DELETE_PRODUCT_IMAGES");

        // https://forum.vuejs.org/t/best-practice-for-handling-multiple-api-calls-inside-vuex-action/49443/2
        return Promise.all([UPLOAD_PRODUCT_IMAGES, DELETE_PRODUCT_IMAGES])
            .then(resp => {
                commit(UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS)
                // Both done
                // The order is preserved regardless of what resolved first
                // upload, delete
                console.dir(resp)
                return resp;
            })
        // .catch(err => {
        //     reject(err);
        // });
    },

    [CREATE_PRODUCT]: ({ commit }, productObj) => {
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.product.create, data: productObj, method: 'post' })
                .then(resp => {
                    console.dir(resp)
                    resolve(resp);
                })
                .catch(err => {
                })
        })
    },

    [UPDATE_STOCK]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            commit(UPDATE_STOCK);
            apiCall({ url: api_routes.product.update_stock + data[0] + "/" + data[1], method: "put" })
                .then(resp => {
                    console.dir(resp)

                    resolve(resp);
                })
                .catch(err => {

                    reject(err);
                })
        })
    },

    [GET_ONE_PRODUCT]: ({ commit }, productId) => {
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.product.get_one + productId, method: 'get' })
                .then(resp => {
                    console.dir(resp)
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}

const mutations = {
    [UPLOAD_AND_DELETE_PRODUCT_IMAGES]: (state, { formData, guids }) => {
        state.addImage = formData;
        state.deleteGuids = guids
        console.log(state.addImage)
    },

    [UPLOAD_AND_DELETE_PRODUCT_IMAGES_SUCCESS]: (state) => {
        Object.assign(state, getDefaultState())
        console.log(state)
    },
}

export default {
    state,
    getters,
    actions,
    mutations
};
