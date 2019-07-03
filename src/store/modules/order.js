import {
    ORDER_GET_REQUEST,
    GET_ALL_ORDERS,
    GET_ALL_STATUS,
    UPDATE_DELIVERYMAN,
    UPDATE_ORDER_STATUS,
} from "@/store/actions/order";



import { apiCall, api_routes } from "@/utils/api";

const state = {
    order: [],
    status : null,
}

const getters = {
orderItems: state => state.order,
status: state => state.status
}

const actions = {
    [ORDER_GET_REQUEST]: ({ commit }, orderId) => {
        console.log("getOrder() called")
        return new Promise((resolve, reject) => {
            commit(ORDER_GET_REQUEST);
            apiCall({ url: api_routes.order.get + '/' +orderId, method: "get" })
                .then(resp => {
                    console.log("this is called")
                    console.dir(resp)
                  
                    resolve(resp);
                })
                .catch(err => {
                    
                    reject(err);
                })
        })
    },

    [GET_ALL_ORDERS]: ({commit}) =>{
        return new Promise((resolve, reject) => {
            commit(GET_ALL_ORDERS);
            apiCall({ url: api_routes.order.get_all, method: "get" })
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    
    [GET_ALL_STATUS]: ({commit}) =>{
        return new Promise((resolve, reject) => {
            commit(GET_ALL_STATUS);
            apiCall({ url: api_routes.order.get_all_status, method: "get" })
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    [UPDATE_DELIVERYMAN]: ({ commit },arrayOfIds) => {
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.order.update_deliveryman +"/"+arrayOfIds[1] , data:arrayOfIds, method: "put" })
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    [UPDATE_ORDER_STATUS] : ({commit}, jsonData) =>{    
        return new Promise((resolve, reject) => {
            apiCall({ url: api_routes.order.update_order_status+"/"+jsonData.isSuccessful, data:jsonData.orderIds, method: "put" })
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}


const mutations = {
    [ORDER_GET_REQUEST]: state => {
        // state.order
    },
    [GET_ALL_ORDERS]: state =>{
        state.status = "getting all orders"
    },
    [GET_ALL_STATUS]: state =>{
        state.status = "getting all status"
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}