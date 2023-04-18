// imports and keys needed for the map
	(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
		({ key: "AIzaSyAliyaSrPJGzysulkE5jvn7uppEWHkudzg", v: "beta" });


	var map;
	var markers = [];
	

	async function initMap() { //generate the map
		var boston = { lat: 42.34884289159048, lng: -71.08881065093446 }
		const { Map } = await google.maps.importLibrary("maps");
		const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

		//boston centered
		map = new Map(document.getElementById("map"), {
			zoom: 13.5,
			center: boston,
			mapId: "DEMO_MAP_ID",
		});
		updatePins();
        var screenwidth = window.innerWidth;
        var myMap = document.getElementById('map');
        myMap.style.left = screenwidth/2 - 300;
        
	}    

	window.onload(initMap()); // loads map after page loads   
    
	

	async function getBusLocations() { // fetches the bus locations real time and puts into a json format
		var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';
		var response = await fetch(url);
		var json = await response.json();
		return json.data;
	}

	async function updatePins() { //create or move the bus icons
		//fetch bus locations
		var locations = await getBusLocations(); //json to obj array

		locations.forEach (function (bus){
			
			var marker = findBus(bus.id);
			if(marker){ // find returns the found object and true if found so servces as dual purpose here
				moveMaker(marker,bus); //uses the object fround in marker
			}else{
				addMarker(bus);
			}
		});

		setInterval(updatePins,15000);
	}

	function addMarker(bus) { // given a bus from locations array create a marker and push into markers array
		//add markers to markers array
		var marker = new google.maps.Marker({
			position: {
				lat: bus.attributes.latitude,
				lng: bus.attributes.longitude
			},
			map: map,
			icon: './red.png',
			id: bus.id
		});
		markers.push(marker);
	}
	
	function findBus(id) {// given the bus id return that bus marker form markers array
		//ensure you are moving the right marker
		var bus = markers.find(function(item){
			return item.id === id;

		});
		return bus;
	}
	
	function moveMaker(marker,bus) { // given a marker and its assoc bus update the position of the marker
		// find the right marker then move it to the new position
		marker.setPosition({
			lat:bus.attributes.latitude,
			lng:bus.attributes.longitude
		});
	}
