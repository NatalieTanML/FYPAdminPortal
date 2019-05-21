import {
    SIGN_IN,
    SIGN_IN_REQUEST,
    SIGN_IN_ERROR,
    SIGN_IN_SUCCESS,
    USER_LOGOUT,
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_ERROR,
    GET_ALL_USERS,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_ERROR,
    GET_ONE_USER,
    GET_ONE_USER_SUCCESS,
    GET_ONE_USER_ERROR,
    UPDATE_ONE_USER,
    UPDATE_ONE_USER_SUCCESS,
    UPDATE_ONE_USER_ERROR,
    SET_GETONEUSERID
} from "@/store/actions/user"

import { apiCall, api_routes } from "@/utils/api";
import axios from 'axios';
import router from "./../../router";
import store from "..";

const state = {
    token: localStorage.getItem("token") || "",
    status: "",
    changePassword: false,
    userId: null,
    userRole: null,
    getOneId: null,
  };

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    changePassword: state => state.changePassword,
    userId: state => state.userId,
    userRole: state => state.role,
    getOneId: state =>state.getOneId
  };

  //https://stackoverflow.com/questions/40390411/vuex-2-0-dispatch-versus-commit
const actions = {
    [SIGN_IN]: ({commit, dispatch}, user) =>{
        return new Promise((resolve, reject) => {
            commit(SIGN_IN_REQUEST);
            apiCall({ url: api_routes.user.sign_in, data: user, method: 'post' })
              .then(resp => {

                localStorage.setItem("token", resp.token);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + resp.token
                
                commit(SIGN_IN_SUCCESS, resp);
                //dispatch(USER_REQUEST);
                resolve(resp);
              })
              .catch(err => {
                commit(SIGN_IN_ERROR, err);
                localStorage.removeItem('token');
                reject(err);
              });
        })
    },
    [USER_LOGOUT]: ({ commit }) => {
      return new Promise(resolve => {
        commit(USER_LOGOUT);
        localStorage.removeItem("token");
        state.changePassword = false;
        router.push("/login");
        resolve();
      });
    },

    [ADD_USER]:({commit, dispatch}, user) =>{
      return new Promise((resolve, reject) => {
        commit(ADD_USER);
        apiCall({ url: api_routes.user.sign_up, data: user, method: 'post' })
        .then(resp => {
          commit(ADD_USER_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(ADD_USER_ERROR, err);
          reject(err);
        });

      });
    },
    [GET_ALL_USERS]:({commit, dispatch}) =>{
      return new Promise((resolve, reject) => {
        commit(GET_ALL_USERS);
        apiCall({ url: api_routes.user.get_all, method: 'get' })
        .then(resp => {
          commit(GET_ALL_USERS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_ALL_USERS_ERROR, err);
          reject(err);
        });

      });
    },
    [UPDATE_ONE_USER]:({commit, dispatch}, formData) =>{
      return new Promise((resolve, reject) => {
        commit(UPDATE_ONE_USER);
        apiCall({ url: api_routes.user.update_one + store.getters.userId, data:formData , method: 'put' })
        .then(resp => {
          commit(UPDATE_ONE_USER_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPDATE_ONE_USER_ERROR, err);
          reject(err);
        });

      });
    },
    [GET_ONE_USER]:({commit, dispatch}) =>{
      return new Promise((resolve, reject) => {
        commit(GET_ONE_USER);
        apiCall({ url: api_routes.user.get_one + store.getters.userId, method: 'get' })
        .then(resp => {
          commit(GET_ONE_USER_SUCCESS, resp);
          resolve(resp)
        })
        .catch(err => {
          commit(GET_ONE_USER_ERROR, err);
          reject(err);
        });

      });
    }

}

const mutations = {
[SIGN_IN]: state =>{
    state.status = "sign in"
},
[SIGN_IN_REQUEST]: state =>{
    state.status = "signing in"
},
[SIGN_IN_SUCCESS]: (state,resp) =>{
  console.log("sign in success: "+resp)
   state.changePassword = resp.user.changePassword
   state.userId = resp.user.userId
   state.userRole = resp.user.userRole
   console.log(resp.user.userRole)
   state.token = resp.token
   state.status = "signed in"
},
[SIGN_IN_ERROR]: state =>{
    state.status = "sign in"
},
[USER_LOGOUT]: state =>{
  state.token = "";
},

[ADD_USER]: state =>{
  state.status = "signing up"
},
[ADD_USER_ERROR]: state =>{
  state.status = "sign up error"
},
[ADD_USER_SUCCESS]: state =>{
  state.status = "sign up success"
},
[GET_ALL_USERS]: state =>{
  state.status = "getting all"
},
[GET_ALL_USERS_SUCCESS]: (state, resp) =>{
  state.status = "get all success"
},
[GET_ALL_USERS_ERROR]: state =>{
  state.status = "get all error"
},
[GET_ONE_USER]: state =>{
  state.status = "getting one user"
},
[GET_ONE_USER_SUCCESS]: state =>{
  state.status = "got one user"
},
[GET_ONE_USER_ERROR]: state =>{
  state.status = "error getting one user"
},
[UPDATE_ONE_USER]: state =>{
  state.status = "updating one user"
},
[UPDATE_ONE_USER_SUCCESS]: state =>{
  state.status = "updated one user"
},
[UPDATE_ONE_USER_ERROR]: state =>{
  state.status = "failed to update one user"
},
[SET_GETONEUSERID]: (state, id) =>{
  state.getOneId = id
}
}

export default {
    state,
    getters,
    actions,
    mutations
  };
  