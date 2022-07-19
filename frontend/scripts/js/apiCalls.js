const apiUrl = "";

const appendHeaders = () => {
  const token =
    window.localStorage.getItem("tkn") ||
    window.localStorage.getItem("authtkn");
  const headers = { "Content-Type": "application/json", Authorization: token };
  return headers;
};

const bookAppointment = (_salon) => {
  return fetch(apiUrl + "/api/salon/booking", {
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
  return fetch(apiUrl + "/api/payment", {
    method: "POST",
    body: JSON.stringify(_booking),
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

const prepaidDetails = (_id) => {
  return fetch(apiUrl + "/api/payment" + _id, {
    headers: appendHeaders(),
  }).then((_res) => _res.json());
};

console.log("some");
// fetch details of payment already made
// {payable: 33, clientDetails: {id, ema}}
const alreadyPaid = () => {
  return fetch(apiUrl + "/api/payment/already-paid", {
    method: "POST",
    body: JSON.stringify(),
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
  return fetch(`/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_user),
  }).then((_response) => {
    return _response.json();
  });
};
