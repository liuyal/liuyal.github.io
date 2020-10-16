var dates = {};

function doCORSRequest(options, printResult) {
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
        printResult(x.responseText);
    };

    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}


function request_github_data() {

    let raw_url = "https://raw.githubusercontent.com/liuyal/SpotLightSaver/master/";
    let repo_tree_url = "https://api.github.com/repos/liuyal/SpotLightSaver/git/trees/master?recursive=1";

    doCORSRequest({
        method: 'GET',
        url: repo_tree_url,
    }, function printResult(result) {

        var data = JSON.parse(result)["tree"];
        var i;

        for (i = 0; i < data.length; i++) {

            if (/^\d+$/.test(data[i]["path"])) {

                var year = data[i]["path"].substr(0, 4);
                var month = data[i]["path"].slice(4, -2);
                var day = data[i]["path"].slice(-2);

                if (!(year in dates)) {
                    dates[year] = {};
                }
                if (!(month in dates[year])) {
                    dates[year][month] = {};
                }

                dates[year][month][data[i]["path"]] = [];

            } else {

                if (data[i]["path"].indexOf("/") > -1) {

                    var date_label = data[i]["path"].split("/")[0];
                    var year = date_label.substr(0, 4);
                    var month = date_label.slice(4, -2);
                    var day = date_label.slice(-2);

                    if (!(year in dates)) {
                        dates[year] = {};
                    }
                    if (!(month in dates[year])) {
                        dates[year][month] = {};
                    }

                    dates[year][month][date_label].push(raw_url + '/' + data[i]["path"]);
                }
            }
        }

        dates["2021"] = {};
        dates["2022"] = {};

        var years = Object.keys(dates);
        var i;
        for (i = 0; i < years.length; i++) {

            if (i == 0) {

                document.getElementById("default_tab").innerHTML = years[0];
                document.getElementById("default_tab").href = "#" + years[0];

            } else {

                var li_node = document.createElement("LI");
                var clone = document.getElementById("default_tab");
                var pill_node = clone.cloneNode(true);
                
                pill_node.innerHTML = years[i];
                pill_node.id = years[i];
                pill_node.href = "#" + years[i];

                li_node.appendChild(pill_node);

                document.getElementById("nav_pills").appendChild(li_node);

            }

             console.log(years[i]);
        }

       


    });

}

function check_data() {
    console.log(dates["2020"]);
}

function load_months() {
    console.log(dates["2020"]);
}
