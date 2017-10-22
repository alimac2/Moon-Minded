"use strict"


/* global variable called state. State is where you start off.  */

$(".nav-link-create").click(function() {
  $(".new-entry-page").removeClass("hidden");  
});




function submitEntryData() {    
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
            // console.log(data);
            displayEntries(data);
            console.log("GET request works");
        }
    });
};

function displayEntries(data) {

    for (let i = 0; i < data.length; i++) {
    // console.log(data);
    // console.log(i);
        $(".all-entries").append(
            `<div class="entries-display">
                <dt id="${data[i].id}"> 
                <button class="entry-btn edit-btn">Edit</button>
                <button class="entry-btn delete-btn">Delete</button>
                <span>${data[i].created}</span>
                <span>${data[i].title}</span>
                </dt>
            </div>`
        );  /*added data.[i].id embedded expression */
    };
};


function deleteEntry(data) {
    $(".delete-btn").click(function() {
        event.preventDefault();
        console.log(entryId);

        const entryId = $(this).data("id"); /* also $(this).attr("data-id"); */

        $.ajax({
            method: "DELETE",
            url: `/entries/${entryId}`, /* LOOK OVER */
            dataType: "json",
            contentType: "application/json",
            // data: JSON.stringify(entryDetails),
            success: function(data) {
                console.log("DELETE request works");
            }
        });
    });
}


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
deleteEntry();
getEntries();
});