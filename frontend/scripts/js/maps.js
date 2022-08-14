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
        var markerIcon = {
          url: "/assets/salon-pin.svg",
          size: new google.maps.Size(60, 60),
          scaledSize: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(32, 65),
          labelOrigin: new google.maps.Point(15, 30),
        };

        let _item = {
          position: {
            lat: parseFloat(_salon.location.latitude),
            lng: parseFloat(_salon.location.longitude),
          },
          title: "Salon Location",
          // icon: "/assets/salon-pin.svg",
          icon: markerIcon,
          label: {
            text: _salon.name,
            // color: "#b3689b",
            color: "#0e1a25",
            fontWeight: "600",
            fontSize: "16px",
          },
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
  //     icon: "/assets/salon-pin.svg",
  //     label: "Salon",
  //   },
  //   {
  //     position: { lat: -1.397654424538989, lng: 36.76316167309762 },
  //     title:
  //       "Location Place or Anything that you want to tooltip while hovering",
  //     icon: "/assets/salon-pin.svg",
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
