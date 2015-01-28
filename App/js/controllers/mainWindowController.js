window.App = window.App || {};

(function() {
  var nw = require('nw.gui');

  App.MainWindow = {};

  function makeDropdownMenu(title) {
    var m = new nw.MenuItem({ label: title });
    m.submenu = new nw.Menu();
    return m;
  }

  function initMainMenu() {
    var win = nw.Window.get();
    var nativeMenuBar = new nw.Menu({ type: "menubar" });

    var appMenu, aIndex, accountMenu, windowMenu, wIndex;
    var mod;

    if (process.platform === "darwin") {
      mod = "cmd";
      nativeMenuBar.createMacBuiltin("JabberApp");
      appMenu = nativeMenuBar.items[0].submenu; aIndex=2;
      windowMenu = nativeMenuBar.items[2].submenu; wIndex=3;
      nativeMenuBar.insert(makeDropdownMenu("Account"), 1);
      accountMenu = nativeMenuBar.items[1].submenu;

      windowMenu.insert(new nw.MenuItem({ type: "separator" }), wIndex++);
    } else {
      mod = "alt";

      nativeMenuBar.append(makeDropdownMenu("Account"));
      nativeMenuBar.append(makeDropdownMenu("Edit"));
      nativeMenuBar.append(makeDropdownMenu("Tools"));
      nativeMenuBar.append(makeDropdownMenu("Window"));
      accountMenu = nativeMenuBar.items[0].submenu;
      appMenu = nativeMenuBar.items[2].submenu; aIndex=0;
      windowMenu = nativeMenuBar.items[3].submenu; wIndex=0;
    }


    appMenu.insert(new nw.MenuItem({
      label: "Preferences", modifiers: mod, key: ",",
      click: function() {
        App.MainWindow.showPreferences();
      }
    }), aIndex++);
    appMenu.insert(new nw.MenuItem({ type: "separator" }), aIndex++);


    accountMenu.append(new nw.MenuItem({
      label: "Add new account ...", modifiers: mod+"-shift", key: "n",
      click: function() {
        App.AccountController.addAccountWithPopup();
      }
    }));
    accountMenu.append(new nw.MenuItem({
      label: "Quit", modifiers: mod+"", key: "q",
      click: function() {
        win.close();
      }
    }));


    windowMenu.insert(new nw.MenuItem({
      label: "Inspector", modifiers: mod, key: "k",
      click: function() {
        nw.Window.get().showDevTools();
      }
    }), wIndex++);


    win.menu = nativeMenuBar;

  }

  function initHotkeys() {
    $(document).on("keyup", function(e) {
      var modKey = (process.platform === "darwin" ? e.metaKey : e.ctrlKey);

      console.log("keyCode: "+e.keyCode);
      if (modKey && e.keyCode == 73) { // ctrl-I
        nw.Window.get().showDevTools();
      }
      if (modKey && e.keyCode == 81) { // ctrl-Q
        nw.Window.get().close();
      }
      if (modKey && e.keyCode == 188) { // ctrl-,
        App.MainWindow.showPreferences();
      }
    });
  }

  App.MainWindow.showPreferences = function() {
    $("#modal_preferences").foundation("reveal", "open");
  };

  App.MainWindow.initApp = function() {
    initMainMenu();
    initHotkeys();

    App.AccountController.init();
    App.AccountController.loadAccountData();

    App.ConversationController.init();

    nw.Window.get().setBadgeLabel(7);
  }
})();
