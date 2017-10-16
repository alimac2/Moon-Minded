"use strict"

const MOCK_ENTRY = {
    "journalEntries": [
        {
            "id": "1111",
            "title": "Milky Way at the Beach",
            "eventType": "milky way",
            "content": "On a drive up to the beach with my sisters we saw the most brilliant night sky. The stars blanketed the entire sky and the milky way was so vivid.",
            "created": "September 10, 2017"
        },
        {
            "id": "2222",
            "title": "First Solar Eclipse",
            "eventType": "solar eclipse",
            "content": "Viewing the eclipse was one of the most spectacular natural phenomenons I have ever witnessed. I get goosebumps just thinking about it. It was so brief yet so memorable. The thrill I felt while watching it is hard to explain.",
            "created": "August 3, 2017"
        },
        {
            "id": "3333",
            "title": "Falling Sky",
            "eventType": "meteor shower",
            "content": "Have you ever looked at the night sky and thought to yourself, 'Shit, the starts are falling'? Tonight that's exactly what went through my mind. The number of meteors crossing the sky at one time was unbelievable. I was mesmerized.",
            "created": "February 22, 2017"
        }
    ]
};

/* click on creating new entry
eventPreventDefault()
pull values of data .val()
POST AJAX request when click happens */
$.ajax({
    method: POST,
    url: "/entries",
    dataType: "json",
    data: JSON.stringify({entryData}), /* type in data object */
    contentType: "application/json", 
    crossDomain: true, /* may not need for each endpoint - check */
    success: function(data) {
        console.log("function worked");
    },
});

function getEntries(callbackFn) {
    $.ajax({
        method: "GET",
        url: "/entries", 
        dataType: "json",
        success: function(data) {},
        contentType: 
    });
}

function updateEntries(callbackFn) {
    $.ajax({
        method: "PUT",
        url: "/entries", 
        data: data,
        success: function(data) {},
    });
}

function displayEntries(data) {
    for (index in data.journalEntries) {
        $("body").append(
            "<p>" + data.journalEntries[index].content + "</p>");  
        }
}

function getAndDisplayEntries() {
    getEntries(displayEntries);
}

$(function() {
    getAndDisplayEntries();
})