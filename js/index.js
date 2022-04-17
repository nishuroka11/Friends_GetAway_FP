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

    let objectStore3 = db.createObjectStore('flightBooking', { keyPath: 'id', autoIncrement: true });
    objectStore3.createIndex('userId', 'userId', { unique: false });
    objectStore3.createIndex('flightFrom', 'flightFrom', { unique: false });
    objectStore3.createIndex('flightTo', 'flightTo', { unique: false });
    objectStore3.createIndex('flightDate', 'flightDate', { unique: false });
    objectStore3.createIndex('flightPassengers', 'flightPassengers', { unique: false });
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

