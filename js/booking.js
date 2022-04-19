// Constants
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const hotelNameInput = document.querySelector('#hotel-name');
const cityInput = document.querySelector('#city-name');
const arriveInput = document.querySelector('#arrive');
const departInput = document.querySelector('#depart');

// Constants
const userName = document.querySelector('#userName');
const logoutBtn = document.querySelector('#logout');

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function () {
  // -------------------- For DB --------------------
  // Open our database; it is created if it doesn't already exist
  let request = window.indexedDB.open('getAwayDB', 1);

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function () {
    console.log('Database failed to open');
  };

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function () {
    console.log('Database opened succesfully');
    checkLogin()

    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;

  };

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function (e) {

    // Grab a reference to the opened database
    let db = e.target.result;

    let objectStore = db.createObjectStore('users', { keyPath: 'userId', autoIncrement: true });


    objectStore.createIndex('password', 'password', { unique: false });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: false });

    let objectStore3 = db.createObjectStore('packageBooking', { keyPath: 'id', autoIncrement: true });
    objectStore3.createIndex('userId', 'userId', { unique: false });
    objectStore3.createIndex('name', 'name', { unique: false });
    objectStore3.createIndex('email', 'email', { unique: false });
    objectStore3.createIndex('hotelName', 'hotelName', { unique: false });
    objectStore3.createIndex('city', 'city', { unique: false });
    objectStore3.createIndex('arrive', 'arrive', { unique: false });
    objectStore3.createIndex('depart', 'depart', { unique: false });
    //
    let objectStore4 = db.createObjectStore('hotelBooking', { keyPath: 'id', autoIncrement: true });
    objectStore4.createIndex('userId', 'userId', { unique: false });
    objectStore4.createIndex('hotelFrom', 'hotelFrom', { unique: false });
    objectStore4.createIndex('hotelTo', 'hotelTo', { unique: false });
    objectStore4.createIndex('hotelName', 'hotelName', { unique: false });
    objectStore4.createIndex('cityName', 'cityName', { unique: false });
    //
    console.log('Database setup complete');
    //  alert("setup done");
    checkLogin()
  };
  // -------------------- For DB END --------------------

  function checkLogin() {
    let user = localStorage.getItem('user');
    user = user ? user : sessionStorage.getItem('user');

    const isLoggedIn = user ? true : false;

    if (isLoggedIn) {
      document.querySelector('#userName').innerHTML = JSON.parse(user).name;
      document.querySelector("#login-block").style.display = 'none'
      document.querySelector("#loggedIn-block").style.display = 'block'
    } else {
      document.querySelector("#login-block").style.display = 'block'
      document.querySelector("#loggedIn-block").style.display = 'none'
    }
  }

  logoutBtn.addEventListener('click', event => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    alert("Logout successfull.")
    checkLogin()
  });


};

function toggleNav() {
  var x = document.getElementById("topNav");
  if (x.className === "nav-wrapper") {
    x.className += " responsive";
  } else {
    x.className = "nav-wrapper";
  }
}


// FOR MODAL
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  const oldPassword = document.querySelector('#password');
  const newPassword = document.querySelector('#newPassword');
  const repeatPassword = document.querySelector('#repeatPassword');
  newPassword.value = ""
  oldPassword.value = ""
  repeatPassword.value = ""

  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    const oldPassword = document.querySelector('#password');
    const newPassword = document.querySelector('#newPassword');
    const repeatPassword = document.querySelector('#repeatPassword');
    newPassword.value = ""
    oldPassword.value = ""
    repeatPassword.value = ""

    modal.style.display = "none";
  }
}

var changePassBtn = document.getElementById("changePassBtn");
var cancelChangePassBtn = document.getElementById("cancelChangePassBtn");
changePassBtn.onclick = function () {
  const oldPassword = document.querySelector('#password');
  const newPassword = document.querySelector('#newPassword');
  const repeatPassword = document.querySelector('#repeatPassword');

  let currentUser = localStorage.getItem('user');
  currentUser = currentUser ? currentUser : sessionStorage.getItem('user');
  currentUser = JSON.parse(currentUser);

  if (currentUser.password == oldPassword.value) {
    if (newPassword.value == repeatPassword.value) {
      currentUser.password = newPassword.value;
      let transaction = db.transaction(['users'], 'readwrite');
      let objectStore = transaction.objectStore('users');
      var request = objectStore.put(currentUser);

      request.onsuccess = function () {
        alert("Password changes successfully");
        localStorage.setItem("user", JSON.stringify(currentUser))
        sessionStorage.setItem("user", JSON.stringify(currentUser))
        newPassword.value = ""
        oldPassword.value = ""
        repeatPassword.value = ""

        modal.style.display = "none";

      };

    } else {
      alert("Repeat password doesn't match")
      modal.style.display = "block";
    }
  } else {
    alert("Old password doesn't match.")
    modal.style.display = "block";
  }

}

cancelChangePassBtn.onclick = function () {
  const oldPassword = document.querySelector('#password');
  const newPassword = document.querySelector('#newPassword');
  const repeatPassword = document.querySelector('#repeatPassword');
  newPassword.value = ""
  oldPassword.value = ""
  repeatPassword.value = ""

  modal.style.display = "none";
}


var bookingBtn = document.getElementById("submitBooking");

bookingBtn.onclick = function () {
  let user = localStorage.getItem('user')
  user = JSON.parse(user);

  let newBooking = {
    name: nameInput.value,
    email: emailInput.value,
    hotelName: hotelNameInput.value,
    city: cityInput.value,
    arrive: arriveInput.value,
    depart: departInput.value,
    userId: user.userId
  };

  let transaction = db.transaction(['packageBooking'], 'readwrite');

  let objectStore = transaction.objectStore('packageBooking');
  var request = objectStore.add(newBooking);

  request.onsuccess = function () {
    alert("Package booked successfully");

    window.location.href = "packages.html";

  };
}


  // function bookPackage(e) {
  //   console.log("herllo")
  // }