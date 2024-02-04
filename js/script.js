function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Change the URL slightly in your JavaScript file to ensure that the browser treats it as a new request
    const jsonFilePath = 'http://localhost:8000/data/Users.json?v=' + new Date().getTime();
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(users => {
            // Check if the provided username and password match any user
            var user = users.find(u => u.username === username && u.password === password);

            if (user) {
                console.log(user.block)
                if (user.block === "false") {
                    alert('Login successful!');
                    // You may redirect the user to another page or perform additional actions here
                } else {
                    alert('Account is blocked. Contact support.');
                }
            } else {
                alert('Invalid username or password.');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}
