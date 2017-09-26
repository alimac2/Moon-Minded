const MOCK_ENTRY = {
    "journalEntries": [
        {
            "id": "1111",
            "title": "Milky Way at the Beach",
            "eventType": "milky way",
            "content": "On a drive up to the beach with my sisters we saw the most brilliant night sky. The stars blanketed the entire sky and the milky way was so vivid."
        },
        {
            "id": "2222",
            "title": "First Solar Eclipse",
            "eventType": "solar eclipse",
            "content": "Viewing the eclipse was one of the most spectacular natural phenomenons I have ever witnessed. I get goosebumps just thinking about it. It was so brief yet so memorable. The thrill I felt while watching it is hard to explain."
        },
        {
            "id": "3333",
            "title": "Falling Sky",
            "eventType": "meteor shower",
            "content": "Have you ever looked at the night sky and thought to yourself, 'Shit, the starts are falling'? Tonight that's exactly what went through my mind. The number of meteors crossing the sky at one time was unbelievable. I was mesmerized."
        }
    ]
};

function getEntries(callbackFn) {
    $.ajax({
        method: "GET",
        url: ENTRIES, /* fill in with valid url */
        dataType: "json",
        success: success, /*function with data as param*/
        contentType: 
    });
}

function displayEntries(data) {
    for (index in data.journalEntries) {
        $("body").append(
            "<p>" + data.journalEntries[index].content + "</p>");  
        }
}

function getAndDisplayEntries() {
    getEntries(displayEntries);
}

$(function() {
    getAndDisplayEntries();
})