document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const profileDetails = document.getElementById('profile-details');

    if (loggedInUser && users) {
        const user = users.find(u => u.user_id === loggedInUser.user_id);
        if (user) {
            const userDetails = `
                <p><strong>User ID:</strong> ${user.user_id}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Last Login:</strong> ${loggedInUser['date-last-login']}</p>
            `;
            profileDetails.innerHTML = userDetails;
        } else {
            profileDetails.innerHTML = '<p>User not found.</p>';
        }
    } else {
        profileDetails.innerHTML = '<p>User details not available.</p>';
    }
});
