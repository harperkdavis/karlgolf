const input = { keys: {}, mouse: {} }
const game = {

    inGame: true,
    jumpscare: false,
    won: false,

    confetti: [],

    currentGif: 'STATIC',
    nextGif: 'STATIC',

    level: 0,
    strokes: 0,

    wonAnim: 0,
    wonMillis: 0,

    prevFrame: 0,
    levelStart: 0,

    levelAnim: 0,

    posX: 0,
    posY: 0,

    velX: 0,
    velY: 0,

    squish: 1,

    strokeScore: 0,
    timeScore: 0,
    score: 0,

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
    LAPTOP: 'laptop.png',

    LEVEL_CLEAR: 'level_clear.png',
    YOUR_RANK: 'your_rank.png',

    RANK_PEAK: 'rank_peak.png',
    RANK_ALRIGHT: 'rank_alright.png',
    RANK_MID: 'rank_mid.png',
    RANK_IHATEYOU: 'rank_ihateyou.png',
};

const GIFS = {
    STATIC: 'static.gif',
    NORMAL0: 'karl_skateboard.gif',
    NORMAL1: 'karl_yapping.gif',
    NORMAL2: 'karl_rainbow_bridge.png',
    NORMAL3: 'karl_stretched.png',
    NORMAL4: 'karl_cooked.png',
};

const SOUNDS = {
    JUMPSCARE: 'jumpscare.mp3',
    WIN: 'win.mp3',
    GUNSHOT: 'gunshot.mp3',

    HIT: 'hit.mp3',
    BOING: 'boing.mp3',

    RANK_PEAK: 'rank_peak.mp3',
    RANK_ALRIGHT: 'rank_alright.mp3',
    RANK_MID: 'rank_mid.mp3',
    RANK_IHATEYOU: 'rank_ihateyou.mp3',
};

function makeRect(x, y, w, h) {
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
}

const LEVELS = [
    {
        startPos: [50, 50],
        uncannyPos: [[300, 500]],
        hole: [550, 550],
        name: 'welcome to uncanny karl golf!',
        walls: [
            [[0, 500], [100, 600], [0, 600]],
            [[500, 0], [600, 0], [600, 100]]
        ],
        obstacles: [],
        par: 1,
    },
    {
        startPos: [50, 300],
        uncannyPos: [[300, 300]],
        hole: [550, 300],
        name: 'the basics.',
        walls: [
            makeRect(0, 0, 600, 100),
            makeRect(0, 500, 600, 100),
            [[300, 200], [400, 300], [300, 400], [200, 300]],

        ],
        obstacles: [],
        par: 2,
    },
    {
        startPos: [50, 550],
        uncannyPos: [[300, 300]],
        hole: [350, 550],
        name: 'navigation required!',
        walls: [
            makeRect(0, 0, 100, 200),
            makeRect(200, 200, 300, 100),
            makeRect(200, 200, 100, 400),
            [[500, 0], [600, 0], [600, 100]],
            [[500, 400], [600, 400], [600, 500]],
            [[100, 600], [200, 500], [300, 600]],
            [[0, 0], [200, 0], [0, 200]],
        ],
        obstacles: [],
        par: 3,
    },
    {
        startPos: [300, 50],
        uncannyPos: [[300, 300]],
        hole: [50, 550],
        name: 'come down to bounce town',
        walls: [
            makeRect(0, 0, 100, 200),
            makeRect(200, 200, 300, 100),
            makeRect(200, 200, 100, 400),
            [[500, 0], [600, 0], [600, 100]],
            [[500, 400], [600, 400], [600, 500]],
            [[100, 600], [200, 500], [300, 600]],
            [[0, 0], [200, 0], [0, 200]],
        ],
        obstacles: [],
        par: 3,
    },
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
    game.levelAnim = 1;

    game.strokeScore = 0;
    game.timeScore = 0;
    game.score = 0;

    game.posX = level.startPos[0];
    game.posY = level.startPos[1];

    game.uncannyPosX = level.uncannyPos[0][0];
    game.uncannyPosY = level.uncannyPos[0][1];

    game.velX = 0;
    game.velY = 0;

    game.levelStart = 0;

    game.uncannyVelX = 0;
    game.uncannyVelY = 0;
}

function nextLevel() {
    game.level += 1;
    reset();
}

function closestPointOnLine(lineStart, lineEnd, point) {
    const A = point[0] - lineStart[0];
    const B = point[1] - lineStart[1];
    const C = lineEnd[0] - lineStart[0];
    const D = lineEnd[1] - lineStart[1];

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = lineStart[0];
        yy = lineStart[1];
    } else if (param > 1) {
        xx = lineEnd[0];
        yy = lineEnd[1];
    } else {
        xx = lineStart[0] + param * C;
        yy = lineStart[1] + param * D;
    }

    return [xx, yy];
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denominator === 0) {
      return null;
    }
  
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return [
        x1 + ua * (x2 - x1),
        y1 + ua * (y2 - y1)
      ];
    }
  
    return null;
  }

