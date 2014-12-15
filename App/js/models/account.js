window.App = window.App || {};

(function(App) {
  var Account = function(objectInfo) {
    this.id = null;
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
      if (objectInfo.id) this.id = objectInfo.id;
      if (objectInfo.jid) this.jid = objectInfo.jid;
      if (objectInfo.password) this.password = objectInfo.password;
      if (objectInfo.server) this.server = objectInfo.server;
      if (objectInfo.port) this.port = parseInt(objectInfo.port,10);
      if (objectInfo.enable) this.enable = (objectInfo.enable=="true");
    }
  }
  Account.prototype.store = function() {
    App.DatabaseRef.transaction(function(t) {
      if (this.id) {
        t.executeSql("UPDATE loginaccounts SET jid=?, password=?, server=?, port=?, enable=? WHERE id = ?",
        [this.jid, this.password, this.server, this.port, this.enable?"true":"false", this.id]);
      } else {
        t.executeSql("INSERT INTO loginaccounts ( jid, password, server, port, enable ) VALUES(?,?,?,?,?)",
        [this.jid, this.password, this.server, this.port, this.enable?"true":"false"], function(t,results) {
          console.log(r,results);
          this.id = results.insertId;
        }.bind(this));
      }
    }.bind(this));
  }

  App.Account = Account;
})(App);
