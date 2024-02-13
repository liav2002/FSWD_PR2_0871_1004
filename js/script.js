function is_anyone_logged_in() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        console.log("System recognize logged-in user.")
        window.location.href = './home.html';
    } else {
        console.log("System can't recognize logged-in user.")
    }
}

document.addEventListener('DOMContentLoaded', function () {
    is_anyone_logged_in();
});