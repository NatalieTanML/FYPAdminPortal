import {
    ORDER_GET_REQUEST
} from "@/store/actions/order";

import { apiCall, api_routes } from "@/utils/api";

const state = {
    order: []
}

const getters = {
orderItems: state => state.order
}

const actions = {
    [ORDER_GET_REQUEST]: ({ commit }) => {
        console.log("getOrder() called")
        return new Promise((resolve, reject) => {
            commit(ORDER_GET_REQUEST);
            apiCall({ url: api_routes.order.get, method: "get" })
                .then(resp => {
                    console.log("this is called")
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
    [ORDER_GET_REQUEST]: state => {
        // state.order
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}