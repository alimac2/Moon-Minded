"use strict"

function submitEntryData() {  
    $(".nav-link-create").click(function(event) {
        event.preventDefault();
        $(".new-entry-page").removeClass("hidden");
        $(".all-entries-page").addClass("hidden");
        $(".edit-entry-page").addClass("hidden");
        $(".landing-page").addClass("hidden");
    });
    
    $(".submit-entry").click(function() {
        event.preventDefault();

        const entryTitle = $(".entry-title").val();
        const eventType = $(".event-type").val();
        const entryContent = $(".content").val();
        const entryDate = $(".date-created").val();
        
        console.log(entryDate);

        const entryDetails =  {
            title: entryTitle,
            eventType: eventType,
            content: entryContent,
            created: entryDate
        };
        console.log(entryDetails);
        // console.log(created);

        $.ajax({
            method: "POST",
            url: "/entries",
            dataType: "json",
            data: JSON.stringify(entryDetails),
            contentType: "application/json", 
            success: function(data) {
                console.log("POST request works");
                $(".new-entry-page").addClass("hidden");
                $(".all-entries-page").removeClass("hidden");
                $(".entry-details")[0].reset(); /*clears form*/
                getEntriesData();
            }
        });     
    });
};

function clickGetAndDisplayEntries() {
    $(".nav-link-all").click(function(event) {
        event.preventDefault();
        $(".all-entries-page").removeClass("hidden");
        $(".new-entry-page").addClass("hidden");
        $(".landing-page").addClass("hidden");
        $(".edit-entry-page").addClass("hidden");
        $(".entry-details")[0].reset(); /*clears new entry form*/
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
            console.log("GET request works");
        }
    });
};

/* Displays entries with information added by user to the new entry form*/
function displayEntries(data) {
    $(".all-entries").empty();

    for (let i = 0; i < data.length; i++) {
    /* console.log(data); */
    /* console.log(i); */
        $(".all-entries-title").removeClass("hidden");
        $(".main-title").addClass("hidden");
        $(".about").addClass("hidden")
        $(".all-entries").append(
            `<div class="entry-display" id="${data[i].id}">
                <span class="entry-title display-title">${data[i].title}</span>
                <br>
                <span class="date-created">${data[i].created}</span>
                <br>
                <span class="event-display"><i>On this day I saw</i></span>
                <span class="event-type event-display"><i>${data[i].eventType}</i></span>
                <br>
                <span class="content">${data[i].content}</span>
                <br>
                <button class="entry-btn edit-btn">Edit</button>
                <button class="entry-btn delete-btn">Delete</button>
            </div>`
        );  
    };
};

function editEntryData(data) {
    $(".all-entries-page").on("click", ".edit-btn", function(event) {
        event.preventDefault();
        
        const entryId = $(this).parent().attr("id"); 
        console.log(entryId); 

        /* use .text() method because accessing data from <span> element from DOM not <input> element */
        const entryTitle = $(this).siblings(".entry-title").text();
        const eventType = $(this).siblings(".event-type").text();
        const entryContent = $(this).siblings(".content").text();
        const entryDate = $(this).siblings(".date-created").text();

        // console.log(entryTitle);
        // console.log(eventType);
        // console.log(entryContent);
        // console.log(entryDate);

        displayEditEntryForm(entryId, entryTitle, eventType, entryContent, entryDate); /* passing all these values to displayEditEntryForm function */
    });
};


function displayEditEntryForm(id, title, eventType, content, date) { 
    // console.log(id, title, eventType, content, date); /*all of these values come from editEntryDate function */

    $(".all-entries-page").addClass("hidden");
    $(".new-entry-page").addClass("hidden");
    $(".edit-entry-page").removeClass("hidden");
    
    /* using embedded expressions to populate data */
    $(".edit-entry-display").html(
        `<form class="edit-entry-form">
            <h2>Edit Entry</h2>
            <input class="edit-entry-title" type="text" placeholder="Entry Title" value="${title}">
            <input class="edit-entry-id" type="hidden" value="${id}">
            <br>
            <label>What did you see?</label>
            <br>
            <select class="edit-event-type">
                <option value="the moon">the moon</option>
                <option value="constellations">constellations</option>
                <option value="a meteor shower">a meteor shower</option>
                <option value="the milky way">the milky way</option>
                <option value="planets">planets</option>
                <option value="a solar eclipse">a solar eclipse</option>
                    <option value="a lunar eclipse">a lunar eclipse</option>
            </select>
            <br>
            <textarea rows="15" class="edit-content">${content}</textarea>
            <br>

            <button class="save-entry" name="save-btn" type="submit">Save Changes</button>	
        </form>`
    );
    $(".edit-event-type").val(eventType); /* grabbing value for the <select> element */
    $(".edit-date-created").val(date);
};    

/*2017-07-13T10:30*/

/* moment("YYYY-MM-DD HH:mm") */

/*  <label>When did it happen?</label>
    <br>
    <input class="edit-date-created" id="datetime" type="text" value="${date}">
    <br>
*/

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
    // console.log(updatedEntry);
    editEntry(updatedEntry);
}); 

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
            console.log("SUCCESS updatedEntry")
            getEntriesData();
            /* should take user back to all-entries page with updated entry */
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(updatedEntry);
        }
    });
};


function deleteEntry(){
    $(".all-entries").on("click", ".delete-btn", function(event) {
        event.preventDefault();
        
        const entryId = $(this).parent().attr("id"); 
        console.log(entryId);

        const deleteEntry =  $(this).closest('.entry-display');

        $.ajax({
            method: "DELETE",
            url: "/entries/" + entryId,
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
               deleteEntry.remove();
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