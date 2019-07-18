import axios from "axios";

export const api_routes = {
  user: {
    sign_in: 'api/users/signin',
    sign_up: 'api/users/signup',
    get_all: 'api/users/',
    get_one: 'api/users/',
    update_one: 'api/users/',
    get_all_roles: 'api/users/getRoles',
    get_all_deliverymen: 'api/users/deliverymen',
    change_password: 'api/users/changepassword'
  },
  order: {
    get: "api/orders/",
    get_all: "api/orders/",
    get_multiple: "api/orders/multi",
    get_all_status: "api/orders/getOrderStatus",
    update_deliveryman: "api/orders/deliveryman",
    update_order_status: "api/orders/status",
    get_presigned_url: "api/s3/url",
    update_recipient: "api/orders/recipient",
    getHotels: "/api/hotels/",
    updateOrder: "/api/orders/",
    getAllDeliveryTypes: "api/orders/getAllDeliveryTypes"
  },
  product: {
    create: 'api/products',
    update: 'api/products',
    get_one: 'api/products/',
    get_all: 'api/products/',
    update_stock: 'api/products/stock/'
  },
  s3: {
    upload: 'api/s3/product',
    delete: 'api/s3/delete'
  }
};

export const apiCall = ({ url, method, ...args }) =>
  new Promise((resolve, reject) => {
    let token = localStorage.getItem("token") || "";
    console.log(url + " " + method);
    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

    try {
      axios({
        method: method || "get",
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
