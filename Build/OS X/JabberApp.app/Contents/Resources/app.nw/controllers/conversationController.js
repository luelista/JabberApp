(function() {
  
  var self = App.ConversationController = {};
  
  
  
  self.init = function() {
    $("#accountList_addAccount").click(function() {
      self.addAccountWithPopup();
    });
    
    
  }
  
})();
