window.App = window.App || {};

(function() {
  var self = App.ConversationController = {};
  var _ = require("underscore");

  var conversations = [];
  var activeConversation;

  self.loadConversations = function() {
    console.log("LOADING CONVERSATION LIST");
    App.Conversation.getAll(function(tx, results) {
      var len = results.rows.length, i;
      console.log("LOADING CONVERSATION LIST: "+len,tx,results);
      for (i = 0; i < len; i++) {
        var d = results.rows.item(i);
        var account = App.AccountController.getAccountById(d.account_id);
        var conv = new App.Conversation(account, d);
        conversations[conv.rowid] = conv;
      }
      self.refreshList();
    });
  }
  self.getConversationByJid = function(jid) {
    if (typeof jid=="string") jid=new JID(jid);
    var bare=""+jid.bare();

    for(var i in conversations) {
      if (""+conversations[i].jid.bare() == bare) return conversations[i];
    }
    return null;
  }
  self.init = function() {
    self.loadConversations();

    $("#drop_addConversation .f-ok-btn").click(function() {
      var $jid=$("#drop_addConversation .f-jid");
      var jid = $jid.val();

      // TODO make user selectable...
      var account = App.AccountController.getDefaultAccount();

      var conv = new App.Conversation(account, {
        jid: jid,
        do_join: "true"
      });
      conv.store();
      conversations.push(conv);
      self.refreshList();
    });

    $("#conversationList").on("click", "a", function() {
      console.log("ID:"+this.getAttribute("data-rowid"))
      var conv = conversations[this.getAttribute("data-rowid")];
      activeConversation = conv;
      self.displayMessages(conv);
      self.refreshList();
    });
  }

  self.onAccountOnline = function(account) {
    console.log("conversationController was told the account "+account+" is online now")
    conversations.forEach(function(conv) {
      if (account != conv.account) return;
      console.log("joining conference "+conv)
      account.joinRoom(conv);
    });
  }

  self.onMessage = function(msg) {
    var conv = self.getConversationByJid(msg.sender.bare());
    console.log("message in "+conv)
    conv.storeMessage(msg);

    if (conv == activeConversation) self.displayMessage(conv, msg);

  }

  self.displayMessages = function(conv) {
    $("#contentView").html("");
    conv.getMessages(0, 20, function(tx, msgs) {
      var len = msgs.rows.length, i;
      for (i = 0; i < len; i++) {
        var d = new App.Message(msgs.rows.item(i));
        self.displayMessage(conv, d);
      }
    });
  }
  self.displayMessage = function(conv, msg) {
    $("#contentView").append("<div>"+msg.sender+": "+msg.body+"</div>");

  }

  var acctTemplate = _.template('<a href="#" data-rowid="<%=rowid %>" class="<%= unread>0 ? "unread" : "" %> <%= isActive ? "current" : "" %>">'+
  '  <%=getDisplayName() %> <% if (unread>0){ %><span class="label round success"><%=unread %></span><% } %>'+
  '  <small><%= lastmsg %></small>'+
  '</a>');
  self.refreshList = function() {
    console.log("REFRESHING CONVERSATION LIST");
    var $h = $("#conversationList").html("");
    for(var i in conversations) {
      console.log(conversations[i])
      $h.append(acctTemplate(_.extend(
        conversations[i],
        { isActive: activeConversation == conversations[i], lastmsg: "hello world" }
      )));
    }

  }

})();
