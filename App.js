var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server,{
        'flash policy port': -1
    });




    io.set('transports', ['websocket', 'flashsocket', 'htmlfile']);
    io.set('log level', 1);

//var pf = require('policyfile').createServer()



server.listen(process.env.PORT || 8080);

console.log("lpMultiServer listening on port " + process.env.PORT);



app.use(express.static(__dirname + '/public'));




var userController = require('./UserController');

var roomController = require('./RoomController');




var net = require("net");

var flashPolicyServer = net.createServer(function (stream) {
    stream.setTimeout(0);
    stream.setEncoding("utf8");
    // console.log(stream);
    stream.addListener("connect", function () {
    });

    stream.addListener("data", function (data) {
        if ( data.indexOf('<policy-file-request/>') != -1){
            stream.write('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
        }
        stream.end();
    });

    stream.addListener("end", function() {
        stream.end();
    });
});

flashPolicyServer.listen(843);




io.sockets.on('connection',function(socket) {

    // This is received when a user attempts to register
    // The user is already connected at this point but has no credentials registered against them
    socket.on('user_connected', function(body){
        var response = userController.registerUser(body,socket.id);
        socket.emit(response.name,response.body);
    });

    // This allows the client to receive a list of channels;
    socket.on('retrieve_room_list', function(body)
    {
        socket.emit("retrieve_room_list_success", roomController.retrieveRoomList());
    });

    // This will register the user in a channel.
    socket.on('room_join', function(roomName){

        var user = userController.getUserBySocket(socket.id);
        if(user==null)
        {
            socket.emit("authentication_error");
            return;
        }
        if(roomController.joinRoom(roomName,user)){
            socket.room = roomName;
            socket.join(socket.room)
            socket.emit("room_join_success",roomController.roomData(roomName));
            io.sockets.in(socket.room).emit('room_user_list_updated', roomController.userList(socket.room));
            return;
        };
        socket.emit("room_join_failure")


    });

    // This will create a channel and register the user in it
    socket.on('room_host', function(roomName,roomData){
        var user = userController.getUserBySocket(socket.id);
        if(user==null)
        {
            socket.emit("authentication_error");
            return;
        }
        if(roomController.hostRoom(roomName,user,roomData)){
            socket.room = roomName;
            socket.join(socket.room)
            socket.emit("room_host_success");
            return;
        };
        socket.emit("room_host_failure")
    });

    // This will de-register a user from a channel. If the channel is empty destroy it.
    socket.on('room_leave', function(roomName){
        var user = userController.getUserBySocket(socket.id);
        roomController.leaveRoom(roomName,user);
        io.sockets.in(socket.room).emit('room_user_list_updated', roomController.userList(socket.room));
        socket.leave(socket.room);
        socket.room = "";
    });


    // when a user sends an update event
    // Will be dispatched to all users in the same channel as them.
    socket.on('game_update', function (data) {
        console.log("game_update" + data);
        io.sockets.in(socket.room).emit('client_game_update', userController.getUserBySocket(socket.id).name,data);
    });

    // when the user disconnects
    // We meed to ensure the user is removed from any channels and is de-registered
    socket.on('disconnect', function(){
        var user = userController.getUserBySocket(socket.id);
        roomController.leaveRoom(socket.room,user);
        io.sockets.in(socket.room).emit('room_user_list_updated', roomController.userList(socket.room));
        socket.leave(socket.room);
        socket.room = "";
        userController.removeUserBySocket(socket.id);
    });

    socket.on("start_preload",function(){

        roomController.lockRoom(socket.room);
        console.log("Staring a game");
        io.sockets.in(socket.room).emit('client_start_preload', roomController.userList(socket.room));

    })

    socket.on("preload_complete", function(){
        var user = userController.getUserBySocket(socket.id);
        io.sockets.in(socket.room).emit('game_update', roomController.userList(socket.room));
    })



});

 /**

var http = require('http')
    , fspfs = require('./work.js');

var flash = fspfs.createServer();
flash.listen();
 **/