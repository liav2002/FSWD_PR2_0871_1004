function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the provided username and password match any user
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        if (user.block === "false") {
            let loggedInUserData = {
                "user_id": user.user_id,
                "admin": user.admin,
                "date-last-login": new Date().toISOString()
            };

            writeUserLoggedInData(loggedInUserData);

            user["date-last-login"] = loggedInUserData["date-last-login"];
            localStorage.setItem('users', JSON.stringify(users));

            alert('Login successful!');

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
