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
    DELETE_PRODUCT_ERROR,
    UPDATE_STOCK,
} from "@/store/actions/product"

import { apiCall, api_routes } from "@/utils/api";

const state = {
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
    [GET_ONE_PRODUCT]: ({ commit }, id) => {
        console.log("GET_ONE_PRODUCT called")
        return new Promise((resolve, reject) => {
            commit(GET_ONE_PRODUCT);
            apiCall({ url: api_routes.product.get_one + id, method: "get" })
                .then(resp => {
                    console.dir(resp)
                  
                    resolve(resp);
                })
                .catch(err => {
                    
                    reject(err);
                })
        })
    },
    [UPDATE_STOCK]: ({ commit }, data) => {
        console.log("UPDATE_STOCK called")
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
}

const mutations = {
    [GET_ALL_PRODUCTS]: state =>{
        state.status = "getting all products"
    },
    [GET_ONE_PRODUCT]: state =>{
        state.status = "getting one products"
    },
    [UPDATE_STOCK]: state =>{
        state.status = "UPDATE_STOCK"
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}