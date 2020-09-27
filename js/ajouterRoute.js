var map;
var geocoder;
var marker;
var geolocation;
var res;
let poly;
var path;
let pathCoord = [];

function initMap() {
    let mapDiv = document.getElementById('map');
    if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
            center: 
                {lat: 48.8907605, lng: 2.2439413},
                zoom: 14,
                labels: false
            }
        );
    }

    poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    poly.setMap(map);
    
    // Add a listener for the click event
    map.addListener('click', addLatLng);
}

function sendPath(){
    for (let index = 0; index < path.i.length; index++) {
        let tmpPath = path.i[index].toString();
        let formatted = tmpPath.replace(/\(/g, "").replace(/\)/g, "").split(",");
        let formattedObj = {
            lat: parseFloat(formatted[0]),
            lng: parseFloat(formatted[1])
        }
        pathCoord.push(formattedObj);
    }

    var nom = document.getElementById('nom').value;
    var zone = document.getElementById('zone').value;
    var color = document.getElementById('couleur').value;
    var etatArray = document.getElementsByName('etat');
    var etat;

    for (let i = 0; i < etatArray.length; i++) {
        if (etatArray[i].checked) {
            etat = etatArray[i].value;
        }
    }

    console.log(nom,zone,etat,pathCoord);

    
    if(pathCoord.length > 1){
        db.collection("paths").add({
            nom: nom,
            zone: zone,
            etat: etat,
            coordonnees: pathCoord,
            couleur: color,
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            alert("Ascenseur ajouté correctement.");
            window.open("index.html", "_self");
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }


}



// PATHS

// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
    path = poly.getPath();
    
    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);

    // // Add a new marker at the new plotted point on the polyline.
    // var marker = new google.maps.Marker({
    //     position: event.latLng,
    //     title: '#' + path.getLength(),
    //     map: map
    // });

}