//! =========================================== this is server code
const express = require('express');
const http = require('http');
const path = require('path');
const Filter = require('bad-words');
const socketio = require('socket.io');
const { generateMessage, generateLocationaMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUserInRooms } = require('./utils/users');
const app = express();
//* express makes that behind the scenes but we did it ourselves to implement socket.io as below
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

//? Wraping up first 5 lessons 
// server (emit) => client (recieve) => countUpdated
// client (emit) => server (recieve) => increment


//THE PARTY QUEST ALL realtime CODE IS WRITTEN HERE
io.on('connection', (socket) => {
   console.log("New web socket Connection");

   socket.on('join', ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) {
         callback(error)
      }

      socket.join(room);

      socket.emit('message', generateMessage('Admin', `Welcome!`));
      socket.broadcast.to(room).emit('message', generateMessage('Admin', `${username} has joined the chat room`));

      io.to(user.room).emit("roomData", {
         room: user.room,
         users: getUserInRooms(user.room)
      });

      callback();
   });


   socket.on('sendMessage', ({ message }, callback) => {
      const user = getUser(socket.id);
      const filter = new Filter();

      if (filter.isProfane(message)) {
         return callback('Profinaty is not allowed')
      }

      io.to(user.room).emit('message', generateMessage(user.username, message));
      callback();
   });

   socket.on('sendLocation', (location, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit('locationMessage', generateLocationaMessage(user.username, `https://google.com/maps?q=${location.lat},${location.long}`));
      callback();
   });


   socket.on('disconnect', () => {

      const user = removeUser(socket.id);
      if (user) {
         io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left !`));
         io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRooms(user.room)
         })
      }

   });




   // socket.emit('countUpdated', count);

   // socket.on('increment', () => {
   //    count++;
   //    //* this is will emit the event for single connection ( user ) ====> socket
   //    // socket.emit('countUpdated', count);
   //    //* this is will emit the event for every single connection ( all users ) ====> io
   //    io.emit('countUpdated', count);
   // })
});

server.listen(port, () => {
   console.log("Listening to PORT 3000");
});

// server (emit) ===> client (reciever) ===> acknowledgement ===> server
// client (emit) ===> server (reciever) ===> acknowledgement ===> client
