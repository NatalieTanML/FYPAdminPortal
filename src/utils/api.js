import axios from 'axios';

export const api_routes = {

  user: {
    sign_in: 'api/users/signin',
    sign_up: 'api/users/signup',
    get_all: 'api/users/',
    get_one: 'api/users/',
    update_one: 'api/users/',
    get_all_roles: 'api/users/getRoles',
    change_password: 'api/users/changepassword'
  },
  order: {
    get:'api/orders/1'
  }

};

export const apiCall = ({ url, method, ...args }) =>
  new Promise((resolve, reject) => {
    let token = localStorage.getItem('token') || '';
    console.log(url + " " + method)
    if (token)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    
    try {
      axios({
        method: method || 'get',
        url: url,
        ...args
      })
        .then(resp => {
          resolve(resp.data);
        })
        .catch(error => {
          reject(error);
        });
    } catch (err) {
      reject(new Error(err));
    }

  });