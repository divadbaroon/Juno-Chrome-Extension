
document.getElementById('toggleHubButton').addEventListener('click', function() {
    var hubContainer = document.querySelector('.hub-container');
    var extensionInteraction = document.querySelector('.extension-interaction');
    var toggleHubButton = document.getElementById('toggleHubButton'); 

    if (hubContainer.style.display === 'none' || !hubContainer.style.display) {
        hubContainer.style.display = 'block';
        extensionInteraction.style.display = 'block';
        toggleHubButton.style.display = 'none'; 

        hubContainer.style.marginTop = '60px'; 
        hubContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        hubContainer.style.display = 'none';
        extensionInteraction.style.display = 'none';
        toggleHubButton.style.display = 'block'; 

        document.body.scrollIntoView({ behavior: 'smooth' });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.hub-container').style.display = 'none'; 

    var searchInput = document.getElementById('searchInput');
    var dropdownContent = document.getElementById('dropdownContent');
    var items = ['Weather Retrieval', 'Music Control', 'Web Browser', 'News Rerieval']; 

    function showItems() {
        dropdownContent.innerHTML = ''; 
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.textContent = item;
            div.onclick = function() { selectItem(item); };
            dropdownContent.appendChild(div);
        });
        dropdownContent.style.display = 'block';
    }

    function selectItem(item) {
        console.log('Selected:', item);
        dropdownContent.style.display = 'none';
    }

    searchInput.addEventListener('click', showItems);

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
});

let selectedValues = ['Basic', 'Personalization']; 


document.addEventListener('DOMContentLoaded', () => {
    updateSelectedItemsDisplay();
});

function updateSelectedItemsDisplay() {
    const container = document.querySelector('.selected-items');
    container.innerHTML = ''; 
    selectedValues.forEach((value) => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.textContent = value;
        const removeBtn = document.createElement('span');
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            selectedValues = selectedValues.filter((val) => val !== value);
            updateSelectedItemsDisplay(); 
        };
        item.appendChild(removeBtn);
        container.appendChild(item);
    });
}

