(function() {
  
  var self = App.ConversationController = {};
  
  
  
  self.init = function() {
    $("#drop_addConversation .f-ok-btn").click(function() {
      var $jid=$("#drop_addConversation .f-jid");
      var jid = $jid.val();
      
      var conv = new App.Conversation()
      
      
    });
    
    
  }
  
})();
