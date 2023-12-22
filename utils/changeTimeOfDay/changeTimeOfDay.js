sunImagePath = '../images/sun3.png';
moonImagePath = '../images/moon2.png';

document.addEventListener('DOMContentLoaded', function() {
    var changeTimeOfDay = document.getElementById('changeTimeOfDay');
    var changeTimeOfDayIcon = changeTimeOfDay.querySelector('img');

    // handles background time of day
    changeTimeOfDay.addEventListener('click', function() {
        if (timeOfDay == 'day') {
            timeOfDay = 'night'
            changeTimeOfDayIcon.src = moonImagePath;
        }
        else if (timeOfDay == 'night') {
            timeOfDay = 'day'
            changeTimeOfDayIcon.src = sunImagePath;
        }
        changeBackground()
    });
});