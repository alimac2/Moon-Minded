"use strict"


/* global variable called state. State is where you start off.  */


/* ---- CLICK EVENTS TO HIDE AND SHOW PAGES --_- */
$(".nav-link-create").click(function() {
  $(".new-entry-page").removeClass("hidden");  
  $(".all-entries-page").addClass("hidden");
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
        /* clear out form
        tried entryDetails.val(""); .empty(LOOK UP)
        need to try document.getElementById("").reset();
        $(".class")[0].reset();
        $(".class").trigger("reset");
        */
        $.ajax({
            method: "POST",
            url: "/entries",
            dataType: "json",
            data: JSON.stringify(entryDetails),
            contentType: "application/json", 
            success: function(data) {
                console.log("POST request works"); /*Display data, call function to display data*/
                /* create function - maybe. 
                 
                $(".new-entry-page").addClass("hidden");*/
            }
        });     
    });
};


function getEntries() {
    $(".nav-link-all").click(function() {
        event.preventDefault();


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
    });
};

function displayEntries(data) {

    for (let i = 0; i < data.length; i++) {
    // console.log(data);
    // console.log(i);
        $(".all-entries-title").removeClass("hidden");
        $(".main-title").addClass("hidden");
        $(".about").addClass("hidden")
        $(".all-entries-page").append(
            `<div class="entries-display" id="${data[i].id}">
                <button class="entry-btn edit-btn">Edit</button>
                <button class="entry-btn delete-btn">Delete</button>
                <span>${data[i].created}</span>
                <span>${data[i].title}</span>
            </div>`
        );  
    };
};


// function updateEntries(callbackFn) {
// $(".all-entries").on("click", ".edit-btn", function(event) {
//     event.preventDefault();

//     const entryId = $(this).parent().attr("id"); 
//     console.log(entryId); 
    
//     $.ajax({
//         method: "PUT",
//         url: "/entries/" + entryId,
//         dataType: "json",
//         /* data: JSON.stringify(),     may want to pass in data object*/
//         success: function(data) {
//             console.log("PUT request works");
//             /* should take user back to new entry view but with fields filled in */
//         }
//     });
// });


$(".all-entries").on("click", ".delete-btn", function(event) {
    event.preventDefault();
    
    const entryId = $(this).parent().attr("id"); 
    console.log(entryId); 

    $.ajax({
        method: "DELETE",
        url: "/entries/" + entryId,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            // getEntries();
            /*want to remove deleted entry*/
            /*keep existing entries visible on page */
            console.log("DELETE request works");
        } /* make API call to refresh page after delete*/
    });
});


/* document ready - when the page loads*/
$(function() {
    submitEntryData();
    getEntries();
});