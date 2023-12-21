document.addEventListener('DOMContentLoaded', function() {
    var settingsButton = document.getElementById('settingsButton');
    var dropdownMenu = document.getElementById('dropdownMenu');
    var mainContent = document.querySelector('.main-content');

    // handles side bar
    settingsButton.addEventListener('click', function() {
        if (dropdownMenu.style.right === '0px') {
            dropdownMenu.style.right = '-210px'; // Hide menu
            mainContent.classList.remove('menu-open'); // Remove the push effect
        } else {
            dropdownMenu.style.right = '0px'; // Show menu
            mainContent.classList.add('menu-open'); // Add the push effect
        }
    });
});