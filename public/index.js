"use strict"


/* global variable called state. State is where you start off.  */

$(".nav-link-create").click(function() {
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
};


function getEntries() {
    $.ajax({
        method: "GET",
        url: "/entries", 
        dataType: "json",
        contentType: "application/json", 
        success: function(data) {
            // displayEntries(data);
            console.log("GET request works");
        }
    });
};

function displayEntries(data) {

    for (index in data) {
    console.log(data);
    console.log(index);
        $(".all-entries").append(
            `<div class='entries-display'>
                <p>data[index].created</p>
                <p>data[index].title</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>`
        );  
    };
};

// function getAndDisplayEntries() {
//     getEntries(displayEntries);
// }


// function deleteEntry() { /*entryId, data, or entryDetails*/
//     $(".delete-entry").click(function() {
//         event.preventDefault();
        
//         const entryId = $(".delete-btn").val(); /* all delete buttons will have the same class, grabbed from DOM*/

//     }); /*review - do you need event in the jquery event callback?*/

//     $.ajax({
//         method: "DELETE",
//         url: "/entries/entryId", /* LOOK OVER */
//         dataType: "json",
//         contentType: "application/json",
//         // data: JSON.stringify(entryDetails),
//         success: function(data) {
//             console.log("DELETE request works");
//         }
//     });
// }


// function updateEntries(callbackFn) {
//     $.ajax({
//         method: "PUT",
//         url: "/entries/", 
//         dataType: "json",
//         data: entryDetails, /* make sure this is corerct */
//         success: function(data) {
//             console.log("PUT request works");
//         },
//     });
// }

/* document ready*/
$(function() {
submitEntryData();
// deleteEntry();
getEntries();
});