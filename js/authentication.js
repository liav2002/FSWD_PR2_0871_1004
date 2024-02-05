function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the provided username and password match any user
    var user = users.find(u => u.username === username && u.password === password);

    if (user) {
        if (user.block === "false") {
            // Update local storage with the logged-in user's data
            const loggedInUserData = {
                "user_id": user.user_id,
                "date-last-login": new Date().toISOString()
            };

            // Record user details in local storage
            writeUserLoggedInData(loggedInUserData);

            alert('Login successful!');

            // redirect to home.html
            window.location.href = './home.html';

        } else {
            alert('Account is blocked. Contact support.');
        }
    } else {
        alert('Invalid username or password.');
    }
}

// Function to write data to local storage
function writeUserLoggedInData(loggedInUserData) {
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUserData));
}
