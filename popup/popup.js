

document.getElementById('toggleGuideButton').addEventListener('click', function() {
    var guide = document.getElementById('how-to');
    if (guide.style.display === 'none') {
        guide.style.display = 'block';
    } else {
        guide.style.display = 'none';
    }
});
