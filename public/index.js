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
        $(".all-entries").append(
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
$(".all-entries-page").on("click", ".edit-btn", function(event) {
    event.preventDefault();
    $(".all-entries").addClass("hidden");
    $(".new-entry-page").removeClass("hidden");
    /*when user click edit button, the app takes user tom modal.  (div class=modal) with all fields from new entry but with existing data. So they can make change to the data they want to make changes to. Create a save button for user to save changes. Populate data in form*/

/* hit edit button*/
/*modal pops up with update entry form*/
/* enter values into right input areas*/
/*user hits save button, values are stored in a new entry object*/



    /* change classes based on update form*/
    const entryTitle = $(".entry-title").val();
    const eventType = $(".event-type").val();
    const entryContent = $(".content").val();
    const entryDate = $(".date-created").val();
    
    const updatedEntry =  {
        title: entryTitle,
        eventType: eventType,
        content: entryContent,
        created: entryDate
    };
    console.log(updatedEntry);

    const entryId = $(this).parent().attr("id"); 
    console.log(entryId); 
    
    $.ajax({
        method: "PUT",
        url: "/entries/" + entryId, /*double check if entryId is needed*/
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(updatedEntry),     /*may want to pass in data object*/
        success: function(data) {
            console.log("PUT request works");
            /* should take user back to new entry view but with fields filled in */
        }
    });
});


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
            getEntries();
            /*want to remove deleted entry*/
            /*keep existing entries visible on page */
            /* make API call to refresh page after delete*/
            console.log("DELETE request works");
        } 
    });
});


/* document ready - when the page loads*/
$(function() {
    submitEntryData();
    getEntries();
});