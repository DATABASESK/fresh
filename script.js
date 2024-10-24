const apiUrl = 'https://final-rj4x.onrender.com/netflix'; // Your API URL

let allSeries = [];
let currentSeries = null;

// Fetch series data when the page loads
window.onload = function() {
    fetchSeriesData();
};

function fetchSeriesData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allSeries = data;
            displaySeries(allSeries); // Display all series on initial load
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displaySeries(seriesList) {
    const container = document.getElementById('series-container');
    container.innerHTML = ''; // Clear previous content

    seriesList.forEach(series => {
        const seriesItem = document.createElement('div');
        seriesItem.className = 'series-item';

        const image = document.createElement('img');
        image.src = series.uri;
        seriesItem.appendChild(image);

        const name = document.createElement('p');
        name.textContent = series.name;
        seriesItem.appendChild(name);

        // Click event to show episodes
        seriesItem.onclick = () => displayEpisodes(series);

        container.appendChild(seriesItem);
    });
}

function displayEpisodes(series) {
    currentSeries = series; // Store the current series
    const container = document.getElementById('series-container');
    container.innerHTML = ''; // Clear previous content

    // Create a new div for the layout
    const layout = document.createElement('div');
    layout.className = 'episode-layout';

    // Create and add the poster image
    const posterImage = document.createElement('img');
    posterImage.src = series.uri; // Use the series poster image
    posterImage.className = 'poster-image'; // Add a class for styling
    layout.appendChild(posterImage);

    // Create and add the episodes list
    const episodeListContainer = document.createElement('div');
    episodeListContainer.className = 'episode-list-container';
    const episodeHeader = document.createElement('h2');
    episodeHeader.textContent = series.name;
    episodeListContainer.appendChild(episodeHeader);

    const episodeList = document.createElement('ul');
    episodeList.className = 'episode-list';

    series.videos.forEach(video => {
        const episodeItem = document.createElement('li');
        episodeItem.className = 'episode-item';
        episodeItem.textContent = video.title;

        // Click event to play the video
        episodeItem.onclick = () => playVideo(video.link);

        episodeList.appendChild(episodeItem);
    });

    episodeListContainer.appendChild(episodeList);
    layout.appendChild(episodeListContainer); // Add the episodes list to the layout

    container.appendChild(layout); // Add the layout to the main container

    // Push the current state to the history stack
    window.history.pushState({ previousPage: 'episodes' }, '', '');
}

function playVideo(link) {
    window.open(link, '_blank'); // Open video in a new tab
}

// Search series by name
function searchSeries() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredSeries = allSeries.filter(series =>
        series.name.toLowerCase().includes(query)
    );
    displaySeries(filteredSeries);
}

// Handle back navigation
window.onpopstate = function(event) {
    if (event.state && event.state.previousPage === 'episodes') {
        displaySeries(allSeries); // Go back to the series list
        currentSeries = null; // Reset current series
    }
};

// Keyboard shortcut for back navigation (Escape key)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (currentSeries) {
            displaySeries(allSeries); // Go back to series list
            currentSeries = null; // Reset current series
        }
    }
});
