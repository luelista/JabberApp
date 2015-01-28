window.App = window.App || {};

(function(App) {
  var Client = require('node-xmpp-client');
  var xmpp = require('node-xmpp-client/node_modules/node-xmpp-core');
  var ltx = require('node-xmpp-client/node_modules/node-xmpp-core/node_modules/ltx');

  var XMLNS_MUC = "http://jabber.org/protocol/muc";


  var XmppAccount = function(objectInfo) {
    this.rowid = null;
    this.jid = "";
    this.password = "";
    this.server = "";
    this.port = 5222;
    this.enable = false;
    this.usetls = true;
    this.usessl = false;
    this.online = false;
    this.xmppConn = null;
    this.connError = null;

    if (objectInfo) {
      if (objectInfo.rowid) this.rowid = objectInfo.rowid;
      if (objectInfo.jid) this.jid = objectInfo.jid;
      if (objectInfo.password) this.password = objectInfo.password;
      if (objectInfo.server) this.server = objectInfo.server;
      if (objectInfo.port) this.port = parseInt(objectInfo.port,10);
      if (objectInfo.enable) this.enable = (objectInfo.enable=="true");
    }
  }
  XmppAccount.prototype.store = function() {
    App.DatabaseRef.transaction(function(t) {
      if (this.id) {
        t.executeSql("UPDATE loginaccounts SET jid=?, password=?, server=?, port=?, enable=? WHERE rowid = ?",
        [this.jid, this.password, this.server, this.port, this.enable?"true":"false", this.rowid]);
      } else {
        t.executeSql("INSERT INTO loginaccounts ( jid, password, server, port, enable ) VALUES(?,?,?,?,?)",
        [this.jid, this.password, this.server, this.port, this.enable?"true":"false"], function(t,results) {
          console.log(t,results);
          this.rowid = results.insertId;
        }.bind(this));
      }
    }.bind(this));
  }
  XmppAccount.prototype.getJid = function() {
    return new xmpp.JID(this.jid);
  }
  function onStanza (stanza) {
    console.log("onStanza");
    console.log("Incoming Stanza from:"+stanza.attrs.from, stanza);
  }

  XmppAccount.prototype.makeXmppConn = function() {
    this.xmppConn = new Client({ jid: this.jid, password: this.password });
    this.xmppConn.on("stanza", onStanza);
    console.log("Creating connection to: "+this.jid)
  }

  XmppAccount.prototype.xmppSend = function(debug, stanza) {
    console.log("xmppSend: "+debug, stanza);
    this.xmppConn.send(stanza);
  }

  function randId() {
    return (new Date()*1000000)+Math.floor(Math.random()*1000000);
  }

  XmppAccount.prototype.joinRoom = function(conversation, type) {
    var roomjid = conversation.getJid();
    if (!roomjid.resource) roomjid.resource=this.getJid().user;
    var p = new ltx.Element('presence', { from: this.xmppConn.jid, to: roomjid, id: randId() });
    if (type) p.attrs.type = type;
    var x = p.c('x', { xmlns: XMLNS_MUC /*+ '#user'*/ });
    this.xmppSend("Joining room ", p);
  }

  XmppAccount.prototype.toString = function() {
    return this.jid;
  }

  App.XmppAccount = XmppAccount;
})(App);
