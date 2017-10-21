"use strict"


$(".nav-bar-create").click(function() {
  $(".new-entry-page").removeClass("hidden");  
});









function submitEntryData() {    /* possibly rename */
    $(".submit-entry").click(function() {
        event.preventDefault();

        const entryTitle = $(".entry-title").val();
        const eventType = $(".event-type").val();
        const entryContent = $(".content").val();
        const entryDate = $(".date-created").val();
        
        const entryDetails =  {
            title: entryTitle,
            eventType: eventType,
            content: entryContent,
            created: entryDate
        };
        
        $.ajax({
            method: "POST",
            url: "/entries",
            dataType: "json",
            data: JSON.stringify(entryDetails),
            contentType: "application/json", 
            success: function(data) {
                console.log("POST request works"); /*Display data, call function to display data*/
                /* create function maybb. toggleclass or removeclass hidden to hide post form - show other section 
                 
                $(".new-entry-page").addClass("hidden");*/
            }
        });     
    });
}

submitEntryData();
 

function getEntries(callbackFn) {
    $.ajax({
        method: "GET",
        url: "/entries", 
        dataType: "json",
        data: entryDetails/* maybe entryDetails, DOUBLE CHECK */,
        contentType: "application/json", 
        success: function(data) {
            console.log("GET request works");
        }
    });
}

function displayEntries(data) {
    for (index in data) {
        $("body").append(
            "<div>" +
                "<p>" + data[index].created + "</p>" +
                "<p>" + data[index].title + "</p>" +
            "</div>"
        );  
    }
}

function getAndDisplayEntries() {
    getEntries(displayEntries);
}

$(function() {
    getAndDisplayEntries();
})


function deleteEntry() { /*entryId, data, or entryDetails*/
    $(".delete-entry").click(function() {
        event.preventDefault();
        
        const entryId = $(".class-name").val(); /* all delete buttons will have the same class, grabbed from DOM*/

    }); /*review - do you need event in the jquery event callback?*/

    $.ajax({
        method: "DELETE",
        url: "/entries/entryId", /* LOOK OVER */
        dataType: "json",
        contentType: "application/json",
        // data: JSON.stringify(entryDetails),
        success: function(data) {
            console.log("DELETE request works");
        }
    });
}

deleteEntry();





// function updateEntries(callbackFn) {
//     $.ajax({
//         method: "PUT",
//         url: "/entries", 
//         data: data,
//         success: function(data) {},
//     });
// }