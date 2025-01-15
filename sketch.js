const input = { keys: {}, mouse: {} }
const game = {

    inGame: true,
    jumpscare: false,
    won: false,

    confetti: [],

    currentGif: 'STATIC',

    level: 0,
    strokes: 0,

    wonAnim: 0,
    wonMillis: 0,

    prevFrame: 0,
    levelStart: 0,

    posX: 0,
    posY: 0,

    velX: 0,
    velY: 0,

    squish: 1,

    uncannyPosX: 0,
    uncannyPosY: 0,

    uncannyVelX: 0,
    uncannyVelY: 0,

    strokeStartX: 0,
    strokeStartY: 0,
};

const IMAGES = {
    CANNY: 'karl.png',
    UNCANNY: 'uncanny.png',
    LOGO: 'logo.png',
    RANK_PEAK: 'peak.png',
    LAPTOP: 'laptop.png',

    LEVEL_CLEAR: 'level_clear.png',
    YOUR_RANK: 'your_rank.png',
};

const GIFS = {
    STATIC: 'static.gif',
    CAT: 'cat.gif',
};

const SOUNDS = {
    JUMPSCARE: 'jumpscare.mp3',
    WIN: 'win.mp3',
    GUNSHOT: 'gunshot.mp3',
}

const LEVELS = [
    {
        startPos: [100, 100],
        uncannyPos: [200, 200],
        hole: [300, 300],
        par: 2,
    }
];

function preload() {
    for (const key in IMAGES) {
        IMAGES[key] = loadImage(`assets/images/${IMAGES[key]}`);
    }
    for (const key in GIFS) {
        GIFS[key] = loadImage(`assets/gifs/${GIFS[key]}`);
    }
    for (const key in SOUNDS) {
        SOUNDS[key] = loadSound(`assets/sounds/${SOUNDS[key]}`);
    }
}

function loadLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    game.squish = 0.5;
    game.jumpscare = false;
    game.won = false;

    game.confetti = [];
    game.wonAnim = 0;

    game.strokes = 0;

    game.posX = level.startPos[0];
    game.posY = level.startPos[1];

    game.uncannyPosX = level.uncannyPos[0];
    game.uncannyPosY = level.uncannyPos[1];

    game.velX = 0;
    game.velY = 0;

    game.levelStart = millis();

    game.uncannyVelX = 0;
    game.uncannyVelY = 0;
}

function setup() {
    textFont('Comic Sans MS');
    createCanvas(900, 600);

    loadLevel(0);
}

function keyPressed() {
    input.keys[keyCode] = 0;
}

function keyReleased() {
    input.keys[keyCode] = -1;
}

function mousePressed() {
    if (game.inGame) {
        game.strokeStartX = mouseX;
        game.strokeStartY = mouseY;
    }
    input.mouse[mouseButton] = 0;
}

function strokeDx() {
    return game.strokeStartX - mouseX;
}

function strokeDy() {
    return game.strokeStartY - mouseY;
}

function rawStrokeStrength() {
    return sqrt(strokeDx() ** 2 + strokeDy() ** 2);
}

function strokeNormalized() {
    return [strokeDx() / rawStrokeStrength(), strokeDy() / rawStrokeStrength()];
}

function strokeStrength() {
    return min(rawStrokeStrength(), 200) / 200;
}

function canStroke() {
    return game.velX === 0 && game.velY === 0;
}

function mouseReleased() {
    if (game.inGame) {
        if (rawStrokeStrength() > 20 && canStroke()) {
            strokeThatThang();
        }
    }
    input.mouse[mouseButton] = -1;
}

function updateInput() {
    for (let key in input.keys) {
        if (input.keys[key] >= 0) {
            input.keys[key] += 1;
        }
    }
    for (let button in input.mouse) {
        if (input.mouse[button] >= 0) {
            input.mouse[button] += 1;
        }
    }
}

const MAX_STROKE_POWER = 20;
const UNCANNY_SPEED = 1;
const KARL_RADIUS = 25;
const HOLE_RADIUS = 25;

