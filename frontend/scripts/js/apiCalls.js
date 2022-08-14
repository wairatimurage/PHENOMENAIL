const apiUrl = "";

const appendHeaders = () => {
  const token =
    window.localStorage.getItem("tkn") ||
    window.localStorage.getItem("authtkn");
  const headers = { "Content-Type": "application/json", Authorization: token };
  return headers;
};

const bookAppointment = (_appointment) => {
  return fetch(apiUrl + "/api/salon/booking", {
    headers: appendHeaders(),
    method: "POST",
    body: JSON.stringify(_appointment),
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

const addSalon = (_salon) => {
  return fetch(apiUrl + "/api/salon", {
    method: "POST",
    body: JSON.stringify(_salon),
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

const fetchSalons = () => {
  return fetch(apiUrl + "/api/salon", { headers: appendHeaders() }).then(
    (_res) => _res.json()
  );
};

const makePayment = (_booking) => {
  console.log("sss: ", _booking);
  return fetch(apiUrl + "/api/payment", {
    method: "POST",
    body: JSON.stringify(_booking),
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

const prepaidDetails = (_id, _data) => {
  return fetch(apiUrl + "/api/payment/" + _id, {
    method: "POST",
    // credentials: "include",
    headers: appendHeaders(),
    body: JSON.stringify(_data),
  }).then((_res) => _res.json());
};

// fetch details of payment already made
// {payable: 33, clientDetails: {id, ema}}
const alreadyPaid = (_booking) => {
  return fetch(apiUrl + "/api/payment/already-paid", {
    method: "POST",
    body: JSON.stringify(_booking),
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

// get individual salon's bookings
const fetchSalonBookings = (_salonId) => {
  return fetch(apiUrl + "/api/salon/bookings" + _salonId, {
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

// fetch users bookings
const fetchMyBookings = () => {
  return fetch(apiUrl + "/api/salon/my-bookings", {
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

const registerAccount = (_user) => {
  return fetch(`/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_user),
  })
    .then((_response) => {
      console.log("json: ", _response);
      if (_response.redirected) {
        window.location.href = _response.url;
      }
      // return _response.json();
    })
    .catch((_err) => {
      console.log("err: ", _err);
      alert("Sorry! An error occured, please try again.");
    });
};

const userLogin = (_user) => {
  console.log("ss: ", _user);
  return fetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_user),
  })
    .then((_response) => {
      console.log("json: ", _response);
      if (_response.redirected) {
        window.location.href = _response.url;
      }
      // return _response.json();
    })
    .catch((_err) => {
      console.log("err: ", _err);
      alert("Sorry! An error occured, please try again.");
    });
};
