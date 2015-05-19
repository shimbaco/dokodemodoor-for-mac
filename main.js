var app = require("app");
var shell = require("shell");
var Menu = require("menu");
var Tray = require("tray");
var client = require("socket.io-client");
var request = require("request");

var tray = null;

app.on("ready", function() {
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray("./images/opened.jpg");

  var contextMenu = Menu.buildFromTemplate([
    { label: "Open Heavensdoor Web", type: "normal", click: openHeavensdoor },
    { label: "Quit", type: "normal", click: app.quit }
  ]);

  tray.setToolTip("Dokodemodoor for Mac");
  tray.setContextMenu(contextMenu);

  var socket = client("http://ficc-heavensdoor.herokuapp.com");
  socket.on("update", function(flag) {
    changeIcon(flag);
  });

  request("http://ficc-heavensdoor.herokuapp.com/params", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      changeIcon(JSON.parse(body).value);
    }
  });
});

function changeIcon(flag) {
  var isOpened = (flag === 1);

  if (isOpened) {
    tray.setImage("./images/opened.jpg");
  } else {
    tray.setImage("./images/closed.jpg");
  }
}

function openHeavensdoor() {
  shell.openExternal("http://ficc-heavensdoor.herokuapp.com");
}
