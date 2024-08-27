const w = 700, h = 400;
let isPressed = false;
let hitPlatform = false;
let points = 0;
let record = 0;
let player, obstacles;
let column = 0;
let row = 0;
const frameHeightWidth = 20;
let frameCount = 0;
const sprites = {
    birds: {
        normal: './sprites/bird_sprites/Bird.png'
    }, 
    obstacles: {
        normal: './sprites/obstacles/wood_pixel.png'
    },
    scenario: {
        normal: './sprites/scenario/scenario_pixel.png'
    }
}
let img = new Image();
let img2 = new Image();
let img_scenario = new Image();

// DOM
const restartGame = document.getElementById('restartGame');
const startGame = document.getElementById('startGame');
const menu = document.getElementById('menu');
const menu_title = document.getElementById('menu_title');
// 

const canvas = document.querySelector('canvas');

const ctx = document.querySelector('canvas').getContext('2d');

canvas.setAttribute('width', `${w}px`);
canvas.setAttribute('height', `${h}px`);

// Classes
class Player {
    constructor () {
        this.width = 15,
        this.height = 15,
        this.position = {
            x: 100,
            y: h - 230
        },
        this.dy = 0, // subir é negativo
        this.g = 0.6
    }
}

class Obstacles {
    constructor () {
        this.width = 40,
        this.position = [(w * 0.8), (w * 1.2), (w * 1.6), (w * 2), (w * 2.4), (w * 2.8)],
        this.randomVal = [0, 0, 0, 0 ,0, 0],
        this.avaliablePoints = [true, true, true, true, true, true]
    }
}

// #Functions 
// -> Create Obstacles
const createObstacles = ({width, position, randomVal, avaliablePoints}) => {
    ctx.fillStyle = 'black';
    img2.src = sprites.obstacles.normal;
    position.forEach((x, i) => {
        ctx.fillRect(x, 0, width, 700);
        
        for (let y = 0; y <= 400; y += 40) {
            ctx.drawImage(img2, 0, 0, 40, 40, x, y, 40, 40);
        }
        ctx.drawImage(img2, 0, 40, 40, 40, x, randomVal[i] + 40 + player.width, 40, 40);

        // rotate image and return to origin
        ctx.save();
        ctx.scale(1, -1);
        // ctx.rotate(Math.PI * 2);
        ctx.drawImage(img2, 0, 40, 40, 40, x, -randomVal[i] + 15 - player.width, 40, 40); // idk if this is right cause the scale
        ctx.restore();

        ctx.clearRect(x, randomVal[i], width, player.width + 40);
        ctx.fillStyle = 'black';

        position[i] -= 2;
        if (position[i] <= -500) {
            position.shift();
            randomVal.shift();
            avaliablePoints.shift();
            avaliablePoints.push(true);
            
            const lastValue = position[position.length - 1];
            position.push(lastValue + 280);

            let random = Math.random() * h;
        
            if (random < player.height) {
                random = player.height;
            } else if (random > h - player.height - 50) {
                random = h - player.height - 50;
            }

            obstacles.randomVal.push(random);
        }
    })
}

// -> Check if player hit
const playerHit = ({width, position, randomVal, avaliablePoints}) => {
    position.forEach((x, i) => {
        if ((player.position.x <= x + width) && (player.position.x + player.width >= x)) {
            if (player.position.y < randomVal[i]) {
                // console.log('to dentro de cima');
                hitPlatform = true;
            } else if (player.position.y + player.height > randomVal[i] + player.width + 40) {
                // console.log('to dentro de baixo');
                hitPlatform = true;
            }
        } else if ((player.position.x > (width / 2) + x) && avaliablePoints[i]) {
            givePoints();
            avaliablePoints[i] = false;
        }
    })
}

// -> Give points
const givePoints = () => {
    points++;

    document.getElementById('points_text').textContent = points;
    if (points > record) {
        record = points; 
    } 
    document.getElementById('record_text').textContent = record;
}

// -> Draw Bird
const drawBird = () => {
    img.src = sprites.birds.normal;
    if (frameCount === 8) {
        frameCount = 0;
        if (column === 1) {
            if (row === 1) {
                row = 0;
                column = 1;
            } else {
                row++;
            }
        } else {
            column++;
        }
    } else {
        frameCount++;
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, column*frameHeightWidth, row*frameHeightWidth, frameHeightWidth, frameHeightWidth, player.position.x - 5, player.position.y - 8, frameHeightWidth*1.5, frameHeightWidth*1.5);
}

// -> Draw scenario 
const drawScenario = () => {
    
}
// Main function to draw player in canvas, check some property and call functions like createObstacles()
const draw = () => {
    // Clear Rect
    ctx.clearRect(0, 0, 700, 400);
    
    // Update player.position.y with his property dy
    if (!((player.position.y + player.dy) < 0) && (player.position.y + player.height + player.dy - 5) < h) {
        player.position.y += player.dy; 
        player.dy += player.g;

        if (player.dy >= 4) {
            player.dy = 4;
        }
    } else if ((player.position.y + player.height + player.dy) >= h) {
        hitPlatform = true;
    } else {
        player.dy += player.g;

        if (player.dy >= 4) {
            player.dy = 4;
        }
    }

    // Obstacles
    createObstacles(obstacles);

    // Player positions 
    // ctx.fillStyle = 'yellow';
    // ctx.stroke()
    // ctx.fillRect(player.position.x, player.position.y, player.width, player.height);
    drawBird();

    // Check if player hit Obstacles
    playerHit(obstacles);

    if (hitPlatform) {
        console.log('Boneco morreu');
        menu.style.display = 'flex';
        menu_title.textContent = 'Morreu patrão';
        startGame.style.display = 'none';
        restartGame.style.display = 'block'
        
        document.querySelector('body').removeEventListener('keydown', enableControls);
        document.querySelector('body').removeEventListener('keyup', enableControls);
        


        return;
    }
    window.requestAnimationFrame(draw);
}
// função Ativa os controles do boneco
const enableControls = ({type}) => {
    // console.log(type);
    if (type === 'keydown') {
        if (!isPressed) {
            isPressed = true;
            player.dy = -5; // negativo pq o eixo y é invertido
        }
    } else if (type === 'keyup') {
        if (isPressed) {
            isPressed = false;
        }
    }
}

// jogo inicia
const gameStart = () => {
    player = new Player();
    obstacles = new Obstacles();
    hitPlatform = false;
    points = 0;
    document.getElementById('points_text').textContent = points;

    console.log('Jogo iniciado');
    menu.style.display = 'none';

    document.querySelector('body').addEventListener('keydown', enableControls);
    document.querySelector('body').addEventListener('keyup', enableControls);

    

    obstacles.randomVal.forEach((val, i) => {
        let random = Math.random() * h;
            
        if (random < player.height) {
            random = player.height;
        } else if (random > h - player.height - 50) {
            random = h - player.height - 50;
        }
    
        obstacles.randomVal[i] = random;
    })

    draw();
}

startGame.addEventListener('click', gameStart);
restartGame.addEventListener('click', gameStart);