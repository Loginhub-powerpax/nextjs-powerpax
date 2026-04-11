const https = require('https');

https.get('https://docs.google.com/spreadsheets/d/1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg/export?format=csv', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const lines = data.split('\n');
        console.log("HEADERS:", lines[0]);
        console.log("SAMPLE ROW:", lines[1]);
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
