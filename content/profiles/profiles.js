document.addEventListener('DOMContentLoaded', function() {
    var filterDropdown = document.getElementById('filterDropdown');
    var searchInput = document.getElementById('searchInput');
    var profileCards = document.querySelectorAll('.profile-card');

    filterDropdown.addEventListener('change', function() {
        filterProfiles();
    });

    searchInput.addEventListener('input', function() {
        searchProfiles();
    });

    function filterProfiles() {
        var filterValue = filterDropdown.value;
        profileCards.forEach(card => {
            if (filterValue === 'all' || card.classList.contains(filterValue)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function searchProfiles() {
        var searchText = searchInput.value.toLowerCase();
        profileCards.forEach(card => {
            var cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchText)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});
