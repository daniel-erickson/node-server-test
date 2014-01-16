/**
 * Created with IntelliJ IDEA.
 * User: Dan
 * Date: 9/01/2014
 * Time: 10:36 AM
 * To change this template use File | Settings | File Templates.
 */

var users = [];

function createUser(name,socketId){
    console.log("creating user with name: " + name + " socketId " + socketId);
    users.push({"name":name,"socketId":socketId});
}

function doesUserExist(name){
    console.log(users.length);
    for (var i = 0; i < users.length; i++) {
        if(users[i].name == name)
        {
            return true;
        }
    }
    return false;
}

exports.registerUser = function(name, socketId){
    var username = name;
    var response = {};

    if(doesUserExist(username))
    {
        response.name = 'user_connected_failed';
        response.body = {"errorCode":1};
    }
    else{
        response.name = 'user_connected_success';
        response.body = {};
        createUser(username,socketId);
    }
    return response;
}

exports.removeUserByName = function(name){
    var index = -1;
    for (var i = 0; i < users.length; i++) {
        if(users[i].name == name)
        {
            index = i;
            break;
        }
    }
    if(index!=-1)
    {
        users.splice(index,1);
    }
}

exports.removeUserBySocket = function(socketId){
    var index = -1;
    for (var i = 0; i < users.length; i++) {
        if(users[i].socketId == socketId)
        {
            index = i;
            break;
        }
    }
    if(index!=-1)
    {
        users.splice(index,1);
    }
}


exports.getUserBySocket = function(socketId){
    for (var i = 0; i < users.length; i++) {
        if(users[i].socketId == socketId)
        {
            return(users[i]);
        }
    }
    return null;
}