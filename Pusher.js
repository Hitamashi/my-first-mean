var Pusher = require('pusher');

var pusher = new Pusher({
	appId: '426793',
	key: 'ec3c2fa791f9b21e7070',
	secret: '1ffd43c5bccd747fa6d4',
	cluster: 'ap1',
	encrypted: true
});

module.exports = pusher; 