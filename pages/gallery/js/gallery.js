var global_dates = {};
var global_year = "";
var global_month = "";

function doCORSRequest(options, printResult) {
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
            if (data[i]["path"].indexOf("/") > -1 && data[i]["path"].indexOf(".png") > -1) {

                var year = data[i]["path"].split("/")[0];
                var month = data[i]["path"].split("/")[1];
                var day = data[i]["path"].split("/")[2];

                if (!(year in global_dates)) {
                    global_dates[year] = {};
                }
                if (!(month in global_dates[year])) {
                    global_dates[year][month] = {};
                }
                if (!(day in global_dates[year][month])) {
                    global_dates[year][month][day] = [];
                }
                global_dates[year][month][day].push(raw_url + '/' + data[i]["path"]);
            }

        }

        set_ui();

    });


}


function set_ui() {

    var years = Object.keys(global_dates);
    year = window.location.href.split("#").pop()

    if (year.includes(".html")) {
        year = years[0];
    }

    document.getElementById("li_0").id = "li_" + years[0];
    document.getElementById("tab_0").innerHTML = years[0];
    document.getElementById("tab_0").href = "#" + years[0];
    document.getElementById("tab_0").classList.remove("hide");
    document.getElementById("tab_0").classList.remove("active");

    var i;
    for (i = 1; i < years.length; i++) {

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
            load_month_frame(this.id)
        };
        document.getElementById("nav_pills").appendChild(li_node);
    }
    document.getElementById("tab_0").id = "tab_" + years[0];
    load_month_frame("li_" + year);
}


function check_data() {
    console.log(global_dates);
}


function return_last_page() {
    year = localStorage.getItem("local_year").split("_")[1];
    cmd = "location.href='POP'"
    path = "./gallery.html"
    window.location.replace(path + "#" + year);
}

function load_images() {

    month = localStorage.getItem("local_month");
    year = localStorage.getItem("local_year").split("_")[1];
    images = localStorage.getItem("local_images").split(",");
    images_p = localStorage.getItem("local_images_p").split(",");

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
                temp_image.src = images_p[im_index];
                im_index += 1;

            } else {
                temp_image.src = images[im_index];
            }

        } else {
            if (i % 2 > 0) {
                temp_image.src = images[im_index];
                im_index += 1;
            } else {
                temp_image.src = images_p[im_index];
            }
        }
        counter += 1;

        var temp_a = document.createElement("A");
        temp_a.href = temp_image.src;
        temp_a.target = "_blank";
        temp_a.appendChild(temp_image);
        var col_element = document.getElementById("col_" + (i % 4 + 1));
        col_element.appendChild(temp_a);
    }
}


function load_image_data() {

    images = [];
    images_p = [];
    global_month = event.target.id.split("m")[1];
    month = event.target.id.split("m")[1];
    year = this.global_year.split("_")[1];
    data = this.global_dates[year][month];
    date_labels = Object.keys(data);

    for (i = 0; i < Object.keys(data).length; i++) {
        day_images = data[date_labels[i]];
        for (x in day_images) {
            image = day_images[x];

            if (image.search("_p") > -1) {
                images_p.push(day_images[x]);
            } else {
                images.push(day_images[x]);
            }
        }
    }

    localStorage.setItem("local_month", global_month);
    localStorage.setItem("local_year", global_year);
    localStorage.setItem("local_images", images);
    localStorage.setItem("local_images_p", images_p);
}



function load_month_frame(year) {

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

            var rando_image = "_p";
            while (rando_image.includes("_p")) {
                var days = Object.keys(global_dates[year.split("_")[1]][month_list[i]]);
                var item = days[Math.floor(Math.random() * days.length)];
                var image_list = global_dates[year.split("_")[1]][month_list[i]][item]
                rando_image = image_list[Math.floor(Math.random() * image_list.length)];
            }

            //            box.style.backgroundImage = "url('" + rando_image + "')";
            //            box.style.backgroundPosition = "center";
            box.style.backgroundColor = "LightGreen";
            box.addEventListener('click', function (event) {
                load_image_data();
                window.location.replace("./gallery_month.html");
            });

        } else {
            box.style.backgroundColor = "darkgrey";
        }
        box.textContent = month_name[i];
    }
    this.global_year = year;
}
