import {
    UPLOAD_PRODUCT_IMAGES,
    DELETE_PRODUCT_IMAGES,
    UPLOAD_AND_DELETE_PRODUCT_IMAGES,
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
    DELETE_PRODUCT_ERROR
} from "@/store/actions/product"

import { apiCall, api_routes } from "@/utils/api";

const state = {
    addImage: null,
    deleteGuids: null
}

const getters = {

}

const actions = {
    [UPLOAD_PRODUCT_IMAGES]: ({ commit }, formData) => {
        let addImage;
        if (state.addImage !== null) {
            addImage = state.addImage;
        } else {
            addImage = formData
        }
        console.log(addImage)
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.s3.upload, data: addImage, method: 'post' })
                .then(resp => {
                    console.dir(resp)
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
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
                    reject(err);
                })
        })
    },

    [UPLOAD_AND_DELETE_PRODUCT_IMAGES]: ({ commit, dispatch }, { formData, guids }) => {
        let obj = {
            formData,
            guids
        }
        commit(UPLOAD_AND_DELETE_PRODUCT_IMAGES, obj)
        let UPLOAD_PRODUCT_IMAGES = dispatch("UPLOAD_PRODUCT_IMAGES", formData);
        let DELETE_PRODUCT_IMAGES = dispatch("DELETE_PRODUCT_IMAGES", guids);

        // https://forum.vuejs.org/t/best-practice-for-handling-multiple-api-calls-inside-vuex-action/49443/2
        return Promise.all([UPLOAD_PRODUCT_IMAGES, DELETE_PRODUCT_IMAGES])
            .then(resp => {
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
        console.log(state.deleteGuids)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
