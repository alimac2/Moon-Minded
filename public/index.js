"use strict"


/* global variable called state. State is where you start off.  */

function submitEntryData() {  
      /* ---- CLICK EVENTS TO HIDE AND SHOW PAGES --- */
    $(".nav-link-create").click(function(event) {
        event.preventDefault();
        $(".new-entry-page").removeClass("hidden");
        $(".all-entries-page").addClass("hidden");
        $(".landing-page").addClass("hidden");
    });
    
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
                $(".new-entry-page").addClass("hidden");
                $(".all-entries-page").removeClass("hidden");
                getEntriesData();
            }
        });     
    });
};


/*REVIEW THIS CODE - every time the user clicks on the All Entries link, the AJAX GET request runs. This causes the entries to populate every time user clicks on link*/
function clickGetAndDisplayEntries() {
    $(".nav-link-all").click(function(event) {
        event.preventDefault();
        $(".all-entries-page").removeClass("hidden");
        $(".new-entry-page").addClass("hidden");
        $(".landing-page").addClass("hidden");
        getEntriesData();
    });
};

function getEntriesData() { 
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

function getEntriesDataById() { 
     const entryId = $(this).parent().attr("id"); 

    $.ajax({
        method: "GET",
        url: "/entries" + entryId, 
        dataType: "json",
        contentType: "application/json", 
        success: function(data) {
            // console.log(data);
            
            console.log("GET request works");
        }
    });
};

function displayEntries(data) {
    $(".all-entries").empty();

    for (let i = 0; i < data.length; i++) {
    // console.log(data);
    // console.log(i);
        $(".all-entries-title").removeClass("hidden");
        $(".main-title").addClass("hidden");
        $(".about").addClass("hidden")
        $(".all-entries").append(
            `<div class="entry-display" id="${data[i].id}">
                <span class="entry-title display-title">${data[i].title}</span>
                <br>
                <span class="date-created">${data[i].created}</span>
                <br>
                <span class="event-type">${data[i].eventType}</span>
                <br>
                <span class="content">${data[i].content}</span>
                <br>
                <button class="entry-btn edit-btn">Edit</button>
                <button class="entry-btn delete-btn">Delete</button>
            </div>`
        );  
    };
};

/* 
- click edit button 
- grab values from existing entry (entry comes from a div parent with span children)
-
*/

function editEntryData(data) {
    $(".all-entries-page").on("click", ".edit-btn", function(event) {
        event.preventDefault();
        
        const entryId = $(this).parent().attr("id"); 
        console.log(entryId); 

        const entryTitle = $(this).siblings(".entry-title").val();
        const eventType = $(this).siblings(".date-created").val();
        const entryContent = $(this).siblings(".event-type").val();
        const entryDate = $(this).siblings(".content").val();
/* this gets values of updated info. still need to extract existing data. */

        console.log(entryTitle);
        console.log(eventType);
        console.log(entryContent);
        console.log(entryDate);

        // displayEditEntryForm();
    });
};
/* will need to return values and pass them all somehow*/


function displayEditEntryForm() {  
    $(".all-entries-page").addClass("hidden");
    $(".new-entry-page").addClass("hidden");
    $(".edit-entry-page").removeClass("hidden");

/* entryId is not defined now that I have two separate functions */
    $(".edit-entry-display").html(
        `<form class="edit-entry-form">
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
            <button class="save-entry" name="save-btn" type="submit">Save Changes</button>	
        </form>`
    );
};    
/*  should go in line 154   <input class="edit-entry-id" type="hidden" value="${entryId}">*/ 

$(document).on("submit",".edit-entry-form", function(event) {
    event.preventDefault();
    $(".edit-entry-page").addClass("hidden");
    $(".all-entries-page").removeClass("hidden");

    const updatedEntryId = $(".edit-entry-id").val();
    const entryTitle = $(".edit-entry-title").val();
    const eventType = $(".edit-event-type").val();
    const entryContent = $(".edit-content").val();
    const entryDate = $(".edit-date-created").val();
    
    const updatedEntry =  {
        id: updatedEntryId,
        title: entryTitle,
        eventType: eventType,
        content: entryContent,
        created: entryDate
    };
    console.log(updatedEntry);
    editEntry(updatedEntry);
}); 
/* look at editEntry - same idea for click edit btn*/

function editEntry(updatedEntry) {  
    $.ajax({
        method: "PUT",
        url: "/entries/" + updatedEntry.id, 
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(updatedEntry),
        success: function(data)  {
            console.log("PUT request works");
            console.log(data);
            getEntriesData();
            /* should take user back to all-entries page with updated entry */
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};


function deleteEntry(){
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
                /*function handleDelete () {
                 remove deleted item from DOM 
                 keep existing entries visible on page
                };*/
                getEntriesData(); /*data displays without deleted item, but previous entries remain on page*/
                console.log("DELETE request works");
            } 
        });
    });
};


/* document ready - when the page loads*/
$(function() {
    submitEntryData();
    clickGetAndDisplayEntries();
    deleteEntry();
    editEntryData();
});