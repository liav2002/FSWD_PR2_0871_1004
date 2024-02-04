function saveLocalStorageToFile() {
    // Retrieve data from local storage
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = JSON.parse(localStorage.getItem(key));
    }

    // Convert the data to JSON
    const jsonData = JSON.stringify(localStorageData, null, 2);

    // Save the JSON data to a file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'localStorageData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log('localStorage data saved to local JSON file.');
}

async function loadLocalStorage() {
    const url = 'http://localhost:8000/data/localStorageData.json';
    
    try {
        // Fetch JSON data from the provided URL
        const response = await fetch(url);

        // Check if the response is successful (status code 200-299)
        if (response.ok) {
            // Parse the JSON data
            const jsonData = await response.json();

            // Loop through each key in the parsed data
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    // Get the value for the current key
                    const value = jsonData[key];

                    // Store the value in localStorage
                    localStorage.setItem(key, JSON.stringify(value));
                }
            }

            console.log('localStorage items loaded from JSON.');
        } else {
            console.error('Error fetching JSON data. Status:', response.status);
        }
    } catch (error) {
        console.error('Error loading localStorage from URL:', error);
    }

    is_anyone_logged_in();
}

// Function to check if anyone is logged in
function is_anyone_logged_in() {
    // Retrieve logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Check if there is a logged-in user
    if (loggedInUser && loggedInUser.user_id) {
        // Redirect to games.html
        console.log("System recognize logged-in user.")
        window.location.href = './home.html';
    } else {
        console.log("System can't recognize logged-in user.")
    }
}

// Call the function to fetch and store data when needed
is_anyone_logged_in();
