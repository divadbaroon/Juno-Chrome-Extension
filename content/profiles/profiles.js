

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('view-profile-button').addEventListener('click', function() {
        // Hide all profile tables initially
        document.querySelectorAll('.attribute-table').forEach(function(table) {
            table.style.display = 'none';
        });

        // Get the selected option's value
        var selectedProfile = document.getElementById('profile-selector').value;

        // Show the corresponding table
        if (selectedProfile === 'default') {
            document.getElementById('default-profile-table').style.display = 'table';
        }
        // Add else if conditions for other profiles
        // else if (selectedProfile === 'otherProfile') {
        //     document.getElementById('other-profile-table').style.display = 'table';
        // }
    });
});// Profile-related functionality}
