window.App = window.App || {};

(function(App) {
  var xmppClient = require('node-xmpp-client');

  var Conversation = function(account, objectInfo) {
    this.id = null;
    this.account = null;
    this.conversationtype = 1;
    this.jid = null;
    this.password = "";
    this.notify = Conversation.NOTIFY_ALL;
    this.do_join = true;
    this.is_joined = false;

    if (account) this.account = account;
    if (objectInfo) {
      if (objectInfo.id) this.id = objectInfo.id;
      if (objectInfo.jid) this.jid = objectInfo.jid;
      if (objectInfo.password) this.password = objectInfo.password;
      if (objectInfo.notify) this.notify = parseInt(objectInfo.notify,10);
      if (objectInfo.do_join) this.do_join = (objectInfo.do_join=="true");
    }
  }

  Conversation.TYPE_SINGLE = 0;
  Conversation.TYPE_MULTI = 1;

  Conversation.NOTIFY_ALL = 2;
  Conversation.NOTIFY_MENTION = 1;
  Conversation.NOTIFY_NEVER = 0;

  Conversation.prototype.getPresenceStanza = function(type) {
    var p = new xmppClient.Element('presence', { from: from, to: this.jid, id: randId() });
    if (type) p.attrs.type = type;
    var x = p.c('x', { xmlns: XMLNS_MUC + '#user' });
    x.c('item', { affiliation: affil, role: role, jid: fromJid });
    if(status) {
      for(var i=0; i<status.length; i++) x.c('status', { code: status[i] });
    }
    if (xmppShow) p.c('show').t(xmppShow);
    if (xmppStatus) p.c('status').t(xmppStatus);
    else if (fromJid) p.c('status').t(getUserInfo(fromJid, "statusMessage"));
    xmppSend("xmppSendPresence", p);
  }

  Conversation.prototype.store = function() {
    App.DatabaseRef.transaction(function(t) {
      if (this.id) {
        t.executeSql("UPDATE conversation SET jid=?, password=?, notify=?, do_join=? WHERE id = ?",
        [this.jid, this.password, this.notify, this.do_join?"true":"false", this.id]);
      } else {
        t.executeSql("INSERT INTO conversation ( jid, password, notify, do_join ) VALUES(?,?,?,?,?)",
        [this.jid, this.password, this.notify, this.do_join?"true":"false"], function(t,results) {
          console.log(r,results);
          this.id = results.insertId;
        }.bind(this));
      }
    }.bind(this));
  }

  App.Conversation = Conversation;
})(App);
