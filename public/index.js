"use strict"

/* click on creating new entry
eventPreventDefault()
pull values of data .val()
POST AJAX request when click happens */

function submitEntry() {
    $(".submit-entry").submit(event => {
        event.preventDefault();
        const entryTitle = $("entry-title").val(); 
        console.log(entryTitle);
    });
}


// $.ajax({
//     method: POST,
//     url: "/entries",
//     dataType: "json",
//     data: JSON.stringify({

//     }), /* type in data object - how is javascript connecting to html*/
//     contentType: "application/json", 
//     crossDomain: true, /* may not need for each endpoint - check */
//     success: function(data) {
//         console.log("function worked");
//     },
// });


// function getEntries(callbackFn) {
//     $.ajax({
//         method: "GET",
//         url: "/entries", 
//         dataType: "json",
//         success: function(data) {},
//         contentType: 
//     });
// }

// function updateEntries(callbackFn) {
//     $.ajax({
//         method: "PUT",
//         url: "/entries", 
//         data: data,
//         success: function(data) {},
//     });
// }

// function displayEntries(data) {
//     for (index in data.journalEntries) {
//         $("body").append(
//             "<p>" + data.journalEntries[index].content + "</p>");  
//         }
// }

// function getAndDisplayEntries() {
//     getEntries(displayEntries);
// }

// $(function() {
//     getAndDisplayEntries();
// })