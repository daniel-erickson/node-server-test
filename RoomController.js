/**
 * Created with IntelliJ IDEA.
 * User: Dan
 * Date: 9/01/2014
 * Time: 10:51 AM
 * To change this template use File | Settings | File Templates.
 */

var rooms = [{"name":"lobby","users":[]}];


function doesRoomExist(room){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == room)
        {
            return true;
        }
    }
    return false;
}

function isRoomOpen(room){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == room)
        {
            return (rooms[i].open)
        }
    }
    return false;
}

function addRoom(room,roomData){
    rooms.push({"name":room,"users":[],"open":true,"data":roomData});
    console.log("Creating a room: " + room);
}

function joinRoom(room,user)
{
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == room)
        {
           rooms[i].users.push(user);
            console.log("User: " + user.name + " joined room: " + room);
           return true;
        }
    }
    return false;
}



function removeRoom(room){
    if(room=="lobby")
    {
        return;
    }
    var index = -1;
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == room)
        {
            index = i;
            break;
        }
    }
    if(index!=-1)
    {
        rooms.splice(index,1);
    }
}

function removeUserFromRoom(user,roomName){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == roomName)
        {
            deleteUser(rooms[i].users,user);
            if(rooms[i].users.length == 0)
            {
                removeRoom(roomName);
            }
            return;
        }
    }
}

function deleteUser(userAr,user){
    var index = -1;
    for (var i = 0; i < userAr.length; i++) {
        if(userAr[i] == user)
        {
            index = i;
            break;
        }
    }
    if(index!=-1)
    {
        userAr.splice(index,1);
    }
}

exports.retrieveRoomList = function(){
    return rooms;
};

exports.joinRoom = function(roomName,user){
    if(doesRoomExist(roomName))
    {
        if(isRoomOpen(roomName))
        {
            return joinRoom(roomName,user);
        }
    }
    return false;
}

exports.hostRoom = function(roomName,user,roomData){
    if(doesRoomExist(roomName))
    {
        return false;
    }
    addRoom(roomName,roomData);
    return joinRoom(roomName,user);
}

exports.leaveRoom = function(roomName,user){
    console.log("leaving room: " + roomName + " | " + user);
    removeUserFromRoom(user,roomName);
}

exports.roomData = function(roomName){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == roomName)
        {
            console.log("About to return ",rooms[i].data);
            return rooms[i].data;
        }
    }
}

exports.userList = function(roomName){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == roomName)
        {
            console.log("Returning user list of: " + rooms[i].users);
            return rooms[i].users;
        }
    }
}

exports.lockRoom = function(room){
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i].name == room)
        {
            rooms[i].open = false;
        }
    }
}