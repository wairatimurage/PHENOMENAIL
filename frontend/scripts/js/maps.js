let map;
console.log("maps");
function initMap() {
  console.log("maps init");
  if (google) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -1.393140200164, lng: 36.7534257201 },
      zoom: 13,
    });
    populateMarkers();
  }
}

const populateMarkers = () => {
  // api calls
  fetchSalons()
    .then((_res) => {
      console.log("markers: ", _res);
      _res.map((_salon) => {
        let _item = {
          position: {
            lat: parseFloat(_salon.location.latitude),
            lng: parseFloat(_salon.location.longitude),
          },
          title:
            "Location Place or Anything that you want to tooltip while hovering",
          icon: "/assets/salon-icon.svg",
          label: _salon.name,
        };
        // let marker = new google.maps.Marker(_item);
        let marker = new google.maps.Marker({ ..._item, map: google.maps.Map });

        marker.setMap(map);
        marker.addListener("click", (event) => {
          let targetModal = document.getElementById("booking-form-container");
          targetModal.classList.toggle("hide");
          document.getElementById("booking-salon").value = _salon.name;
          document.getElementById("booking-salon-email").value = _salon.email;
          // targetModal.classList.toggle("fade");
          // console.log(event);
          // console.log("salon: ", _salon);
          // TODO: render dropdown
        });
      });
    })
    .catch(handleResponseErrors);

  // [
  //   {
  //     position: { lat: -1.3912000010785663, lng: 36.767465401580075 },
  //     title:
  //       "Location Place or Anything that you want to tooltip while hovering",
  //     icon: "/assets/salon-icon.svg",
  //     label: "Salon",
  //   },
  //   {
  //     position: { lat: -1.397654424538989, lng: 36.76316167309762 },
  //     title:
  //       "Location Place or Anything that you want to tooltip while hovering",
  //     icon: "/assets/salon-icon.svg",
  //     label: "salon.svg",
  //   },
  // ].map((_item) => {
  //   // let marker = new google.maps.Marker(_item);
  //   let marker = new google.maps.Marker({ ..._item, map: google.maps.Map });
  //   // marker.addListener("click", (event) => {
  //   //   console.log("click: ", event);
  //   //   // TODO: render dropdown
  //   // });
  //   marker.setMap(map);
  //   marker.on("click", (event) => {
  //     console.log(event);
  //     // TODO: render dropdown
  //   });
  // });

};

window.initMap = initMap;
