/*
    BUGS: 
    1. The function animateShop() is build wrong, making the firsts sprites bug only in the start, cause onload problem on images and i dont
    know to fix it
    2. The clouds may bug too cause the way i made them
    3. Thats all i think...
*/

// Global variables
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
const sprites = { // BUG MAKING CLOUDS SPAWN LATE
    especial: { // To make moviment on scenario grass, cloud
        scenario_grass: [0, 160, 320, 480, 640, 800, 960, 1120],
        scenario_cloud: [
            {x: 100, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 250, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 400, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 500, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 700, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 770, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 800, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 900, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)},
            {x: 1000, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1100, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1200, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1300, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1400, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1500, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1600, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)},   
            {x: 1620, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}, 
            {x: 1630, y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)}

        ]
    },
    birds: {
        normal: './sprites/bird_sprites/Bird.png',
        blue: './sprites/bird_sprites/Bird_blue.png',
        yellow: './sprites/bird_sprites/Bird_yellow.png',
        green: './sprites/bird_sprites/Bird_green.png',
        black: './sprites/bird_sprites/Bird_black.png'
    }, 
    obstacles: {
        normal: './sprites/obstacles/wood_pixel.png'
    },
    scenario: {
        grass: './sprites/scenario/scenario_pixel.png',
        cloud: './sprites/scenario/cloud.png'
    }
}
const storageSprites = {
    actualSprite: sprites.birds.normal,
    allSprites: [] // -> Make a loop to put all bird sprites in property allSprites 
}

for (let key in sprites.birds) {
    storageSprites.allSprites.push(sprites.birds[key]);
}

let playAnimationShop = false;

console.log(storageSprites);
// queria usar somente 1 img e mudar somente o src pra cada caso, mas tá acontecendo um bug só aceita somente 1 src pra cada image
// eu acredito que, por conta de alguma particularidade da classe image que desconheço, não tá dando tempo de carregar a imagem e acaba sobreescrevendo com o ultimo src atribuído no frame
let img = new Image();
let img2 = new Image();
let img_scenario_grass = new Image();
let img_scenario_cloud = new Image();

// DOM
const restartGame = document.getElementById('restartGame');
const startGame = document.getElementById('startGame');
const menu = document.getElementById('menu');
const menu_title = document.getElementById('menu_title');
const goShop = document.getElementById('goShop');
const shop = document.getElementById('shop');
const returnMenu_button = document.getElementById('returnMenu');
// 

const canvas = document.querySelector('#gameWindow');
const ctx = canvas.getContext('2d');

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
    ctx.fillStyle = '#3b2b11';
    img2.src = sprites.obstacles.normal;
    position.forEach((x, i) => {
        
        for (let y = 0; y <= 400; y += 40) {
            ctx.drawImage(img2, 0, 0, 40, 40, x, y, 40, 40);
        }
        ctx.drawImage(img2, 0, 40, 40, 40, x, randomVal[i] + 40 + player.width, 40, 40);

        // rotate image and return to origin
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(img2, 0, 40, 40, 40, x, -randomVal[i] + 15 - player.width, 40, 40); // idk if this is right cause the scale
        ctx.restore();
        
        ctx.fillRect(x, randomVal[i], width, player.width + 40);
        ctx.fillStyle = '#3b2b11';

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
    img.src = storageSprites.actualSprite;
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
    // < Grass >
    img_scenario_grass.src = sprites.scenario.grass;
ctx.imageSmoothingQuality = 'high'
    sprites.especial.scenario_grass.forEach((el, i) => {
        
        ctx.drawImage(img_scenario_grass, 0, 160, 160, 160, el, h - 160, 160, 160);
        sprites.especial.scenario_grass[i] -= 1;

        if (el <= -360) {
            sprites.especial.scenario_grass.shift();
            sprites.especial.scenario_grass.push(sprites.especial.scenario_grass[sprites.especial.scenario_grass.length - 1] + 160);
        }
    })

    // < Cloud > 
    img_scenario_cloud.src = sprites.scenario.cloud;

    sprites.especial.scenario_cloud.forEach(({x, y}, i) => {
      ctx.drawImage(img_scenario_cloud, 0, 0, 60, 60, x, y, 60, 60); 
      sprites.especial.scenario_cloud[i].x -= 0.5; 
    })
    if (sprites.especial.scenario_cloud[0].x < -220) {
        sprites.especial.scenario_cloud.shift();

        const lastValue1 = sprites.especial.scenario_cloud.length - 1;
        const lastValue2 = sprites.especial.scenario_cloud[lastValue1].x;

        
        const newCloud = {
            x: lastValue2 + (Math.random() * 400),
            y: Math.floor(Math.random() * ((h*0.5) - 20) + 20)
        }
        sprites.especial.scenario_cloud.push(newCloud);
      }
}

//-> Shop
let t = 0;
const openShop = (bool) => {
    if (bool === true) {
        playAnimationShop = true;
        menu.style.display = 'none';
        shop.style.display = 'flex';
        animateShop();
    } else {
        playAnimationShop = false;
        menu.style.display = 'flex';
        menu_title.textContent = 'Flappy Bird';
        restartGame.textContent = 'Start';
        shop.style.display = 'none';
    }
}
const animateShop = () => {
    if (playAnimationShop === false) {
        return;
    }

    // Actual Sprite
    const canvas_actual = document.querySelector('#actualSprite canvas');
    const ctx = canvas_actual.getContext('2d');

    ctx.clearRect(0, 0, canvas_actual.width, canvas_actual.height);
    img.src = storageSprites.actualSprite;

    ctx.drawImage(img, column*frameHeightWidth, row*frameHeightWidth, frameHeightWidth, frameHeightWidth, (canvas_actual.width/2) - frameHeightWidth*2, (canvas_actual.height/2) - frameHeightWidth*2, frameHeightWidth*4, frameHeightWidth*4);

    // All Sprites list
    storageSprites.allSprites.forEach((src) => {
        const img = new Image();
        img.onload = function() {
            const regex = /(.\/sprites\/bird_sprites\/)|(.png$)/g

            const canvas = document.getElementById(src.replace(regex, ''));
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, column*frameHeightWidth, row*frameHeightWidth, frameHeightWidth, frameHeightWidth, (canvas.width/2) - frameHeightWidth*2, (canvas.height/2) - frameHeightWidth*2, frameHeightWidth*4, frameHeightWidth*4);
        }
        img.src = src;
    })
    // Next frame
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
    
    window.requestAnimationFrame(animateShop);
}

