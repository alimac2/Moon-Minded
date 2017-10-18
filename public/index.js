"use strict"



// function submitEntry() {
$(".submit-entry").click(function() {
    event.preventDefault();
    
    const entryTitle = $(".entry-title").val();
    const eventType = $(".event-type").val();
    const entryContent = $(".content").val();
    const entryDate = $(".date-created").val();
      
    $.ajax({
        method: "POST", /* added quotes to make a string */
        url: "/entries",
        dataType: "json",
        data: JSON.stringify({
            title: entryTitle,
            eventType: eventType,
            content: entryContent,
            created: entryDate
        }),
        contentType: "application/json", 
        crossDomain: true, /* may not need for each endpoint - check */
        success: function(data) {
            console.log("function worked");
        },
    });
});
// }
/* how is javascript connecting to html*/




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