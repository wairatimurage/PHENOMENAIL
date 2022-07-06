let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.393140200164, lng: 36.7534257201 },
    zoom: 13,
  });
}

[
  {
    position: { lat: -1.3912000010785663, lng: 36.767465401580075 },
    title: "Location Place or Anything that you want to tooltip while hovering",
  },
  {
    position: { lat: -1.3915217712561387, lng: 36.766510535176096 },
    title: "Location Place or Anything that you want to tooltip while hovering",
  },
].map((_item) => {
  let marker = new google.maps.Marker(_item);

  marker.setMap(map);
  marker.on("click", (event) => {
    console.log(event);
  });
});

window.initMap = initMap;
