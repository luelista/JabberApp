window.App = window.App || {};

(function(App) {
  var Message = function() {
    this.messageId = "";
    this.body = "";
    this.sender = "";
    this.recipient = "";
    this.conversation = null;
  }

  App.Message = Message;
})(App);
