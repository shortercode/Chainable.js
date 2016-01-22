/*
    Editor server
*/
const powernap = require('powernap.js'),
      app = new powernap(80);

app.staticEndpoint('/', './www');