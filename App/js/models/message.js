window.App = window.App || {};

(function(App) {
  var Message = function() {
    this.messageId = "";
    this.body = "";
    this.sender = null;
    this.recipient = null;
    this.conversation = null;
  }

  App.Message = Message;
})(App);
