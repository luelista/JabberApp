window.App = window.App || {};

(function() {
  var db = openDatabase('chatlogsdb', '1.0', 'chat database', 2 * 1024 * 1024);

  App.SqlError = function(tx, err) {
    console.error("SQL ERROR: "+err.message);
  }

  App.RunSQL = function(sql, para, cb) {
    db.transaction(function (tx) {
      tx.executeSql(sql, para,cb,App.SqlError);
    });
  }
  App.deleteAllTables=function() {
    App.RunSQL("DROP TABLE conversation");
    App.RunSQL("DROP TABLE message");
    App.RunSQL("DROP TABLE roommates");
    App.RunSQL("DROP TABLE params");

  }

  db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS conversation (roomjid, subject, conversationtype, lastmessagedt TEXT, \
                   do_join INT DEFAULT 0, display_name TEXT DEFAULT '', lastseendt TEXT DEFAULT '', \
                   notify INT DEFAULT 0, display_position INT, account_id INT, password TEXT DEFAULT '');    ");

    tx.executeSql("CREATE TABLE IF NOT EXISTS message (id unique, conv INTEGER, xmppid TEXT, sender TEXT, \
                   messagebody TEXT, datedt TEXT, jid TEXT, editdt TEXT, override TEXT);   ");

    tx.executeSql("CREATE TABLE IF NOT EXISTS loginaccounts (jid TEXT UNIQUE, password TEXT, server TEXT, port INTEGER, enable TEXT);   ");

    tx.executeSql("CREATE TABLE IF NOT EXISTS roommates (room TEXT, nickname TEXT, lastseendt INTEGER, \
                   onlinestate TEXT, affiliation TEXT, role TEXT, status_str TEXT, user_jid TEXT, \
                   CONSTRAINT mate_unique UNIQUE (room,nickname) ON CONFLICT FAIL ); ");

    tx.executeSql("CREATE TABLE IF NOT EXISTS params (item TEXT, value TEXT, CONSTRAINT para_unique UNIQUE (item) ON CONFLICT REPLACE); ");
  });

  App.DatabaseRef = db;
})();
