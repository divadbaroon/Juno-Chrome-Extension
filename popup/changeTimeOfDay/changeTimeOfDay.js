
document.addEventListener('DOMContentLoaded', function() {
    var changeTimeOfDay = document.getElementById('changeTimeOfDay');
    var changeTimeOfDayIcon = changeTimeOfDay.querySelector('img');

    // handles background time of day
    changeTimeOfDay.addEventListener('click', function() {
        if (timeOfDay == 'day') {
            timeOfDay = 'night'
            changeTimeOfDayIcon.src = "../images/moon2.png";
        }
        else if (timeOfDay == 'night') {
            timeOfDay = 'day'
            changeTimeOfDayIcon.src = "../images/sun3.png";
        }
        changeBackground()
    });
});