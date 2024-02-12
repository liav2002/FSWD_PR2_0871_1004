// Function to check if anyone is logged in
function is_anyone_logged_in() {
    // Retrieve logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Check if there is a logged-in user
    if (loggedInUser) {
        // Redirect to games.html
        console.log("System recognize logged-in user.")
        window.location.href = './home.html';
    } else {
        console.log("System can't recognize logged-in user.")
    }
}

// Call the function to fetch and store data when needed
is_anyone_logged_in();

document.addEventListener('mousemove', function(event) {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    const color = 'rgb(' + (x * 255) + ',' + (y * 255) + ',150)';
    document.body.style.backgroundColor = color;
});

