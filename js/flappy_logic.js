document.addEventListener('DOMContentLoaded', function() {
  
  // #region Buttons and Canvas Setup
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const playAgainButton = document.getElementById('playAgainButton');
  const quitButton = document.getElementById('quitButton');
  // #endregion

  // #region Constants
  const gravity = 0.25;
  let pipeFrequency = 1000; // in ms, to control pipe appearance speed
  let pipes = [];
  const TEXT_COLOR = 'white';
  const windWidth = 1280;
  const windHeight = 600;
  canvas.width = windWidth;
  canvas.height = windHeight;
  // #endregion

  //#region Game Sound
  const flapSound = new Audio('../audio/flapsound.mp3');
  const backgroundMusic = new Audio('../audio/backsound.mp3');
  backgroundMusic.loop = true;
  const crashSound = new Audio('../audio/crashsound.mp3');
  //#endregion

  // #region Game Assets
  const bird_img = new Image();
  bird_img.src = '../images/flappy/bird.png';
  const top_p_img = new Image();
  top_p_img.src = '../images/flappy/pipe_top.png'; 
  const bottom_p_img = new Image();
  bottom_p_img.src = '../images/flappy/pipe_bottom.png';
  const  bg_img = new Image();
  bg_img.src = '../images/flappy/back.png';
  // #endregion
  
  // Authentication and score handling
  const loggedInUserString = localStorage.getItem('loggedInUser');
    if (!loggedInUserString) {
        window.location.href = '../index.html'; // Redirect if not logged in
    }
    const loggedInUser = JSON.parse(loggedInUserString);
    const loggedInUserId = loggedInUser.user_id;

    // Initialize or load scores
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    let userScoreIndex = scores.findIndex(score => score.user_id === loggedInUserId);
    if (userScoreIndex === -1) {
        // User record not found, initialize a new one
        const newUserScore = { user_id: loggedInUserId, flappy_score: 0 };

        // Save the new user score to the scores array
        scores.push(newUserScore);

        // Update user's score index
        userScoreIndex = scores.findIndex(score => score.user_id === loggedInUserId);
    } else {
        // User record found, ensure flappy_score is present
        if (!scores[userScoreIndex].hasOwnProperty('flappy_score')) {
            scores[userScoreIndex].flappy_score = 0;
        }
    }

    // Save updated scores to local storage
    localStorage.setItem('scores', JSON.stringify(scores));

    const h1 = document.querySelector('h1');
    const bestScoreContainer = document.createElement('div');
    bestScoreContainer.id = 'bestScoreContainer';
    bestScoreContainer.innerHTML = 'Best Score: <span id="bestScore">0</span>';
    bestScoreContainer.style.color = 'skyblue';
    bestScoreContainer.style.textAlign = 'center'; 
    bestScoreContainer.style.fontSize = '20px';
    bestScoreContainer.style.paddingBottom = '15px';
    h1.insertAdjacentElement('afterend', bestScoreContainer);

    // Display existing best score
    const bestScoreSpan = document.getElementById('bestScore');
    bestScoreSpan.textContent = scores[userScoreIndex].flappy_score;

  class Bird {
      constructor() {
          this.width = 30;
          this.height = 40;
          this.velocity = 0;
          this.flapPower = -5.7; // Flap force
          this.y = canvas.height / 2 - this.height / 2;
          this.x = 40;
      }

      position() {
          this.velocity += gravity;
          this.y += this.velocity;
          if (this.y < 0) {
              this.y = 0;
              this.velocity = 0;
          } else if (this.y + this.height > canvas.height) {
              this.y = windHeight - this.height;
              this.velocity = 0;
          }
      }

      draw() {
          ctx.drawImage(bird_img, this.x, this.y, this.width, this.height);
      }

      flap() {
          this.velocity = this.flapPower;
          flapSound.play();
      }

      checkCollision(obstacle) {
          const inXRange = this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x;
          const inYRange = this.y < obstacle.y + obstacle.height && this.y + this.height > obstacle.y;
          return inXRange && inYRange;
      }

      reset() {
          this.x = 40;
          this.y = windHeight / 2 - this.height / 2;
          this.velocity = 0;
      }
  }

  class Pipes {
      constructor(topp,gap) {
          this.x = canvas.width;
          this.gap = Math.floor(Math.random() * 31) + gap; // Random gap between pipes
          this.top = topp;
          this.bottom = windHeight - this.top - this.gap;
          this.width = 80; // Pipe width
          this.scored = false;
      }

      move(velocity) {
          this.x -= velocity;
      }

      draw() {
          ctx.drawImage(top_p_img, this.x, 0, this.width, this.top);
          ctx.drawImage(bottom_p_img, this.x, this.top + this.gap, this.width, this.bottom);
      }
  }

  class Game {
    constructor() {
        this.gameOver = false;
        this.bird = new Bird();
        this.score = 0;
        this.start = true;
        this.pipeFreq = pipeFrequency;
        this.lastPipe = Date.now() - pipeFrequency;
        this.loop = this.loop.bind(this);
        this.hard = false;
        this.easy = false;
        this.speed = 3.5;
        this.target = 5;
    }

    drawText(text, x, y) {
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = '50px Arial';
        const textWidth = ctx.measureText(text).width;
        const centeredX = (canvas.width - textWidth) / 2; 
        ctx.fillText(text, centeredX, y); 
    
    }

    collisions() {
        for (const pipe of pipes) {
            if (this.bird.checkCollision({x: pipe.x, y: 0, width: pipe.width, height: pipe.top}) ||
                this.bird.checkCollision({x: pipe.x, y: pipe.top + pipe.gap, width: pipe.width, height: pipe.bottom})) {
                crashSound.play();
                return true;
            }
        }
        return this.bird.y <= 0 || this.bird.y + this.bird.height >= windHeight;
    }

    loop() {
        ctx.clearRect(0, 0, windWidth, windHeight);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg_img, 0, 0, canvas.width, canvas.height);
        

        if (!this.gameOver && !this.start) {
            this.bird.position();
            const now = Date.now();
            this.pipeFreq = Math.floor(Math.random() * (3000 - 600 + 1)) + 600;
            if (now - this.lastPipe > this.pipeFreq) {
                const pipeHeight = Math.floor(Math.random() * (150 + 1) + 200);
                let pipe_gap = (this.hard)? 110:150;
                if(this.easy) {pipe_gap = 190;}
                pipes.push(new Pipes(pipeHeight,pipe_gap));
                this.lastPipe = now;

            }
            if(this.target<=50){
                if(this.score>=this.target){
                    this.speed +=0.3;
                    this.target+=5;
               }
            }
            pipes.forEach(pipe => {
                pipe.move(this.speed);
                if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
                  if(this.hard){
                    this.score+=3;
                  }
                  else if(this.easy){
                    this.score++;
                  }
                  else{
                    this.score+=2;
                  }
                  pipe.scored = true;
              }
            });
            pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
            this.gameOver = this.collisions();
        }

        pipes.forEach(pipe => {
            pipe.draw();
        });

        this.bird.draw();
        this.drawText(`Score: ${this.score}`, 20, 50);

        if (this.start) {
            this.drawText('Click to start.', windWidth / 4, windHeight / 2);
        }

        if (this.gameOver) {
            backgroundMusic.pause();
            this.showGameOverScreen();
            return;
        }

        requestAnimationFrame(this.loop);

        
    }

    startBackgroundMusic() {
        backgroundMusic.play();
    }

    reset() {
        this.bird.reset();
        pipes = [];
        this.score = 0;
        this.start = true;
        this.gameOver = false;
        this.pipeFreq =pipeFrequency;
        this.lastPipe = Date.now() - pipeFrequency;
        this.speed = 3.5;/////
        this.target = 5;///////
        gameOverScreen.style.display = 'none';
        backgroundMusic.play();
        this.loop();
    }

    showGameOverScreen() {
      if (this.score > scores[userScoreIndex].flappy_score) {
        scores[userScoreIndex].flappy_score = this.score;
        localStorage.setItem('scores', JSON.stringify(scores)); 
        bestScoreSpan.textContent = this.score; 
      }

      const gameOverScreen = document.getElementById('gameOverScreen');
      gameOverScreen.style.display = 'block'; // Make it visible

      // Center game over screen relative to the gameContainer, not the whole viewport
      const gameContainerRect = document.getElementById('gameContainer').getBoundingClientRect();
      gameOverScreen.style.top = `${gameContainerRect.height / 2}px`;
      gameOverScreen.style.left = `50%`;
      gameOverScreen.style.transform = 'translate(-50%, -50%)';
      
      // Update buttons dynamically to ensure event listeners are attached
      gameOverScreen.innerHTML = `<p>GAME OVER!<br>Your score is: ${this.score}</p>`;
      gameOverScreen.innerHTML += `<button id="playAgainButton">Play Again</button>`;
      gameOverScreen.innerHTML += `<button id="quitButton">Quit</button>`;
      gameOverScreen.innerHTML += `<button id="difficulty">Choose Mode</button>`

      // Reattach event listeners
      document.getElementById('playAgainButton').addEventListener('click', () => this.reset());
      document.getElementById('quitButton').addEventListener('click', () => window.location.href= "../html/games.html");
      document.getElementById('difficulty').addEventListener('click', () => window.location.href= "../html/selectFlappyDifficulty.html");
    }
  }

    const game = new Game();
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // Get the selected game mode from the URL query parameter
    const mode = getQueryParam('mode');
    if (mode === 'hard'){
        game.hard = true;
        game.easy = false;
    }else if(mode === 'easy'){
        game.easy = true;
        game.hard = false;
    } else {
        game.easy = false;
        game.hard = false;
    }


  canvas.addEventListener('click', function() {
        if (game.start) {
            game.start = false;
            gameOverScreen.style.display = 'none';
            game.startBackgroundMusic();
            game.loop();
        }
        else if (!game.gameOver) {
          game.bird.flap();
        }
  });

    playAgainButton.addEventListener('click', function() {
        game.reset();
    });

    quitButton.addEventListener('click', function() {
        window.location.href('../html/games.html');
    });

    canvas.addEventListener('click', function() {
        if (!game.start && !game.gameOver) {
            game.bird.flap();
        }
    });

    // Event listener for keyboard input
    document.addEventListener('keydown', function(event) {
        if ((event.code === 'Space' || event.keyCode === 32) && !game.start && !game.gameOver) {
            event.preventDefault(); // Prevent scrolling when space is pressed
            game.bird.flap();
        }else if( event.code==='Space' && game.start){
            event.preventDefault(); 
            game.start = false;
            gameOverScreen.style.display = 'none';
            game.startBackgroundMusic();
            game.loop();
        }
    });



    // Start the game loop when the page loads
    window.onload = game.loop;
});