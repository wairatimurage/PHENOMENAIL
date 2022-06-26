let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -0.17333, lng: 35.86382 },
    zoom: 12,
  });
}

[
  {
    position: { lat: -0.17333, lng: 35.86382 },
    title: "Location Place or Anything that you want to tooltip while hovering",
  },
  {
    position: { lat: -0.17333, lng: 35.86382 },
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
