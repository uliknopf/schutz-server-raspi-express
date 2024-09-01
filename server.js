// Require express module
const express = require('express');
// Require crypto module
const crypto = require('crypto');

// Create an express app
const app = express();
// Create a middleware to parse JSON
app.use(express.json());

// Create a middleware to check the request body and simulate long check
function middlewareSimulateLongCheck(req, res, next) {
        // Check if the request body is empty or not an object
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('kein Json-Objekt!');
        }
        setTimeout(()=>{next();}, 1000);
         
}
// Create a middleware to check the hash, make fast decision
// die Middleware greift nur auf das Objekt des Requests (req) zu, es kann daher
// für alle Methoden (get,post,put,delete,...)verwendet werden.
//In meinem Beispiel besteht der URL-Hash aus sensorID (10 Zeichen) + MD5(sensorID)(auch 10 Zeichen).
function middlewareFastHashDecision(req, res, next) {
    const  hash  = req.params.hash; // get hash from the request params
    // hash besteht aus sensorID + MD5(sensorID). Alle sensorID und Crypto-Hashes haben bei mir genau 10 Zeichen.
    const sensorID = hash.slice(0, 10); // get sensorID from the url (sensorID='sensorID01')
    const sensorCryptoHash = hash.slice(10); // get sensorCryptoHash from the url (sensorCryptoHash='d85dd83cdf')
    // Jetzt wird der echte Hash aus der sensorID erstellt.
    const realCryptoHash = crypto.createHash('md5').update(sensorID).digest('hex').slice(0,sensorID.length);
    // Check hash
    if (sensorCryptoHash === realCryptoHash) {
        next();
    }else {
        res.status(200).send('wrong hash');//schnelle Abweisung
    }
}


// Erster Endpunkt ohne Hash middleware
//Hier wird jeder eingehende Request aufwändig verarbeitet.
app.post('/post_empfang', middlewareSimulateLongCheck,function (req, res) {
    res.send('All right');
});
// Zweiter Endpunkt mit Hash middleware
//Hier werden nur die eingehenden Requests aufwändig verarbeitet, deren URL den Hash-Test bestehen.
app.post('/post_empfang/:hash', middlewareFastHashDecision, middlewareSimulateLongCheck,function (req, res) {
    res.send('All right mit Hash');
});
// Dritter Endpunkt als Beispiel für einen GET-Request.
// Hier wird der Hash-Test als "Pseudo-Passwort" verwendet.
app.get('/wichtige_info/:hash',middlewareFastHashDecision, function (req, res) {
    res.send('wichtige_info nur mit Hash');
});
// Vierter Endpunkt als Beispiel für einen GET-Request.
// Hier wird kein Hash-Test verwendet. Jeder Request bekommt die "wichtige" Nachricht geliefert.
app.get('/wichtige_info', function (req, res) {
    res.send('wichtige_info');
});
// All other routes
app.use(function(req, res) {
    res.status(404).send("Sorry");
});

/* // Error-handling middleware for JSON parsing errors - not needed in my case
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.log("not a regular json format");
        return res.status(400).send({ error: "Invalid JSON format" });
    }
    next();
}); */

// start the server on the port 3000.
app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});
