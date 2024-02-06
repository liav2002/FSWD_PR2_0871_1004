function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Retrieve users from local storage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the provided username and password match any user
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        if (user.block === "false") {
            // Update local storage with the logged-in user's data
            let loggedInUserData = {
                "user_id": user.user_id,
                "admin": user.admin,
                "date-last-login": new Date().toISOString()
            };

            // Record user details in local storage
            writeUserLoggedInData(loggedInUserData);

            // Update last login time in users
            user["date-last-login"] = loggedInUserData["date-last-login"];

            // Save updated users data to local storage
            localStorage.setItem('users', JSON.stringify(users));

            alert('Login successful!');

            // Redirect to home.html
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
