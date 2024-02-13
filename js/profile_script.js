document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const profileDetails = document.getElementById('profile-details');

    if (loggedInUser && users) {
        const user = users.find(u => u.user_id === loggedInUser.user_id);
        if (user) {
            const userDetails = `
                <div class="profile-detail">
                    <label>User ID:</label>
                    <span>${user.user_id}</span>
                </div>
                <div class="profile-detail">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="profile-detail">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="profile-detail">
                    <label>Last Login:</label>
                    <span>${loggedInUser['date-last-login']}</span>
                </div>
            `;
            profileDetails.innerHTML = userDetails;
        } else {
            profileDetails.innerHTML = '<p>User not found.</p>';
        }
    } else {
        profileDetails.innerHTML = '<p>User details not available.</p>';
    }
});

 // Logout functionality
 document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
});