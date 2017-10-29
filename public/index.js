"use strict"


/* global variable called state. State is where you start off.  */


function submitEntryData() {  
      /* ---- CLICK EVENTS TO HIDE AND SHOW PAGES --- */
    $(".nav-link-create").click(function() {
        event.preventDefault();
        $(".new-entry-page").removeClass("hidden");
        $(".all-entries-page").addClass("hidden");
        $(".landing-page").hide();
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
    $(".nav-link-all").click(function() {
        event.preventDefault();
        $(".all-entries-page").removeClass("hidden");
        $(".new-entry-page").addClass("hidden");
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

// function displayPutEntries(data) {
//     for (let i = 0; i < data.length; i++) {
//     // console.log(data);
//     // console.log(i);
//         $(".all-entries-title").removeClass("hidden");
//         $(".main-title").addClass("hidden");
//         $(".about").addClass("hidden")
//         $(".all-entries").append(
//             `<div class="entry-display" id="${data[i].id}">
//                 <button class="entry-btn edit-btn">Edit</button>
//                 <button class="entry-btn delete-btn">Delete</button>
//                 <span>${data[i].created}</span>
//                 <span>${data[i].title}</span>
//             </div>`
//         );  
//     };
// };
/*populate edit entry div with edited info */


$(".all-entries-page").on("click", ".edit-btn", function(event) {
    event.preventDefault();
    
    const entryId = $(this).parent().attr("id"); 
    console.log(entryId); 

    getEntriesDataById(entryId);

    /*click on all entries and click on edit it calls get data entries*/

    
    $(".all-entries-page").addClass("hidden");
    $(".new-entry-page").addClass("hidden");
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
        id: entryId,
        title: entryTitle,
        eventType: eventType,
        content: entryContent,
        created: entryDate
    };
    console.log(updatedEntry);
});    

function editEntry() {  
    $.ajax({
        method: "PUT",
        url: "/entries/" + entryId, 
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(updatedEntry),
        success: function(data) {
            console.log("PUT request works");
            console.log(data);
            getEntriesData();
            /* should take user back to all-entries page with updated entry */
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
});