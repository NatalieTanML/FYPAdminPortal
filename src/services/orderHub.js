const signalR = require("@aspnet/signalr");

class OrderHub {
  async connectToOrderHub() {
    return new signalR.HubConnectionBuilder()
      .withUrl("https://memoriesapi.tk/order-hub")
      .configureLogging(signalR.LogLevel.Error)
      .build();
  }
}
export default new OrderHub();
