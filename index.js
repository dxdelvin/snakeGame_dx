  const board_border = 'black';
    const board_background = "lightblue";
    const snake_col = 'red';
    const snake_border = 'black';
    
    let snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      {x: 170, y: 200},
      {x: 160, y: 200}
    ]

    let score = 0;
    // True if changing direction
    let changing_direction = false;
   
    let food_x;
    let food_y;
    //velocity check for the movement of the snake
    let dx = 10;
    
    let dy = 0;
    
    
    //Getting the canvas element
    const snakeboard = document.getElementById("snakeboard");
    //getting 2d context 
    const snakeboard_ctx = snakeboard.getContext("2d");
    //The Start of the Game and the generation of the food
    main();

    gen_food();

    document.addEventListener("keydown", change_direction);
    
    //the main function will run again and again so its run game continusuly
    function main() {

        if (has_game_ended()) return;

        changing_direction = false;
        setTimeout(function onTick() {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        // Repeat
        main();
      }, 70)
    }
    
    //The Canvas
    function clear_board() {
      //Select the color from top to fill canvas
      snakeboard_ctx.fillStyle = board_background;
      //Select the color for the stroke of the canvas
      snakeboard_ctx.strokestyle = board_border;
      //Filling it
      snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
      //Filling the border
      snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
    }
    
    //drawing the snake on the middle of the canvas you can
    //change it by let snake above the code
    function drawSnake() {
      //calling the function to draw the snake each part
      snake.forEach(drawSnakePart)
    }
    //drawing the food
    function drawFood() {
      //selecting the color for the fill and stroke for the food
      snakeboard_ctx.fillStyle = 'yellow';
      snakeboard_ctx.strokestyle = 'darkyellow';
      //fillinf that color
      snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
      snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
    }
    
    //Draw one snake part
    function drawSnakePart(snakePart) {

      //setting the fill color you can change it from very above code
      snakeboard_ctx.fillStyle = snake_col;
      //seeting the stroke color
      snakeboard_ctx.strokestyle = snake_border;
      // filling the color for the snake part
      snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      //drawing a border around that snake part
      snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function has_game_ended() {
      //using the for loop to check the require condition

      // snake will lose when it touches border 
      // and also snake will lose when it touches itself
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
      }
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > snakeboard.width - 10;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > snakeboard.height - 10;
      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    //making the use of random for the food locations
    function random_food(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function gen_food() {
      // Generate a random number the food x-coordinate
      food_x = random_food(0, snakeboard.width - 10);
      // Generate a random number for the food y-coordinate
      food_y = random_food(0, snakeboard.height - 10);
      //if the snake reaches to the food then generate a new one
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
      });
    }


    //all about the movements in the code
    function change_direction(event) {
      const LEFT_KEY = 65;
      const RIGHT_KEY = 68;
      const UP_KEY = 87; // these numbers are the key codes
      const DOWN_KEY = 83;
      
    // Prevent the snake from reversing itself like going above then it 
    //cant go again back!!
    
      if (changing_direction) return;
      changing_direction = true;
      const keyPressed = event.keyCode;
      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;

      // all the conditions so the keys wont work
      // if the snake going front so the back key is not allowed like that
      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
      }
      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
      }
    }

    function move_snake() {
      //The snakes Head new one
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      //adding the new head infront of the array of the snake
      snake.unshift(head);
      const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
      if (has_eaten_food) {
        //Increase score
        score += 10;
        //Display score on screen
        document.getElementById('score').innerHTML = score;
        //Generate new food location
        gen_food();
      } else {
        //Removes the last array element from the array which is last part of snake body
        snake.pop();
      }
    }