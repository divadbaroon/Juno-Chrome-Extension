var currentDayBackgroundIndex = 0;
var currentNightBackgroundIndex = 0;
var timeOfDay = 'day';


// changes background image
function changeBackground() {
    var dayBackgrounds = ['../images/day/clouds.png', '../images/day/wow.png', '../images/day/pretty_clouds.png'];
    var nightBackgrounds = ['../images/night/night_sky.png', '../images/night/night_sky3.png', '../images/night/night_sky4.png', '../images/night/night_sky5.png'];
    
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






