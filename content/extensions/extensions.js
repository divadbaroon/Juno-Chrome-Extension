
document.getElementById('view-button').addEventListener('click', function() {
    // Hide all tables initially
    document.querySelectorAll('.attribute-table').forEach(function(table) {
        table.style.display = 'none';
    });

    // Get the selected option's value
    var selectedOption = document.getElementById('extension-selector').value;

    // Show the corresponding table
    if (selectedOption === 'basic') {
        document.getElementById('basic-table').style.display = 'table';
    } else if (selectedOption === 'personalization') {
        document.getElementById('personalization-table').style.display = 'table';
    } else if (selectedOption === 'assistant') {
        document.getElementById('assistant-table').style.display = 'table';
    }
});