function strokeThatThang() {
    // should never be called if not in game.
    const [dx, dy] = strokeNormalized();
    const strength = strokeStrength() * MAX_STROKE_POWER;
    const [sdx, sdy] = [dx * strength, dy * strength];

    game.velX += sdx;
    game.velY += sdy;
}

function reset() {
    SOUNDS.JUMPSCARE.stop();
    loadLevel(game.level);
}

function update() {
    const level = LEVELS[game.level];

    if (input.keys['J'.charCodeAt(0)] === 0) {
        game.squish = 0.5;
    }

    if (input.keys['R'.charCodeAt(0)] === 0) {
        reset();
    }

    if (game.jumpscare) {
        return;
    }

    game.posX += game.velX;
    game.posY += game.velY;

    game.velX *= 0.98;
    game.velY *= 0.98;

    if (game.posX > 600 - KARL_RADIUS) {
        game.velX = -abs(game.velX);
        game.posX = 600 - KARL_RADIUS;
        game.squish += 0.25;
    }
    if (game.posX < KARL_RADIUS) {
        game.velX = abs(game.velX);
        game.posX = KARL_RADIUS;
        game.squish += 0.25;
    }

    if (game.posY > 600 - KARL_RADIUS) {
        game.velY = -abs(game.velY);
        game.posY = 600 - KARL_RADIUS;
        game.squish -= 0.2;
    }
    if (game.posY < KARL_RADIUS) {
        game.velY = abs(game.velY);
        game.posY = KARL_RADIUS;
        game.squish -= 0.2;
    }

    if (dist(0, 0, game.velX, game.velY) < 0.3) {
        game.velX = 0;
        game.velY = 0;
    }

    game.squish = constrain(game.squish, 0.0001, 10);
    game.squish = lerp(game.squish, 1, 0.1);

    if (game.won) {
        game.wonAnim = lerp(game.wonAnim, 0, 0.05);
        for (const confetti of game.confetti) {
            confetti[0] += confetti[2];
            confetti[1] += confetti[3];

            if (confetti[0] > 600) {
                confetti[2] = -abs(confetti[2])
                confetti[0] = 600;
            }
            if (confetti[1] > 600) {
                confetti[3] = -abs(confetti[3])
                confetti[1] = 600;
            }
            if (confetti[0] < 0) {
                confetti[2] = abs(confetti[2])
                confetti[0] = 0;
            }
            if (confetti[1] < 0) {
                confetti[3] = abs(confetti[3])
                confetti[1] = 0;
            }
        }

        const prevRevel = floor(max(game.prevFrame - game.wonMillis - 1000, 0) / 500);
        const reveal = floor(max(millis() - game.wonMillis - 1000, 0) / 500);

        if (reveal > prevRevel) {
            if (reveal <= 3) {
                SOUNDS.GUNSHOT.play();
            } else {
                // play win sound
            }
        }

        game.prevFrame = millis();
        return;
    }

    if (dist(game.posX, game.posY, level.hole[0], level.hole[1]) < HOLE_RADIUS + KARL_RADIUS) {
        SOUNDS.WIN.play();
        game.won = true;
        game.wonAnim = 1;
        game.wonMillis = millis();
        game.confetti = new Array(100).fill(null).map(() => [level.hole[0] + random(-20, 20), level.hole[1] + random(-20, 20), random(-10, 10), random(-10, 10)]);
    }

    const uncannyMagnitude = dist(game.posX, game.posY, game.uncannyPosX, game.uncannyPosY);

    if (uncannyMagnitude < KARL_RADIUS * 1.5) {
        if (!game.jumpscare) {
            SOUNDS.JUMPSCARE.play();
        }
        game.jumpscare = true;
    }

    const uncannyDiffX = game.posX - game.uncannyPosX;
    const uncannyDiffY = game.posY - game.uncannyPosY;

    game.uncannyPosX += game.uncannyVelX;
    game.uncannyPosY += game.uncannyVelY;

    game.uncannyVelX = lerp(game.uncannyVelX, uncannyDiffX / uncannyMagnitude * UNCANNY_SPEED, 0.05);
    game.uncannyVelY = lerp(game.uncannyVelY, uncannyDiffY / uncannyMagnitude * UNCANNY_SPEED, 0.05);
}