function setup() {
    textFont('Comic Sans MS');
    createCanvas(900, 600);

    // loadLevel(0);
    game.level = LEVELS.length - 1;
    loadLevel(game.level);
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
    if (game.jumpscare) {
        reset();
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
    return game.velX === 0 && game.velY === 0 && !game.jumpscare && !game.won;
}

function mouseReleased() {
    if (game.inGame) {
        if (game.won) {
            nextLevel();
        } else {
            if (rawStrokeStrength() > 20 && canStroke()) {
                strokeThatThang();
            }
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
const POWER_FACTOR = 1.5;
const UNCANNY_SPEED = 1;
const KARL_RADIUS = 25;
const HOLE_RADIUS = 25;
const SQUISH_FACTOR = 0.02;

function strokeThatThang() {
    // should never be called if not in game.
    const [dx, dy] = strokeNormalized();
    const strength = strokeStrength() * MAX_STROKE_POWER * POWER_FACTOR;
    const [sdx, sdy] = [dx * strength, dy * strength];

    game.velX += sdx;
    game.velY += sdy;

    if (game.strokes === 0) {
        game.levelStart = millis();
    }

    SOUNDS.HIT.rate(random(0.95, 1.05));
    SOUNDS.HIT.play();

    game.strokes += 1;
}

function reset() {
    SOUNDS.JUMPSCARE.stop();
    loadLevel(game.level);
}

function normalize([x, y]) {
    const mag = sqrt(x * x + y * y);
    return [x / mag, y / mag];
}

function levelTime() {
    if (game.won) {
        return game.wonMillis - game.levelStart;
    } else if (game.levelStart > 0) {
        return millis() - game.levelStart;
    } else {
        return 0;
    }
}

function boing() {
    SOUNDS.BOING.rate(random(0.95, 1.05));
    SOUNDS.BOING.play();
}

function update() {
    const level = LEVELS[game.level];

    if (millis() % 2000 < 100) {
        game.nextGif = `NORMAL${floor(random(0, 5))}`;
        game.currentGif = 'STATIC';
    } else {
        game.currentGif = game.nextGif;
    }

    game.levelAnim = lerp(game.levelAnim, 0, 0.05);

    if (input.keys['J'.charCodeAt(0)] === 0) {
        game.squish = 0.5;
    }

    if (input.keys['R'.charCodeAt(0)] === 0) {
        reset();
    }

    if (game.jumpscare) {
        return;
    }

    let closestFrom, closestTo, closestDist = Infinity;
    for (const wall of level.walls) {
        
        for (let i = 0; i < wall.length; i += 1) {
            const wallFrom = wall[i];
            const wallTo = wall[(i + 1) % wall.length];

            const intersect = lineIntersect(game.posX, game.posY, game.posX + game.velX * 2000, game.posY + game.velY * 2000, wallFrom[0], wallFrom[1], wallTo[0], wallTo[1]) || [Infinity, Infinity];
            const distance = dist(game.posX + game.velX, game.posY + game.velY, intersect[0], intersect[1]);
            if (intersect && distance < KARL_RADIUS && distance < closestDist) {
                closestFrom = wallFrom;
                closestTo = wallTo;
                closestDist = distance;
            }
        }
    }

    if (closestDist < Infinity) {
        const normal = normalize([closestFrom[1] - closestTo[1], closestTo[0] - closestFrom[0]]);
        const normalDotVel = game.velX * normal[0] + game.velY * normal[1];
        const newVel = [
            game.velX - 2 * normalDotVel * normal[0],
            game.velY - 2 * normalDotVel * normal[1]
        ];
        game.velX = newVel[0];
        game.velY = newVel[1];

        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;

        boing();
    }

    game.posX += game.velX;
    game.posY += game.velY;

    game.velX *= 0.98;
    game.velY *= 0.98;

    if (game.posX > 600 - KARL_RADIUS) {
        game.velX = -abs(game.velX);
        game.posX = 600 - KARL_RADIUS;
        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;
        boing();
    }
    if (game.posX < KARL_RADIUS) {
        game.velX = abs(game.velX);
        game.posX = KARL_RADIUS;
        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;
        boing();
    }

    if (game.posY > 600 - KARL_RADIUS) {
        game.velY = -abs(game.velY);
        game.posY = 600 - KARL_RADIUS;
        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;
        boing();
    }
    if (game.posY < KARL_RADIUS) {
        game.velY = abs(game.velY);
        game.posY = KARL_RADIUS;
        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;
        boing();
    }

    if (dist(0, 0, game.velX, game.velY) < 1.0) {
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

        game.strokeScore = strokeScore(game.strokes, level.par);
        game.timeScore = timeScore(game.wonMillis - game.levelStart);
        game.score = game.strokeScore + game.timeScore;

        if (reveal > prevRevel) {
            if (reveal <= 4) {
                SOUNDS.GUNSHOT.play();
            } else if (reveal == 5) {
                if (game.score < 5000) {
                    SOUNDS.RANK_IHATEYOU.play();
                } else if (game.score < 10000) {
                    SOUNDS.RANK_MID.play();
                } else if (game.score < 15000) {
                    SOUNDS.RANK_ALRIGHT.play();
                } else {
                    SOUNDS.RANK_PEAK.play();
                }
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
        game.confetti = new Array(100).fill(null).map(() => [level.hole[0] + random(-20, 20), level.hole[1] + random(-20, 20), random(-10, 10) + game.velX, random(-10, 10) + game.velY]);
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
    return floor(min(10000 / max(strokes, 1) + 1000 * par, 10000) * (strokes <= par ? 1 : 0.5));
}

function timeScore(time) {
    return floor(max(10000 - pow(time / 100, 2), 0));
}

function revealShake(threshold, length = 1) {
    const reveal = max(millis() - game.wonMillis - 1000, 0) / 500;
    const over = 1 - constrain((reveal - threshold - 1) / length, 0, 1);
    console.log(reveal, threshold, over);
    return random(-over, over);
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
    fill(100, 255, 100);
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

    textAlign(LEFT, TOP);
    fill(0);
    noStroke();
    textSize(24);

    text(`STROKES: ${game.strokes}`, 20, 300);
    text(`TIME: ${floor(levelTime() / 1000)}s ${nf(floor(levelTime() % 1000), 3, 0)}ms`, 20, 350);

    if (game.jumpscare) {
        image(IMAGES.UNCANNY, 300, 0, 600, 600);
        return;
    }

    push();
    const level = LEVELS[game.level];

    translate(300, 0);

    stroke(230);
    beginShape(LINES);
    const gridOffset = (millis() / 20) % 60;
    for (let i = 0; i < 10; i += 1) {
        vertex(0, i * 60 + gridOffset);
        vertex(600, i * 60 + gridOffset);
        vertex(i * 60 + gridOffset, 0);
        vertex(i * 60 + gridOffset, 600);
    }
    endShape();
    
    for (const wall of level.walls) {
        fill(200);
        stroke(0);
        beginShape();
        for (const [x, y] of wall) {
            vertex(x, y);
        }
        endShape(CLOSE);
    }

    endShape();

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

    push();

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16 + 8 * game.levelAnim);

    translate(150 + min(game.levelAnim * 4, 1) * 450, 200);
    rotate(sin(millis() / 200) * 0.1);
    text(`level ${game.level + 1}\n${level.name}`, 0, 0);

    pop();

    if (game.won) {

        push();
        translate(320, 50 - game.wonAnim * 400);
        stroke(0);
        fill(100);

        rect(0, 0, 560, 400);

        image(IMAGES.LEVEL_CLEAR, 30 + random(-1, 1), 10 + random(-1, 1), 500, 100);

        const reveal = floor(max(millis() - game.wonMillis - 1000, 0) / 500);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        textSize(24);
        noStroke();
        
        if (reveal > 0) {
            text(`STROKE SCORE: ${game.strokeScore}`, 30 + revealShake(0) * 2, 150 + revealShake(0) * 2);
        }
        if (reveal > 1) {
            text(`TIME SCORE: ${game.timeScore}`, 30 + revealShake(1) * 2, 180 + revealShake(1) * 2);
        }
        if (reveal > 2) {
            textSize(32);
            text(`SCORE: ${game.score}`, 30 + revealShake(2) * 2, 220 + revealShake(2) * 2);
        }
        if (reveal > 3) {
            image(IMAGES.YOUR_RANK, 0 + revealShake(3) * 2, 250 + revealShake(3) * 2, 300, 100);
        }
        if (reveal > 4) {
            const SIZE = 230;
            const posX = 310 + revealShake(4, 2) * 4;
            const posY = 120 + revealShake(4, 2) * 4;
            if (game.score < 5000) {
                image(IMAGES.RANK_IHATEYOU, posX, posY, SIZE, SIZE);
            } else if (game.score < 10000) {
                image(IMAGES.RANK_MID, posX, posY, SIZE, SIZE);
            } else if (game.score < 15000) {
                image(IMAGES.RANK_ALRIGHT, posX, posY, SIZE, SIZE);
            } else {
                image(IMAGES.RANK_PEAK, posX, posY, SIZE, SIZE);
            }

            fill(frameCount % 4 <= 1 ? 0 : 255, 0, frameCount % 2 === 0 ? 255 : 0);
            textAlign(CENTER, CENTER);
            textSize(32);
            text('CLICK TO ADVANCE', 280, 450);
        }
    }
}