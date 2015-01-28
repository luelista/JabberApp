window.App = window.App || {};

(function(App) {
  var xmppClient = require('node-xmpp-client');
  var xmpp = require('node-xmpp-client/node_modules/node-xmpp-core');
  var ltx = require('node-xmpp-client/node_modules/node-xmpp-core/node_modules/ltx');

  var XMLNS_MUC = "http://jabber.org/protocol/muc";

  var Conversation = function(account, objectInfo) {
    this.rowid = null;
    this.account = null;
    this.conversationtype = 1;
    this.jid = null;
    this.display_name = null;
    this.subject = null;
    this.password = "";
    this.notify = Conversation.NOTIFY_ALL;
    this.do_join = true;
    this.is_joined = false;
    this.unread = 0;

    if (account) this.account = account;
    if (objectInfo) {
      if (objectInfo.rowid) this.rowid = objectInfo.rowid;
      if (objectInfo.roomjid) this.jid = objectInfo.roomjid;
      if (objectInfo.jid) this.jid = objectInfo.jid;
      if (objectInfo.display_name) this.display_name = objectInfo.display_name;
      if (objectInfo.subject) this.subject = objectInfo.subject;
      if (objectInfo.password) this.password = objectInfo.password;
      if (objectInfo.notify) this.notify = parseInt(objectInfo.notify,10);
      if (objectInfo.do_join) this.do_join = (objectInfo.do_join=="true");
    }
    if (typeof this.jid == "string") this.jid = new xmpp.JID(this.jid);;
  }

  Conversation.TYPE_SINGLE = 0;
  Conversation.TYPE_MULTI = 1;

  Conversation.NOTIFY_ALL = 2;
  Conversation.NOTIFY_MENTION = 1;
  Conversation.NOTIFY_NEVER = 0;

  Conversation.getAll = function(callback) {
    App.DatabaseRef.transaction(function(tx) {
      console.log("in transaction");
      tx.executeSql('SELECT *,rowid FROM conversation', [], function(tx, results) {
        console.log("result")
        callback(tx, results);
      }, App.SqlError);
    });
  }

  Conversation.prototype.getJid = function() {
    return this.jid;
  }

  Conversation.prototype.getDisplayName = function() {
    if (this.display_name && this.display_name.length>0) return this.display_name;
    if (this.subject && this.subject.length>0) return this.subject;
    return this.getJid().user;
  }

  Conversation.prototype.store = function() {
    App.DatabaseRef.transaction(function(t) {
      if (this.id) {
        t.executeSql("UPDATE conversation SET roomjid=?, password=?, notify=?, do_join=?, display_name=?,subject=?,account_id=? WHERE rowid = ?",
        [this.jid, this.password, this.notify, this.do_join?"true":"false", this.display_name, this.subject,this.account.rowid, this.rowid], null, App.SqlError);
      } else {
        t.executeSql("INSERT INTO conversation ( roomjid, password, notify, do_join, display_name, subject,account_id ) VALUES(?,?,?,?,?,?,?)",
        [this.jid, this.password, this.notify, this.do_join?"true":"false",this.display_name, this.subject,this.account.rowid], function(t,results) {
          console.log(results);
          this.rowid = results.insertId;
        }.bind(this), App.SqlError);
      }
    }.bind(this));
  }

  App.Conversation = Conversation;
})(App);
