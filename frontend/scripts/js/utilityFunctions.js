const availableTime = (date, appointments) => {
  const _date = new Date(date);
};

const toggleModal = (event) => {
  event.preventDefault();
  let modalContainer = document.querySelectorAll(".modal");
  let targetModalId = event.target.getAttribute("data-target");
  let targetModal = document.querySelector(targetModalId);
  targetModal.classList.toggle("hide");
  modalContainer.forEach((_modal) => _modal.classList.toggle("fade"));
};

const verifyBooking = (_booking) => {
  if (_booking.client) {
    if (!_booking.client.fullname) return alert("Enter fullname");
    if (!_booking.client.email) return alert("Enter email");
    if (_booking.appointment) {
      if (!_booking.appointment.date && _booking.appointment.date === "")
        return alert("Enter Date");
      if (!_booking.appointment.pricing) return alert("Enter Pricing");
      if (!_booking.appointment.service) return alert("Enter Service");
      if (!_booking.appointment.time && _booking.appointment.time === "")
        return alert("Enter Time");
    }
    return true;
  }
  alert("Client details missing. Please try again");
};

const handleResponseErrors = (_err) => {
  console.log(_err);
};

const pricing = {
  pedicure: 1000,
  manicure: 500,
  massage: 3000,
  naildo: 2000,
  stickons: 2000,
  eyebrows: 200,
};

const sampleAppointments = [
  {
    salon: { name: "Nico" },
    client: {
      fullname: "Oliver Nico",
      email: "olivermirimu@gmail.com",
    },
    appointment: {
      date: new Date(),
      time: new Date(),
      service: "pedicure",
      pricing: 1000,
      paymentMethod: "mpesa",
    },
    time: new Date(),
  },
  {
    salon: { name: "Nico" },
    client: {
      fullname: "Oliver Nico",
      email: "olivermirimu@gmail.com",
    },
    appointment: {
      date: new Date(),
      time: new Date(),
      service: "pedicure",
      pricing: 1000,
      paymentMethod: "card",
    },
    time: new Date(),
  },
];

// menu func
var MenuItems = document.getElementById("MenuItems");

MenuItems.style.maxHeight = "0px";

function menutoggle() {
  if (MenuItems.style.maxHeight == "0px") {
    MenuItems.style.maxHeight = "200px";
  } else {
    MenuItems.style.maxHeight = "0px";
  }
}

const checkAuth = () => {
  return fetch("/auth/current-user")
    .then((_res) => {
      console.log("current: ", _res);
    })
    .catch((_err) => {
      console.log("current error: ", _err);
    });
};
