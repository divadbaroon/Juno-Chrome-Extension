document.addEventListener('DOMContentLoaded', function() {
    var exampleProfileLink = document.getElementById('example-profile-link');
    if (exampleProfileLink) {
        exampleProfileLink.addEventListener('click', function() {
            toggleTable();
        });
    }

    function toggleTable() {
        var table = document.getElementById("profile-table");
        if (table.style.display === "none" || table.style.display === "") {
            table.style.display = "table";
        } else {
            table.style.display = "none";
        }
    }
});
