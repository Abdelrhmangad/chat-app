const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
   // clean the data
   username = username.trim().toLowerCase();
   room = room.trim().toLowerCase();

   // validate the data
   if (!username || !room) {
      return {
         error: "Username and room are required!"
      }
   };

   // Check for existence
   const existingUser = users.find((user) => {
      return user.room === room && user.username === username
   });

   //Validate Username
   if (existingUser) {
      return {
         error: "username is in use!"
      };
   }

   //Store user 
   const user = { id, username, room };
   users.push(user);
   return { user }
};

const removeUser = (id) => {
   const index = users.findIndex((user) => {
      return user.id === id
   });

   if (index !== -1) {
      // we remove the item we got back in array and then extract the individual item 
      return users.splice(index, 1)[0];
   }
};

const getUser = (id) => {
   // const index = users.findIndex((user) => {
   //    return user.id === id
   // });

   // if (index !== -1) {
   //    // return users.splice(index, 1)[0];
   //    return users[index];
   // }

   // return "User is not defined"

   return users.find((user) => user.id === id);
};

const getUserInRooms = (room) => {
   room = room.trim().toLowerCase();
   return users.filter((user) => user.room === room);
}


addUser({
   id: 22,
   username: 'Gad',
   room: "Gad"
});

addUser({
   id: 24,
   username: 'Gad4',
   room: "help"
});

addUser({
   id: 23,
   username: 'Gad3',
   room: "Gad"
});

// console.log(users);
const userWanted = getUser(23);
// console.log(userWanted);

const removedUser = removeUser(22);

const userList = getUserInRooms('asd');
console.log(userList);
// console.log(removedUser);



module.exports = {
   addUser,
   removeUser,
   getUser,
   getUserInRooms
}
