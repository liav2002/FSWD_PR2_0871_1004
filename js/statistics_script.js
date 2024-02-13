document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const scores = JSON.parse(localStorage.getItem('scores'));
    const statisticsSection = document.getElementById('statistics-section');

    if (loggedInUser && users) {
        if (loggedInUser.admin === "true") {
            // Display all users, including blocked ones, and allow editing
            const userTable = createUserTable(users, scores, true);
            statisticsSection.appendChild(userTable);
        } else {
            // Display only unblocked users and hide block info
            const unblockedUsers = users.filter(user => user.block === "false");
            const userTable = createUserTable(unblockedUsers, scores, false);
            statisticsSection.appendChild(userTable);
        }
    } else {
        statisticsSection.innerHTML = '<p>User statistics not available.</p>';
    }
});

function createUserTable(users, scores, isAdmin) {
    const table = document.createElement('table');
    table.classList.add('user-table');

    // Create table header
    const headerRow = table.insertRow();
    headerRow.innerHTML = `<th>ID</th><th>Username</th><th>Email</th><th>Last Login</th><th>Total Scores</th>${isAdmin ? '<th>Block</th>' : ''}`;

    // Add user rows
    users.forEach(user => {
        const row = table.insertRow();
        row.innerHTML = `<td>${user.user_id}</td><td>${user.username}</td><td>${user.email}</td><td>${user['date-last-login']}</td><td>${calculateTotalScores(user.user_id, scores)}</td>${isAdmin ? `<td><input type="checkbox" ${user.block === "true" ? 'checked' : ''} onchange="toggleBlock(this, ${user.user_id})"></td>` : ''}`;
    });

    return table;
}

function calculateTotalScores(userId, scores) {
    let totalScores = 0;
    scores.forEach(score => {
        if (score.user_id === userId) {
            for (const game in score) {
                if (game !== 'user_id') {
                    totalScores += parseInt(score[game]) || 0;
                }
            }
        }
    });
    return totalScores;
}

function toggleBlock(checkbox, userId) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.user_id === userId);
    if (userIndex !== -1) {
        users[userIndex].block = checkbox.checked ? "true" : "false";
        localStorage.setItem('users', JSON.stringify(users));
    }
}

 // Logout functionality
 document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = './index.html';
});