const updateSkin = (skinId) => {
    const regex = /(_choose$)/
    

    // Update ActualSprite
    const spriteNode = document.getElementById(skinId.target.id).parentNode;
    storageSprites.actualSprite = `./sprites/bird_sprites/${skinId.target.id.replace(regex, '')}.png`;
    if (spriteNode.classList[0] === 'noChoosed') {
        const mainNodeContainer = document.getElementById('spritesChoose_container');

        Array.from(mainNodeContainer.children).forEach((node) => {
            if(node.classList[0] === 'choosed') {
                node.classList.remove('choosed');
                node.classList.add('noChoosed');
            }
        })

        spriteNode.classList.toggle('noChoosed');
        spriteNode.classList.toggle('choosed');
    } else {
        
    }
}

storageSprites.allSprites.forEach((src, i) => {
    const regex = /(.\/sprites\/bird_sprites\/)|(.png$)/g
    let HTML;
    if (i === 0) {
        HTML = //noChoosed -> choosed
        `
        <div class="choosed">
            <canvas width="100" height="100" id="${src.replace(regex, '')}"></canvas>
            <button id="${src.replace(regex, '')+"_choose"}">Choose</button>
        </div>
        `
    } else {
        HTML = //noChoosed -> choosed
        `
        <div class="noChoosed">
            <canvas width="100" height="100" id="${src.replace(regex, '')}"></canvas>
            <button id="${src.replace(regex, '')+"_choose"}">Choose</button>
        </div>
        `
    }
    

    document.getElementById('spritesChoose_container').insertAdjacentHTML('beforeend', HTML);
    document.getElementById(src.replace(regex, '')+"_choose").addEventListener('click', updateSkin);
    document.getElementById(src.replace(regex, '')).addEventListener('click', updateSkin);
})
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

    // Scenario
    // -> Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 700, 400);
    
    // -> Wall Color and some grass on the ground with moviment and clouds
    drawScenario();

    // Obstacles
    createObstacles(obstacles);

    // Player positions 
    drawBird();

    // Check if player hit Obstacles
    playerHit(obstacles);

    if (hitPlatform) {
        console.log('Boneco morreu');
        menu.style.display = 'flex';
        menu_title.textContent = 'You Died';
        startGame.style.display = 'none';
        restartGame.style.display = 'inline-block'
        restartGame.textContent = 'Restart'
        
        document.querySelector('body').removeEventListener('keydown', enableControls);
        document.querySelector('body').removeEventListener('keyup', enableControls);

        return;
    }
    window.requestAnimationFrame(draw);
}
// função Ativa os controles do boneco
const enableControls = ({type}) => {
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
goShop.addEventListener('click', () => openShop(true));
returnMenu_button.addEventListener('click', () => openShop(false));