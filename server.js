var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);
var mangUser = [];

// socket.adapter.rooms Show tat ca cac rooms dang co
io.on("connection", function (socket) {
    console.log(socket.id);
    console.log(socket.adapter.rooms);

    socket.on("client-send-username", function (data) {
        if (mangUser.indexOf(data) >= 0) {
            socket.emit("server-send-userfail");
        } else {
            mangUser.push(data);
            socket.username = data;
            socket.emit("server-send-loginsuccess", data);
            io.sockets.emit("server-send-arr-user", mangUser);

        }

    });
    socket.on("logout", function () {
        mangUser.splice(
            mangUser.indexOf(socket.username), 1
        );
        socket.broadcast.emit("server-send-arr-user", mangUser);
    });

    socket.on("server-send-message", function (data) {
        io.sockets.emit("server-send-message", { user: socket.username, mes: data });
    });

    socket.on("key-press-text", function () {
        var s = (socket.username + "dang go");
        io.sockets.emit("someone-keypress", s);
    });
    socket.on("stop-key-press-text", function () {
        io.sockets.emit("someone-stop-keypress");
        console.log(socket.username + " ngung dang go");
    });

    socket.on("create-rooms", function (data) {
        socket.join(data);
        socket.phong = data;

        var mang = [];
        for (r in socket.adapter.rooms) {
            mang.push(r);
        }
        io.sockets.emit("send-rooms", mang);
        socket.emit("send-rooms-socket", data);

        socket.on("user-chat", function (data) {
            io.sockets.in(socket.phong).emit("server-chat", data);

        });
    });


});

app.get("/", function (req, res) {
    res.render("trangchu")
});

