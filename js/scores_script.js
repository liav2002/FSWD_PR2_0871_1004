// Function to show a specific tab and hide others
function showTab(tabName) {
    const tabs = ['totalPoints', 'ticTacToe', 'flappyBird'];

    tabs.forEach(tab => {
        const tabElement = document.getElementById(tab + 'Tab');
        const tabButton = document.getElementById(tab + 'Button');

        if (tab === tabName) {
            tabElement.style.display = 'block';
            tabButton.style.backgroundColor = '#333';
        } else {
            tabElement.style.display = 'none';
            tabButton.style.backgroundColor = '#4caf50';
        }
    });

    if (tabName === 'totalPoints') {
        displayTotalPoints();
    } else {
        displayGameScores(tabName);
    }
};

// Function to display total points
function displayTotalPoints() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    const totalPointsList = document.getElementById('totalPointsList');
    totalPointsList.innerHTML = '';

    users.forEach(user => {
        if (user.block == "false")
        {
            const userScore = scores.find(score => score.user_id === user.user_id);
            const totalPoints = userScore ? calculateTotalPoints(userScore) : 0;
    
            const listItem = document.createElement('li');
            listItem.innerText = `${user.username}: ${totalPoints} points`;
            totalPointsList.appendChild(listItem);
        }
    });

    // Sort the list by points in descending order
    sortAndDisplay(totalPointsList);
}

// Function to display game scores (tic tac toe, flappy bird, etc.)
function displayGameScores(gameKey) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    const gameScoresList = document.getElementById(gameKey + 'List');
    gameScoresList.innerHTML = '';

    users.forEach(user => {
        if (user.block == "false")
        {
            const userScore = scores.find(score => score.user_id === user.user_id);
            let gameScore = 0;
    
            // Try to retrived the relevant score
            if (userScore) {
                if (gameKey === "ticTacToe" && userScore.hasOwnProperty("tictactoe_score")) {
                    gameScore = userScore.tictactoe_score;
                } else if (gameKey === "flappyBird" && userScore.hasOwnProperty("flappy_score")) {
                    gameScore = userScore.flappy_score;
                }
            }
    
            const listItem = document.createElement('li');
            listItem.innerText = `${user.username}: ${gameScore} points`;
            gameScoresList.appendChild(listItem);
        }
    });

    // Sort the list by points in descending order
    sortAndDisplay(gameScoresList);
}

// Helper function to calculate total points for a user
function calculateTotalPoints(userScore) {
    let totalPoints = 0;

    for (const key in userScore) {
        if (key !== 'user_id') {
            totalPoints += userScore[key];
        }
    }

    return totalPoints;
}

// Helper function to sort and display the list
function sortAndDisplay(list) {
    const sortedList = Array.from(list.children)
        .sort((a, b) => {
            const pointsA = parseInt(a.innerText.split(': ')[1]);
            const pointsB = parseInt(b.innerText.split(': ')[1]);
            return pointsB - pointsA;
        });

    list.innerHTML = '';
    sortedList.forEach(item => list.appendChild(item));
}

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve loggedInUser from local storage
    const loggedInUserString = localStorage.getItem('loggedInUser');

    // Check if loggedInUser does not exist in local storage
    if (!loggedInUserString) {
        // Redirect to index.html
        window.location.href = './index.html';
    }

    showTab('totalPoints'); // Show the default tab
});

 // Logout functionality
 document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear loggedInUser from local storage
    localStorage.removeItem('loggedInUser');
    // Redirect to index.html after logout
    window.location.href = './index.html';
});
