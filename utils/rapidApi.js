const http = require('https');

const options = {
	method: 'POST',
	hostname: 'distanceto.p.rapidapi.com',
	port: null,
	path: '/distance/point',
	headers: {
		'x-rapidapi-key': process.env.RAPID_API_KEY,
		'x-rapidapi-host': process.env.RAPID_API_HOST,
		'Content-Type': 'application/json'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write(JSON.stringify({
  point: {
    country: 'MAR',
    name: 'Agadir'
  }
}));
req.end();