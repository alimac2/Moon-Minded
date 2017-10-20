"use strict"

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
            type: "POST",
            url: "/entries",
            dataType: "json",
            data: JSON.stringify(entryDetails),
            contentType: "application/json", 
            success: function(data) {
                console.log("function worked");
            }
        });     
    });
}

submitEntryData();
 
// function createNewEntry(entryDetails) {
//     $.ajax({
//         method: "POST",
//         url: "/entries",
//         dataType: "json",
//         data: JSON.stringify(entryDetails),
//         contentType: "application/json", 
//         success: function(data) {
//             console.log("function worked");
//         },
//     });
// }

// createNewEnry(submitEntryData());

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