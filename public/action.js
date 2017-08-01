var socket = io("https://chat-free.herokuapp.com/");
socket.on("server-send-userfail", function () {
    alert("Da co ng dang ki");
});
socket.on("server-send-arr-user", function (data) {
    $('#boxContent').html("");
    data.forEach(function (element) {
        $('#boxContent').append("<div class='useronline'>" + element + "</div>")
    });
});


socket.on("server-send-loginsuccess", function (data) {
    $('#currentUser').html(data);
    $('#loginForms').hide(1000);
    $('#chatForms').show(1000);
});

socket.on("server-send-message", function (data) {
    $('#listMessage').append("<div class='alert alert-success'>" + data.user + ":" + data.mes + "</div>");
});

socket.on("someone-keypress", function (data) {
    $('#notification').html(data);
});

socket.on("someone-stop-keypress", function (data) {
    $('#notification').html("");
});

socket.on("send-rooms", function (data) {
    $('#listRooms').html("");
    data.map(function (r) {
        $('#listRooms').append("<div>" + r + "</div>")
    });
});

socket.on("send-rooms-socket", function (data) {
    $('#roomnow').val(data);
});

socket.on("server-chat", function (data) {
    $('#txtareaMes').append(data);
});



$(document).ready(function () {
    $('#loginForms').show();
    $('#chatForms').hide();

    $('#btnRegister').click(function () {
        socket.emit("client-send-username", $('#txtUserName').val());
    });

    $('#btnLogout').click(function () {
        socket.emit("logout");
        $('#loginForms').show(2000);
        $('#chatForms').hide(1000);
    });

    $('#btnSendMessage').click(function () {
        socket.emit("server-send-message", $('#txtMessage').val());

    });

    $('#txtMessage').focusin(function () {
        socket.emit("key-press-text");
    });
    $('#txtMessage').focusout(function () {
        socket.emit("stop-key-press-text");
    });

    $('#btnCreateRooms').click(function () {
        socket.emit("create-rooms", $('#txtRooms').val());
    });

    $('#btnChat').click(function () {
        socket.emit("user-chat", $('#txtMess').val());
    });


});