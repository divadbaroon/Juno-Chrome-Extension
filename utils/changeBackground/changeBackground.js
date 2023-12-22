var currentDayBackgroundIndex = 0;
var currentNightBackgroundIndex = 0;
var timeOfDay = 'day';

var dayBackgrounds = ['../../images/light/beatiful.png', '../../images/light/dawg.png', '../../images/light/dawg2.png'];
var nightBackgrounds = ['../../images/dark/dark.png', '../../images/dark/dark1.png', '../../images/dark/dark3.png', 
    '../../images/dark/abstract.png', '../../images/dark/abstract2.png', '../../images/dark/abstract3.png'];


// changes background image
function changeBackground() {
    
    if (timeOfDay == 'day') {
        currentDayBackgroundIndex = (currentDayBackgroundIndex + 1) % dayBackgrounds.length;
        document.body.style.backgroundImage = 'url(' + dayBackgrounds[currentDayBackgroundIndex] + ')';
    }
    else if (timeOfDay == 'night') {
        currentNightBackgroundIndex = (currentNightBackgroundIndex + 1) % nightBackgrounds.length;
        document.body.style.backgroundImage = 'url(' + nightBackgrounds[currentNightBackgroundIndex] + ')';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var changeBackgroundButton = document.getElementById('imageButton');

    changeBackgroundButton.addEventListener('click', function() {
        changeBackground() 
    });

});






