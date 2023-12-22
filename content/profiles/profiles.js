sunImagePath = '../../images/sun3.png';
moonImagePath = '../../images/moon2.png';

document.addEventListener('DOMContentLoaded', function() {
    var filterDropdown = document.getElementById('filterDropdown');
    var searchInput = document.getElementById('searchInput');
    var profileCards = document.querySelectorAll('.profile-card');

    function adjustOpacityOnScroll() {
        var controlPanel = document.querySelector('.control-panel');
        var title = document.querySelector('.library-title');

        // Calculate the scroll percentage of the page
        var scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);

        // Set the opacity based on the scroll percentage
        // The opacity will be 1 at the top of the page and decrease as you scroll down
        var opacity = 1 - scrollPercentage * 4;

        // Clamp the opacity value between 0 and 1 to ensure it doesn't go beyond this range
        opacity = Math.max(0, Math.min(opacity, 1));

        // Apply the opacity to the control panel
        controlPanel.style.opacity = opacity;
        title.style.opacity = opacity;
    }
    
    window.addEventListener('scroll', adjustOpacityOnScroll);

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

});














