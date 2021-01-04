import axios from 'axios';

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const googleApiKey = 'ADD_YOUR_OWN_KEY_HERE';

// declare let google: any;

type GoogleGeocodingResponse = {
	results: {geometry: {location: {lat: number; lng: number}}}[];
	status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event) {
	event.preventDefault();
	
	const enteredAddress = addressInput.value;

	const urlEncodedAddress = encodeURI(enteredAddress);
	
	const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedAddress}&key=${googleApiKey}`
	axios.get<GoogleGeocodingResponse>(googleUrl)
	.then(response => {

		if (response.data.status !== 'OK') {
			throw new Error('Could not fetch location!');
		}
		const coordinates = response.data.results[0].geometry.location;

		const map = new google.maps.Map(document.getElementById('map')!, {
			center: new google.maps.LatLng(coordinates),
			zoom: 16
		});

		new google.maps.Marker({
			position: new google.maps.LatLng(coordinates),
			map: map,
		});
	})
	.catch(err => {
		alert(err.message);
		console.error(err);
	});
}

form?.addEventListener('submit', searchAddressHandler);