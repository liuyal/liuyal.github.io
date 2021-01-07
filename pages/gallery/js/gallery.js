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

        var years = Object.keys(dates);
        var i;
        for (i = 0; i < years.length; i++) {

            if (i == 0) {

                document.getElementById("li_0").id = "li_" + years[0];
                document.getElementById("tab_0").innerHTML = years[0];
                document.getElementById("tab_0").href = "#" + years[0];
                document.getElementById("tab_0").classList.add("active");

            } else {

                var li_node = document.createElement("LI");
                var clone = document.getElementById("tab_0");
                var tab_node = clone.cloneNode(true);

                tab_node.innerHTML = years[i];
                tab_node.id = "tab_" + years[i];
                tab_node.href = "#" + years[i];
                tab_node.classList.remove("active");

                li_node.appendChild(tab_node);
                li_node.id = "li_" + years[i];
                li_node.onclick = function () {
                    load_months(this.id)
                };

                document.getElementById("nav_pills").appendChild(li_node);
            }
        }

        document.getElementById("tab_0").id = "tab_" + years[0];
        load_months("li_" + years[0]);
        
        // Load images

    });
}


function check_data() {
    console.log(dates);
}


function load_months(year) {

    var month_list = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    var elems = document.querySelectorAll(".nav-link");
    var current_tab = "tab_" + year.split("_")[1];
    var months = Object.keys(dates[year.split("_")[1]]).sort();

    [].forEach.call(elems, function (el) {
        el.classList.remove("active");
    });

    document.getElementById(current_tab).classList.add("active");

    var i;
    for (i = 0; i < month_list.length; i++) {
        var box = document.getElementById("m" + month_list[i]);
        if (months.includes(month_list[i])) {
             box.style.backgroundColor = "LightGreen";
        } else {
             box.style.backgroundColor = "LightGray";
        }

    }
    console.log(year)


}
