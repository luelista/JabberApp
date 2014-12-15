window.App = window.App || {};

(function() {
  var nw = require('nw.gui');

  var self = App.AccountController = {};

  self.accounts = [];

  self.loadAccountData = function() {
    App.DatabaseRef.transaction(function(tx) {
      tx.executeSql('SELECT * FROM loginaccounts', [], function(tx, results) {
        var len = results.rows.length, i;
        console.log(results.rows.length, results.rows)
        for (i = 0; i < len; i++) {
          var d = results.rows.item(i);
          var account = new App.Account(d);
          self.accounts.push(account);
          if(account.enable) self.goOnline(account);
        }
        console.log(self.accounts);
        self.refreshAccountList();
      });
    });
  }


  self.goOnline = function(account) {
    account.xmppConn = new Client({ jid: account.jid, password: account.password });
    account.xmppConn.on("online", function() {
      account.online = true;
      self.refreshAccountList();
    })
  }

  self.refreshAccountList = function() {
    var $al = $("#accountList");
    $al.html("");
    for(var i = 0; i < this.accounts.length; i++) {
      var d = this.accounts[i];
      $al.append("<div><i class='fa fa-circle' style='color:" + (d.online ? "green" : "gray") + "'></i> " + d.jid
        + "<span class='pull-right'>"
        + (d.enable ? "<i class='fa fa-toggle-on'></i>" : "<i class='fa fa-toggle-off'></i>") + "</span></div>");
    }
  }

  self.addAccountWithPopup = function() {
    var $m = $('#modal_addAccount'); $m.foundation('reveal', 'open');
    $m.find('form')[0].reset();
    $m.find('.alert-box').hide();
  }

  self.init = function() {
    $("#accountList_addAccount").click(function() {
      self.addAccountWithPopup();
    });
    $("#modal_addAccount .f-ok-btn").click(function() {
      var $win  =$("#modal_addAccount");
      var acc = new App.Account();
      acc.jid = $(".f-jid", $win).val();
      acc.password = $(".f-password", $win).val();
      acc.server = $(".f-server", $win).val();
      acc.enable = true;
      if($(".f-port", $win).val()) acc.port = $(".f-port", $win).val();
      self.accounts.push(acc);
      acc.store();
      self.goOnline(acc);
      acc.xmppConn.once("online", function() {
            $win.foundation('reveal', 'close');
      })
      acc.xmppConn.once("error", function(err) {
        $win.find('.alert-box').show().html(err);
      })
      self.refreshAccountList();
    });
  }
})();
