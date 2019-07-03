import {
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
    product: [],
}

const getters = {

    }

const actions = {
    [GET_ALL_PRODUCTS]: ({ commit }, orderId) => {
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
}

const mutations = {
    [GET_ALL_PRODUCTS]: state =>{
        state.status = "getting all products"
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}