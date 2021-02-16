var global_dates = {};
var global_year = "";
var global_month = "";

function doCORSRequest(options, printResult) {
//    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var cors_api_url = 'https://glacial-garden-64110.herokuapp.com/';
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

                if (!(year in global_dates)) {
                    global_dates[year] = {};
                }
                if (!(month in global_dates[year])) {
                    global_dates[year][month] = {};
                }
                global_dates[year][month][data[i]["path"]] = [];

            } else {

                if (data[i]["path"].indexOf("/") > -1) {

                    var date_label = data[i]["path"].split("/")[0];
                    var year = date_label.substr(0, 4);
                    var month = date_label.slice(4, -2);
                    var day = date_label.slice(-2);

                    if (!(year in global_dates)) {
                        global_dates[year] = {};
                    }
                    if (!(month in global_dates[year])) {
                        global_dates[year][month] = {};
                    }
                    global_dates[year][month][date_label].push(raw_url + '/' + data[i]["path"]);
                }
            }
        }

        var years = Object.keys(global_dates);
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
    });
}


function check_data() {
    console.log(global_dates);
}


function load_data() {

    images = [];
    images_pi = [];
    global_month = event.target.id.split("m")[1];
    month = event.target.id.split("m")[1];
    year = this.global_year.split("_")[1];
    data = this.global_dates[year][month];
    date_labels = Object.keys(data);

    for (i = 0; i < Object.keys(data).length; i++) {
        day_images = data[date_labels[i]];
        for (x in day_images) {
            image = day_images[x];

            if (image.search("_pi") > -1) {
                images_pi.push(day_images[x]);
            } else {
                images.push(day_images[x]);
            }
        }
    }

    localStorage.setItem("local_month", global_month);
    localStorage.setItem("local_year", global_year);
    localStorage.setItem("local_images", images);
    localStorage.setItem("local_images_pi", images_pi);
}


function load_images() {

    month = localStorage.getItem("local_month");
    year = localStorage.getItem("local_year").split("_")[1];
    images = localStorage.getItem("local_images").split(",");
    images_pi = localStorage.getItem("local_images_pi").split(",");

    var counter = 0;
    var im_index = 0
    var flag = true;

    for (i = 0; i < images.length * 2; i++) {

        var temp_image = document.createElement("IMG");
        temp_image.style = "width:100%";

        if (counter > 3) {
            counter = 0;
            flag = !flag;
        }

        if (flag) {
            if (i % 2 > 0) {
                temp_image.src = images_pi[im_index];
                im_index += 1;

            } else {
                temp_image.src = images[im_index];
            }

        } else {
            if (i % 2 > 0) {
                temp_image.src = images[im_index];
                im_index += 1;
            } else {
                temp_image.src = images_pi[im_index];
            }
        }
        counter += 1;
        var col_element = document.getElementById("col_" + (i % 4 + 1));
        col_element.appendChild(temp_image);
    }
}


function load_months(year) {

    var month_list = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var elems = document.querySelectorAll(".nav-link");
    var current_tab = "tab_" + year.split("_")[1];
    var months = Object.keys(global_dates[year.split("_")[1]]).sort();

    [].forEach.call(elems, function (el) {
        el.classList.remove("active");
    });

    document.getElementById(current_tab).classList.add("active");

    var i;
    for (i = 0; i < month_list.length; i++) {
        var box = document.getElementById("m" + month_list[i]);
        if (months.includes(month_list[i])) {
            box.style.backgroundColor = "LightGreen";
            box.style.backgroundImage = "";
            box.addEventListener('click', function (event) {
                load_data();
                window.location.replace("./gallery_month.html");
            });

        } else {
            box.style.backgroundColor = "LightGray";
        }
        box.textContent = month_name[i];
    }
    this.global_year = year;
}
