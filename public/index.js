"use strict"


/* global variable called state. State is where you start off.  */


/* ---- CLICK EVENTS TO HIDE AND SHOW PAGES --_- */
$(".nav-link-create").click(function() {
  $(".new-entry-page").removeClass("hidden");  
  $(".all-entries-page").addClass("hidden");
  $(".landing-page").addClass("hidden");
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
        console.log(entryDetails);
        
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


function getAndDisplayEntries() {
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
            `<div class="entry-display" id="${data[i].id}">
                <button class="entry-btn edit-btn">Edit</button>
                <button class="entry-btn delete-btn">Delete</button>
                <span>${data[i].created}</span>
                <span>${data[i].title}</span>
            </div>`
        );  
    };
};


$(".all-entries-page").on("click", ".edit-btn", function(event) {
    event.preventDefault();
    const entryId = $(this).parent().attr("id"); 
    console.log(entryId); 
    
    $(".all-entries-page").addClass("hidden");
    $(".new-entry-page").addClass("hidden");
    $(".edit-entry-display").html(
        `<form class="edit-entry-form" id="${entryId}">
            <h2>Edit Entry</h2>
            <input class="edit-entry-title" type="text" placeholder="Entry Title">
            <br>
            <label>Event Type</label>
            <br>
            <select class="edit-event-type">
                <option value="moon">moon</option>
                <option value="stargazing">stargazing</option>
                <option value="constellations">constellations</option>
                <option value="meteor-shower">meteor shower</option>
                <option value="milky-way">milky way</option>
                <option value="planets">planets</option>
                <option value="solar-eclipse">solar eclipse</option>
                    <option value="lunar-eclipse">lunar eclipse</option>
            </select>
            <br>
            <textarea class="edit-content"></textarea>
            <br>
            <label>Entry Date and Time</label>
            <br>
            <input class="edit-date-created" id="datetime" type="datetime-local">
            <br>
            <button class="submit-entry" name="save-btn" type="submit">Save Changes</button>	
        </form>`
    );

    /* existing data populates in edit entry form*/
    /* suer can edit fields with new information*/
    /*user hits save button, values are stored in a new entry object*/



    const entryTitle = $(".edit-entry-title").val();
    const eventType = $(".edit-event-type").val();
    const entryContent = $(".edit-content").val();
    const entryDate = $(".edit-date-created").val();
    
    const updatedEntry =  {
        title: entryTitle,
        eventType: eventType,
        content: entryContent,
        created: entryDate
    };
    console.log(updatedEntry);
    
    $.ajax({
        method: "PUT",
        url: "/entries/" + entryId, 
        // crossdomain: true,
        // headers: {"Access-Control-Allow-Origin": "*"},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(updatedEntry),
        success: function(data) {
            console.log("PUT request works");
            console.log(data);
            getAndDisplayEntries(data);
            /* should take user back to all-entries page with updated entry */
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
            getAndDisplayEntries();
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
    getAndDisplayEntries();
});