window.App = window.App || {};

(function(App) {
  var xmpp = require('node-xmpp-client/node_modules/node-xmpp-core');

  var Message = function(obj) {
    this.messageId = "";
    this.body = "";
    this.sender = null;
    this.recipient = null;
    this.conversation = null;
    this.date = new Date();

    if (obj) {
      if (obj.messagebody) this.body=obj.messagebody;
      if (obj.jid) this.sender = new xmpp.JID(obj.jid);
      if (obj.datedt) this.date = new Date(obj.datedt);

    }
  }

  App.Message = Message;
})(App);
