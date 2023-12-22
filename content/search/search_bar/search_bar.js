sunImagePath = '../../images/sun3.png';
moonImagePath = '../../images/moon2.png';

document.addEventListener('DOMContentLoaded', function() {
    var searchButton = document.getElementById('searchButton');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');

    // handles search results
    searchButton.addEventListener('click', function() {
        displaySearchResults();
    });

    function displaySearchResults() {
        var userInput = searchInput.value.trim();
        if (userInput) {
            searchResults.innerHTML = '<p>' + userInput + '</p>'; 
            searchResults.style.display = 'block'; 
        } else {
            searchResults.style.display = 'none'; 
        }
    }

    // hides search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchButton.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
});