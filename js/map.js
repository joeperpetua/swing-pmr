let data = [];
let dataRoutes = [];
let windows = [];
let markers = [];
let map;
let dataLength = 0;
let dataRoutesLength = 0;
let poly;

initMap = (asc, iti) => {
    map = new google.maps.Map(document.getElementById('map'), {
    center: 
        {lat: 48.8907605, lng: 2.2439413},
        zoom: 14
    });
    //console.log(asc, iti);

    if (asc || asc == undefined) {
        addMarkers(map);
    }

    if (iti || iti == undefined) {
        addRoutes(map);
    }
    
}

window.onload = function(){

};

function addMarkers(refMap){
    for (let i = 0; i < markers.length; i++) {
        markers.pop(i)
    }

    db.collection("locations").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data.push(doc.data());
            windows.push(null);
            dataLength++;
            //console.log(doc.data());
        });
    }).then(function(){
        createMarkers(refMap);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    //console.log(data);
}


function createMarkers(refMap){
    //console.log(refMap);
    
    for (let i = 0; i < data.length; i++) {

        let LatLang = data[i].coordonnees.split(','); 
        //console.log(LatLang);
        var marker = new google.maps.Marker({
            position: {lat: parseFloat(LatLang[0]), lng: parseFloat(LatLang[1])},
            map: refMap,
            animation: google.maps.Animation.DROP,
            title: data[i].nom,
            zoom: 16
        });

        marker.infowindow = new google.maps.InfoWindow({ content: ''});

        
        (function(marker, i) {
            // get images from google storage
            let imgArray = [];
            //console.log(data[i].photos.length);
            if(data[i].photos.length > 0){
                //console.log('has photos');
                for (let j = 0; j < data[i].photos.length; j++) {
                    let imgRef = imagesRef.child(data[i].photos[j]);
    
                    imgRef.getDownloadURL().then(function(url) {
    
                        let tmpImg = `<img src="${url}" height="150px" width="auto" alt="image ascenseur" 
                            onclick="window.open('${url}', '_blank')">`
                        imgArray.push(tmpImg);
    
                    }).catch(error => console.log(error));
                }
            }
            // add click event
            google.maps.event.addListener(marker, 'click', function() {
                marker.infowindow.setContent(`
                <div id="content">
                    <div id="siteNotice"></div>
                    <h6 id="firstHeading" class="firstHeading">`+data[i].nom+`</h6>
                    <div id="bodyContent">
                        <ul>
                            <li>Marque: `+data[i].marque+`</li>
                            <li>Geolocalisation: `+data[i].coordonnees+`</li>
                            <li>En panne ? : `+data[i].enPanne+`</li>
                        </ul>
                        <div class="img-div">
                            ${imgArray}
                        </div>
                        
                    </div>
                </div>
                `);

                //document.getElementById('bodyContent').appendChild(imgArray);
                // console.log(marker.infowindow.content);

                let promise = new Promise((resolve, reject) => {
                    if(map.panTo(marker.position) == undefined){
                        resolve('yay');
                    }else{
                        reject(Error('map.panTo not ready'));
                    }
                });

                promise.then(function(result){
                    let zoom = map.getZoom();
                    let timeout = 2000;
                    if (zoom < 13) {
                        timeout = 2000;
                    }else if (zoom < 15) {
                        timeout = 1500;
                    }else{
                        timeout = 1000;
                    }
                    
                    //console.log(zoom, timeout);
                    
                    setTimeout(function(){ smoothZoom(refMap, 20, map.getZoom()); }, 100);
                    setTimeout(function(){ marker.infowindow.open(refMap, marker); }, timeout);
                    
                }, function(err){
                    console.log(err);
                })

                
            });
        })(marker, i);    
        
        markers.push(marker);
    }
}

function addRoutes(refMap){
    db.collection("paths").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //console.log(doc);
            dataRoutes.push(doc.data());
            //console.log(doc.data());
        });
    }).then(function(){
        createRoutes(refMap);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function createRoutes(refMap){
    let modal = document.getElementById('modals');
    for (let i = 0; i < dataRoutes.length; i++) {

        let tmpPath = new google.maps.Polyline({
            path: dataRoutes[i].coordonnees,
            geodesic: true,
            strokeColor: dataRoutes[i].couleur,
            strokeOpacity: 1.0,
            strokeWeight: 4
        });

        modal.innerHTML += `
            <div class="modal fade" id="route${i}" tabindex="-1" aria-labelledby="route${i}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Itineraire ${dataRoutes[i].zone} n°${i+1}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ul>
                                <li>Zone : ${dataRoutes[i].zone}</li>
                                <li>Etat : ${dataRoutes[i].etat}</li>
                                <li>Points de reference : 
                                    <ul>
                                        <li>Point 1</li>
                                        <li>Point 2</li>
                                        <li>Point 3</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        

        tmpPath.addListener('click', () => {
            $(`#route${i}`).modal()
        });
        tmpPath.setMap(refMap);
        
    }
}

reload = () => {
    let asc = document.getElementById('ascenseurs').checked;
    let iti = document.getElementById('itineraires').checked;

    initMap(asc, iti);
}

// the smooth zoom function
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 100); // 80ms is what I found to work well on my system -- 
    }
} 




