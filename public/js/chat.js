//! ============================================ this is the client side
const socket = io();

//* MUST match with the name you choose in the index.js
// socket.on('countUpdated', (count) => {
//    console.log("The new Count Is ", count);
//    document.querySelector('#par').textContent = count;
// });

// document.querySelector('#increment').addEventListener('click', () => {
//    console.log("CLicked");
//    socket.emit('increment');
// }); 

const $messageForm = document.querySelector("#form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector('#messages');
const $location = document.querySelector('#location')
//* Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//* Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
   // New message element
   const $newMessage = $messages.lastElementChild
   // Height of the new message
   const newMessageStyles = getComputedStyle($newMessage)
   const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
   // Visible height
   const visibleHeight = $messages.offsetHeight
   // Height of messages container
   const containerHeight = $messages.scrollHeight
   // How far have I scrolled?
   const scrollOffset = $messages.scrollTop + visibleHeight
   if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight
   }

   console.log(containerHeight)
   console.log($newMessage)
   console.log(newMessageMargin)
   console.log($messages.scrollTop)
   console.log($messages.scrollTop)
   console.log($messages.scrollHeight)

}

// socket.emit("sendMessage", input.nodeValue())

socket.on('roomData', ({ room, users }) => {
   console.log(room);
   console.log(users);
});

socket.on('roomData', ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, {
      room,
      users
   });

   document.querySelector('#sidebar').innerHTML = html;
});

socket.on('message', (message) => {
   console.log(message);
   const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
   });
   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});

socket.on('locationMessage', (locationMsg) => {
   console.log(locationMsg.url);
   const html = Mustache.render(locationTemplate, {
      username: locationMsg.username,
      location: locationMsg.url,
      createdAt: moment(locationMsg.createdAt).format("h:mm a")
   });
   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});


$messageForm.addEventListener('submit', (e) => {
   e.preventDefault();

   $messageFormButton.setAttribute('disabled', 'disabled');

   // const message = document.querySelector('input').value;
   //* instead we can do so 
   const message = e.target.elements.message.value;
   socket.emit('sendMessage', { username, message }, (error) => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = '';
      $messageFormInput.focus();

      if (error) {
         return console.error(error)
      }

      console.log("Message Deliverd!");
   });
});



const $sendLocationButton = document.querySelector('#send-location');
$sendLocationButton.addEventListener('click', () => {

   if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser");
   };

   $sendLocationButton.setAttribute("disabled", "disabled");

   navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position)
      socket.emit('sendLocation', {
         lat: position.coords.latitude,
         long: position.coords.longitude
      }, () => {
         // Acknoledge message
         console.log("Location Shared!");
         $sendLocationButton.removeAttribute('disabled');
      });
   });

});


socket.emit('join', { username, room }, (error) => {
   if (error) {
      alert(error);
      location.href = '/';
   };
});