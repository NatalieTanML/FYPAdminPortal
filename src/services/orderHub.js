const signalR = require("@aspnet/signalr");

class OrderHub {
  async connectToOrderHub() {
    return new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44393/order-hub")
      .configureLogging(signalR.LogLevel.Error)
      .build();
  }
}
export default new OrderHub();