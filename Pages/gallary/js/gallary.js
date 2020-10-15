var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
        printResult(
            options.method + ' ' + options.url + '\n' +
            x.status + ' ' + x.statusText + '\n\n' +
            (x.responseText || '')
        );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}


function test() {

    let url = "https://api.github.com/repos/liuyal/SpotLightSaver";

    doCORSRequest({
        method: 'GET',
        url: url,
    }, function printResult(result) {
        console.log(result);
    });


}