function strokeScore(strokes, par) {
    return floor(10000 / strokes) * (strokes <= par ? 0.5 : 1);
}

function timeScore(time) {
    return max(10000 - pow(time, 2), 0);
}

function draw() {
    update();
    updateInput();

    strokeWeight(1);
    background(255);
    noStroke();
    fill(230);
    rect(0, 0, 300, 600);

    stroke(0);
    line(300, 0, 300, 600);
    fill(100 + random(0, 10), 200 + random(0, 50), 100 + random(0, 10));
    rect(0, 0, 300, 150);

    textSize(24);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);

    push();
    
    translate(150 + sin(millis() / 1000) * 5, 75 + sin(millis() / 667) * 5);
    rotate(sin(millis() / 1250) * 0.05);
    image(IMAGES.LOGO, -125, -50, 250, 100);

    pop();

    image(IMAGES.LAPTOP, 0, 400, 299, 199);
    image(GIFS[game.currentGif], 33, 422, 230, 110);
    image(IMAGES.CANNY, 199, 499, 100, 100);

    // draw game

    if (game.jumpscare) {
        image(IMAGES.UNCANNY, 300, 0, 600, 600);
        return;
    }

    push();
    const level = LEVELS[game.level];

    translate(300, 0);

    fill(0);
    circle(level.hole[0], level.hole[1], HOLE_RADIUS * 2);

    image(
        IMAGES.CANNY, 
        game.posX - KARL_RADIUS / game.squish, 
        game.posY - KARL_RADIUS * game.squish, 
        (KARL_RADIUS * 2) / game.squish, 
        (KARL_RADIUS * 2) * game.squish
    );

    if (!game.won) {
        image(
            IMAGES.UNCANNY, 
            game.uncannyPosX - KARL_RADIUS, 
            game.uncannyPosY - KARL_RADIUS, 
            (KARL_RADIUS * 2), 
            (KARL_RADIUS * 2)
        );
    }

    if (game.won) {
        const confettiColors = [[255, 200, 255], [255, 255, 200], [200, 255, 200], [200, 255, 255], [200, 200, 255]];
        noStroke();
        for (let i = 0; i < 5; i += 1) {
            fill(...confettiColors[i]);
            beginShape(QUADS);
            for (let j = 0; j < 20; j += 1) {
                const [x, y, _, __] = game.confetti[i * 20 + j];
                vertex(x - 5, y - 5);
                vertex(x - 5, y + 5);
                vertex(x + 5, y + 5);
                vertex(x + 5, y - 5);
                
            }
            endShape();
        }
    }

    if (input.mouse[LEFT] >= 0) {
        strokeWeight(canStroke() ? 5 : 1);
        const [dx, dy] = strokeNormalized();
        stroke(strokeStrength() * 255, 255 - strokeStrength() * 255, 0);
        line(game.posX, game.posY, game.posX + dx * strokeStrength() * 200, game.posY + dy * strokeStrength() * 200);
    }

    pop();

    if (input.mouse[LEFT] >= 0) {
        stroke(255, 0, 0);
        noFill();
        ellipse(game.strokeStartX, game.strokeStartY, 10, 10);
    }

    if (game.won) {

        push();
        translate(320, 50 - game.wonAnim * 400);
        stroke(0);
        fill(100);

        rect(0, 0, 560, 400);

        image(IMAGES.LEVEL_CLEAR, 30, 10, 500, 100);

        const reveal = floor(max(millis() - game.wonMillis - 1000, 0) / 500);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        textSize(32);
        
        if (reveal > 0) {
            text(`STROKE SCORE: ${strokeScore(game.strokes, level.par), 30, 150}`);
        }
        if (reveal > 1) {
            text(`TIME SCORE: ${timeScore(game.wonMillis - game.levelStart), 30, 200}`);
        }
        if (reveal > 2) {
            image(IMAGES.YOUR_RANK, 30, 250, 300, 100);
        }
    }
}