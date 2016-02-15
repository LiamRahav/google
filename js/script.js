$(function() {
    $('#search-box').typed({
        strings: ["anything", "people", "places", "news", "pictures", "apps", "websites", "events", "products", "flights", "things", "cat videos"],
        loop: true,
        typeSpeed: 25,
        backSpeed: 25,
        backDelay: 1000,
        shuffle: true,
        attr: 'placeholder'
    });
});


urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
currentPlaceholder = 0;
showSuggestions = false;

function suggest(data) {
    if (showSuggestions) {
        if ($('#suggestions').css('display') === 'none') {
            $('#suggestions').css('opacity', 1);
        }

        console.log(data);
        var suggestLength = data[1].length;
        if (suggestLength > 5) suggestLength = 5;


        $('#suggestions').html("");
        for (var i = 1; i <= suggestLength; i++) {
            $('#suggestions').append("<span>" + data[1][i][0] + "</span>");
        }
    }
}

var suggestTimeout = setTimeout(function() {}, 500);

$('#search-box').on('keyup', function(e) {
    if (e.keyCode === 40) {
        $('#search-box').val($('#suggestions').text());
        $('#suggestions').css('opacity', 0);
    } else {
        clearTimeout(suggestTimeout);

        var query = $('#search-box').val();

        if (query.match(urlRegex) && query.indexOf("?") !== 0) {
            $('#search').addClass('url');
        } else {
            $('#search').removeClass('url');
        }

        if (query === "") {
            $('#suggestions').css('opacity', 0);
            showSuggestions = false;
        } else {
            showSuggestions = true;
            $('#suggestions').css('opacity', 1);

            suggestTimeout = setTimeout(function() {
                $.getJSON("http://suggestqueries.google.com/complete/search?callback=?", {
                    "hl": "en", // Language
                    "jsonp": "suggest", // jsonp callback function name
                    "q": query, // query term
                    "client": "youtube" // force youtube style response, i.e. jsonp
                });
            }, 100);
        }
    }
});

$('#search').submit(function(e) {
    $('#search').fadeOut(function() {
        var query = $('#search-box').val();

        if (query.match(urlRegex) && query.indexOf("?") !== 0) {
            window.location = query;
            return false;
        }

        if (query.indexOf("?") === 0) {
            query = query.substring(1);
        }

        window.location = "https://google.com/#q=" + encodeURIComponent(query);
    });
    return false;
});