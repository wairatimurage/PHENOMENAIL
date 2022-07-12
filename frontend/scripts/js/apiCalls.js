const apiUrl = "";

const bookAppointment = (_salon) => {
  return fetch(apiUrl + "/api/salon/booking").then((_res) => _res.json());
};

const addSalon = (_salon) => {
  return fetch(apiUrl + "/api/salon", {
    method: "POST",
    body: JSON.stringify(_salon),
  }).then((_res) => _res.json());
};

const fetchSalons = () => {
  return fetch(apiUrl + "/api/salon").then((_res) => _res.json());
};

const makePayment = () => {
  return fetch(apiUrl + "/api/payment", {
    method: "POST",
    body: JSON.stringify(),
  }).then((_res) => _res.json());
};

const prepaidDetails = (_id) => {
  return fetch(apiUrl + "/api/payment" + _id).then((_res) => _res.json());
};

// fetch details of payment already made
// {payable: 33, clientDetails: {id, ema}}
const alreadyPaid = () => {
  return fetch(apiUrl + "/api/payment/already-paid", {
    method: "POST",
    body: JSON.stringify(),
  }).then((_res) => _res.json());
};

// get individual salon's bookings
const fetchSalonBookings = (_salonId) => {
  return fetch(apiUrl + "/api/salon/bookings" + _salonId).then((_res) =>
    _res.json()
  );
};

// fetch users bookings
const fetchMyBookings = () => {
  return fetch(apiUrl + "/api/salon/my-bookings").then((_res) => _res.json());
};
