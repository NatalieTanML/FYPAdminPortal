const signalR = require("@aspnet/signalr");

class OrderHub {
  async connectToOrderHub() {
    return new signalR.HubConnectionBuilder()
      .withUrl(process.env.VUE_APP_API_ENDPOINT + "order-hub")
      .configureLogging(signalR.LogLevel.Error)
      .build();
  }
}
export default new OrderHub();
