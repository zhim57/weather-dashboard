// function to force js to wait till the whole document loads
$(document).ready(function () {

    // setting up some global variables
    var cities = [];
    var lat = "";
    var lon = "";
    var cityDiv;
    var cardsFull = true;


    function displayCityInfo() {
        // //---------------
        // // clearing the display divs for the 5 day forecast cards
        // if (cardsFull === true) {
        //     for (var i = 1; i < 6; i++) {
        //         $(datesArrey[i]).empty();
        //         // setting the check boolean to "false" after emtying the card divs
        //         cardsFull = false;
        //     }
        // }
        // else {

        // }
        // //-----------------
        // preparing variables for the first AXAx request
        var city = $(this).attr("data-name");
        var APIKey = "f2e73a675d880326530db1f8aee7437b";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

        // Creating an AJAX call for the specific city button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // preparing the div that will hold the city and date displayed
            cityDiv = $(".city");
            cityDiv.removeClass("no-show");
            cityDiv.addClass("cities-view");

            var cityName = response.city.name;
            lat = response.city.coord.lat;
            lon = response.city.coord.lon;

            var humidityD = response.list[3].main.humidity;
            var windSpeedDm = response.list[3].wind.speed;
            var windSpeedD = (windSpeedDm * 2.237).toFixed(1);

            var presentDate = moment().format('MMM Do YYYY');
            $(cityDiv).html(cityName + " (" + presentDate + ")");
            $(".wind").text("Wind Speed: " + windSpeedD + " M/pH");
            $(".humidity").text("Humidity: " + humidityD + " %");

            $("#cities-view").prepend(cityDiv);

            var weatherIcon = response.list[2].weather[0].icon;
            var imgURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";


            // // Creating an element to hold the image
            var imageD = $(".imgD");
            imageD.removeClass("no-show");
            imageD.attr("src", imgURL);
            imageD.attr("alt", "weather icon");
            $(".card").removeClass("no-show");
            // calling the function for displaying and setting class to the UV -Index
            displayUv();
        });
    }

    // funcrtion to create the buttons from the array or local storage
    function renderButtons() {
        $("#buttons-view").empty();
        // Looping through the array of cities
        for (var i = 0; i < 5; i++) {
            var a = $("<li>");
            a.addClass("city-btn");
            a.addClass(cities[cities.length - 1 - i]);

            // Adding a data-attribute
            a.attr("data-name", cities[cities.length - 1 - i]);
            // Providing the initial button text
            a.text(cities[cities.length - 1 - i]);
            // Adding the button to the buttons-view div
            $("#buttons-view").append(a);
        }
        // added a trigger to populate data on initial  input of the city 
        //added the check Boolean change to guarantee the forecast cards are displayed once only

        cardsFull = true;
        $("li." + cities[cities.length - 1]).trigger('click');

    }

    // This function handles events where a city button is clicked
    $("#add-city").on("click", function (event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var city = $("#city-input").val().trim();
        // Adding the city from the textbox to the cities array
        cities.push(city);
        // recording the last 5 cities used inthe array to the local storrage

        for (var i = 0; i < 5; i++) {
            localStorage.setItem(i, cities[cities.length - i - 1]);
        }
        // Calling renderButtons which handles the processing of our cities array
        renderButtons();

    });

    // Adding a click event listener to all elements with a class of "city-btn"
    $(document).on("click", ".city-btn", displayCityInfo);

    var datesArrey = ["day0", ".day1", ".day2", ".day3", ".day4", ".day5"];
    function displayUv() {

        var APIKey = "f2e73a675d880326530db1f8aee7437b";
        // puting together the queryURL for the second AJAX call
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey;

        // Creating an AJAX call for the specific city button being clicked by Lat and Lon
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // getting the uv value;
            var uvD = response.current.uvi;
            // getting the temp in K  value;
            var tempD = response.current.temp;
            // Convert the temp K  to fahrenheit
            var tempF = (tempD - 273.15) * 1.80 + 32;
            // Convert the temp K  to Celsius
            var tempC = tempD - 273.15;

            // clearing the previous and assigning current classes for the diferent values of UV Index
            if (uvD < 3) {
                $("#uv").removeClass();
                $("#uv").addClass("uvSafe");
            }
            else if (uvD > 2 && uvD < 6) {
                $("#uv").removeClass();
                $("#uv").addClass("uvModerate");
            }
            else if (uvD > 5 && uvD < 8) {
                $("#uv").removeClass();
                $("#uv").addClass("uvSevere");
            }
            else if (uvD > 7 && uvD < 11) {
                $("#uv").removeClass();
                $("#uv").addClass("uvSevere1");
            }
            else if (uvD > 11) {
                $("#uv").removeClass();
                $("#uv").addClass("uvInsane");
            }
            else {

            }

            // trimming the temp values to one digit after the decimal point and assigning to the appr div
            $(".tempF").text("Temperature (F) " + tempF.toFixed(1));
            //adding the C temp
            var pOne = $("<p>").text("Temperature (C): " + tempC.toFixed(1));
            $(".tempF").append(pOne);
            // displayng the UV value
            $("#uv").text(uvD);
            createForecast();

            function createForecast() {
                // clearing the display divs for the 5 day forecast cards
                if (cardsFull === true) {
                    for (var i = 1; i < 6; i++) {
                        $(datesArrey[i]).empty();
                        // setting the check boolean to "false" after emtying the card divs
                        cardsFull = false;
                    }
                }
                else {

                }
                // module cards starts
                for (var i = 1; i < 6; i++) {
                    var date1 = $("<p>");
                    var dateDU1 = response.daily[i].dt;
                    var dateD1 = new Date();
                    dateD1.setTime(dateDU1 * 1000);

                    var month = dateD1.getMonth();
                    var day = dateD1.getDate();
                    var year = dateD1.getFullYear();
                    var dateDD = (month + 1) + "/" + day + "/" + year;

                    date1.text(dateDD);
                    $(datesArrey[i]).append(date1);
                    $(datesArrey[i]).removeClass("no-show");

                    var weatherIcon = response.daily[i].weather[0].icon;

                    var imgURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

                    // // Creating an element to hold the image
                    var imageDp = $("<img>");

                    imageDp.attr("src", imgURL);
                    imageDp.attr("alt", "weather icon");
                    // appending to the card
                    $(datesArrey[i]).append(imageDp);

                    // creating values for humidity and temp
                    var humidityD = response.daily[i].humidity;
                    var tempK = response.daily[i].temp.day;
                    var tempF = (tempK - 273.15) * 1.80 + 32;
                    var pTwo = $("<p>").text("Humidity: " + humidityD + " % ");
                    var pThree = $("<p>").text("Temp: " + tempF.toFixed(1) + " F");
                    // appending to the card
                    $(datesArrey[i]).append(pTwo);
                    $(datesArrey[i]).append(pThree);
                    // setting the check var to true to avoid creating more than one set of weather cards for the prognosis
                    // module for cards ends here

                }
                cardsFull = true;

            }
        });
    }

    // module for filling the cities array from local storage on startup
    function fillArreyOnStart() {
        for (var i = 0; i < 5; i++) {
            var cityS = localStorage.getItem(i);
            cities.push(cityS);
            renderButtons();
        }
        // creating a manual click event to display last shown city on start 
        cardsFull = true;
        $("li." + cities[cities.length-1]).trigger('click');
    }
    // creating a call for the fill up function above
    fillArreyOnStart();
});