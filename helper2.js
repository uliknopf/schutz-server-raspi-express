//helper2.js
// Es werden hier zehn Post-Requests gesendet, zum Testen der Performance des Servers (im separaten Terminal).

async function sendPostRequest(numRequests){
    let request_count = 1;
    let sum_time = 0;
    const requests = Array.from({ length: numRequests }, async () => {
        const startTime = Date.now();
        try {
            await fetch("http://127.0.0.1:3000/post_empfang/sensorID01d85dd83cdf", {
                method: "POST",
                body: JSON.stringify({"sensorID":"sensorID01","sensorPWD":"password1"}),
                headers: {"Content-Type": "application/json"}
            });
            let endTime = Date.now();
            sum_time +=endTime - startTime;
            if (request_count == numRequests){
                console.log('meanTime: '+sum_time/numRequests)
            }
        }catch (error){'error: '+ error.message}
        request_count++;
    });
    await Promise.all(requests);
}

sendPostRequest(10);