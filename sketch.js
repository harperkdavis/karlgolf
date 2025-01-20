const input = { keys: {}, mouse: {} }
const game = {

    inGame: false,
    inLevelSelect: false,
    jumpscare: false,
    won: false,

    confetti: [],
    flyingText: [],

    currentGif: 'STATIC',
    nextGif: 'STATIC',

    level: 0,
    strokes: 0,
    credits: 0,

    wonAnim: 0,
    wonMillis: 0,

    prevFrame: 0,
    levelStart: 0,
    levelStartFr: 0,

    levelAnim: 0,
    bossApproaching: 0,
    garlIntro: 0,
    selectFromMenu: false,

    posX: 0,
    posY: 0,

    velX: 0,
    velY: 0,

    squish: 1,

    bossHealth: 100,

    strokeScore: 0,
    timeScore: 0,
    score: 0,

    uncanny: [[0, 0, 0, 0]],
    blessed: [],
    obstacles: {
        sand: [],
        attractors: [],
        lazers: [],
        turrets: [],
    },
    lazers: [],
    bullets: [],
    coins: [],

    strokeStartX: 0,
    strokeStartY: 0,
};

const IMAGES = {
    CANNY: 'karl.png',
    UNCANNY: 'uncanny.png',

    GARL: 'garl.png',
    GARL_TALK: 'garl_talk.png',

    GARL_0: 'garl_0.gif',
    GARL_1: 'garl_1.png',
    GARL_2: 'garl_2.png',
    GARL_3: 'garl_3.png',
    GARL_4: 'garl_4.png',
    GARL_5: 'garl_5.png',

    BLESSED: 'blessed.png',
    COIN: 'karlcoin.gif',
    ATTRACTOR: 'attractor.gif',
    REPULSOR: 'repulsor.gif',

    TURRET: 'turret.png',
    LAZER: 'lazer.png',

    LOGO: 'logo.png',
    LAPTOP: 'laptop.png',

    BOSS_ALERT: 'alert.png',
    BOSS_APPROACHING: 'boss.gif',
    BOSS_READY: 'ready.png',

    LEVEL_CLEAR: 'level_clear.png',
    YOU_WIN: 'youwin.png',
    YOUR_RANK: 'your_rank.png',

    EASY_BOSS: 'easy_boss.gif',
    TRIO_BOSS: 'trio_boss.gif',

    RANK_PERFECT: 'rank_perfect.png',
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
    NORMAL5: 'karl_dapper.gif',
    NORMAL6: 'karl_head.gif',
    NORMAL7: 'karl_preposterous.gif',
    NORMAL8: 'karl_stare.gif',
    NORMAL9: 'karl_fw.gif',
    NORMAL10: 'karl_rainbow.gif',
    NORMAL11: 'karl_explode.gif',
};

const SOUNDS = {
    JUMPSCARE: 'jumpscare.mp3',
    WIN: 'win.mp3',
    GUNSHOT: 'gunshot.mp3',
    BOSS: 'boss.mp3',
    GARL: 'garl.mp3',

    HIT: 'hit.mp3',
    BOING: 'boing.mp3',
    COIN: 'coin.mp3',
    BLESSED: 'bless.mp3',

    SECRET: 'secret_raw.mp3',

    RANK_PERFECT: 'rank_perfect.mp3',
    RANK_PEAK: 'rank_peak.mp3',
    RANK_ALRIGHT: 'rank_alright.mp3',
    RANK_MID: 'rank_mid.mp3',
    RANK_IHATEYOU: 'rank_ihateyou.mp3',

    MUSIC: 'music.mp3',
    CREDITS: 'credits.mp3',
};

function makeRect(x, y, w, h) {
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
}

function makeDiamond(x, y, r) {
    return [[x, y - r], [x + r, y], [x, y + r], [x - r, y]];
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
        name: 'the basics',
        walls: [
            makeRect(0, 0, 600, 100),
            makeRect(0, 500, 600, 100),
            makeDiamond(300, 300, 100),
        ],
        coins: [[300, 150], [300, 450]],
        obstacles: [],
        par: 2,
    },
    {
        startPos: [50, 550],
        uncannyPos: [[300, 300]],
        hole: [350, 550],
        name: 'navigation required',
        walls: [
            makeRect(0, 0, 100, 200),
            makeRect(200, 200, 300, 100),
            makeRect(200, 200, 100, 400),
            [[500, 0], [600, 0], [600, 100]],
            [[500, 400], [600, 400], [600, 500]],
            [[100, 600], [200, 500], [300, 600]],
            [[0, 0], [200, 0], [0, 200]],
        ],
        coins: [[200, 100], [300, 100], [400, 100]],
        obstacles: [],
        par: 3,
    },
    {
        startPos: [300, 100],
        uncannyPos: [[300, 550]],
        hole: [300, 550],
        name: 'come down to bounce town',
        walls: [
            makeRect(0, 0, 50, 600),
            makeRect(550, 0, 50, 600),
            makeDiamond(300, 300, 50),
            makeDiamond(150, 200, 50),
            makeDiamond(450, 200, 50),
            makeDiamond(150, 400, 50),
            makeDiamond(450, 400, 50),
        ],
        coins: [[250, 200], [350, 200], [200, 300], [400, 300], [250, 400], [350, 400]],
        obstacles: [],
        par: 2,
    },
    {
        startPos: [150, 200],
        uncannyPos: [[400, 100]],
        hole: [450, 400],
        name: 'mind the gap!',
        walls: [
            makeRect(0, 0, 100, 600),
            makeRect(500, 0, 100, 600),
            makeRect(200, 0, 200, 270),
            makeRect(200, 330, 200, 270),
        ],
        coins: [[200, 300], [250, 300], [300, 300], [350, 300], [400, 300]],
        obstacles: [],
        par: 3,
    },
    {
        startPos: [425, 550],
        uncannyPos: [[650, 550]],
        hole: [550, 550],
        name: 'cris\'s crazy city',
        walls: [
            makeRect(100, 490, 390, 10),
            makeRect(0, 390, 390, 10),
            makeRect(100, 290, 390, 10),
            makeRect(0, 190, 390, 10),
            makeRect(100, 90, 400, 10),
            makeRect(490, 100, 10, 500),
        ],
        coins: [[250, 550], [250, 450], [250, 350], [250, 250], [250, 150], [50, 550], [50, 450], [50, 350], [50, 250], [50, 150], [50, 50], [150, 50], [250, 50], [350, 50], [450, 50], [550, 100], [550, 200], [550, 300], [550, 400]],
        obstacles: [],
        par: 4,
    },
    {
        startPos: [550, 550],
        uncannyPos: [[300, 0]],
        hole: [50, 550],
        name: 'day at the beach',
        walls: [
            makeRect(250, 200, 100, 400)
        ],
        coins: [],
        obstacles: [
            { type: 'sand', x: 0, y: 0, w: 600, h: 100 }
        ],
        par: 2,
    },
    {
        startPos: [50, 50],
        uncannyPos: [[0, 600], [600, 600]],
        hole: [550, 550],
        name: 'double trouble: karl edition',
        walls: [
            [[100, 600], [200, 500], [300, 600]],
            makeDiamond(400, 450, 100),
            makeDiamond(200, 250, 100),
            makeRect(100, 0, 100, 300),
            makeDiamond(500, 50, 150),
        ],
        coins: [[50, 150], [50, 250], [200, 425], [300, 350]],
        obstacles: [{ type: 'sand', x: 300, y: 450, w: 200, h: 150 }],
        par: 3,
    },
    {
        startPos: [350, 550],
        uncannyPos: [[250, 600], [550, 600], [400, 300], [50, 50], [450, 100]],
        hole: [50, 50],
        name: 'ambush!',
        walls: [
            makeRect(0, 400, 200, 200),
            makeRect(400, 0, 200, 200),
        ],
        coins: [[250, 250], [300, 250], [350, 250], [250, 300], [300, 300], [350, 300], [250, 350], [300, 350], [350, 350]],
        obstacles: [
            { type: 'sand', x: 100, y: 0, w: 300, h: 200 },
            { type: 'sand', x: 200, y: 400, w: 300, h: 200 }
        ],
        par: 4,
    },
    {
        startPos: [50, 50],
        uncannyPos: [[50, 550]],
        hole: [300, 150],
        name: 'attractive force',
        walls: [
            makeRect(200, 250, 200, 100),
            [[100, 0], [200, 300], [300, 300], [200, 0]]
        ],
        coins: [[50, 200], [100, 350], [200, 500], [500, 250]],
        obstacles: [
            { type: 'attractor', x: 300, y: 300, str: 1 },
        ],
        par: 2,
    },
    {
        startPos: [100, 100],
        uncannyPos: [[350, 350]],
        hole: [100, 500],
        name: 'people can change for\nthe better',
        walls: [
            makeDiamond(300, 300, 50),
            [[0, 100], [200, 300], [0, 500]],
            [[400, 0], [600, 200], [600, 0]],
            [[400, 600], [600, 400], [600, 600]],
        ],
        coins: [],
        obstacles: [
            { type: 'sand', x: 400, y: 0, w: 200, h: 600 },
            { type: 'attractor', x: 300, y: 300, str: 1 },
        ],
        par: 3,
    },
    {
        startPos: [300, 450],
        uncannyPos: [[0, 0], [300, 0], [600, 0], [0, 600], [600, 600]],
        hole: [300, 50],
        name: 'boss 1: baby easy boss',
        walls: [
            makeRect(200, 350, 200, 50),
            makeRect(0, 150, 200, 50),
            makeRect(400, 150, 200, 50),
        ],
        coins: [[200, 250], [250, 250], [300, 250], [350, 250], [400, 250]],
        obstacles: [],
        par: 3,
    },
    {
        startPos: [500, 150],
        uncannyPos: [[150, 300]],
        hole: [500, 450],
        name: 'repulsive!!!',
        walls: [
            makeRect(0, 0, 600, 100),
            makeRect(0, 500, 600, 100),
            makeRect(200, 250, 400, 100),
            makeDiamond(200, 300, 50),
        ],
        coins: [[250, 150], [150, 150], [50, 150], [250, 450], [150, 450], [50, 450]],
        obstacles: [
            { type: 'attractor', x: 300, y: 150, str: -1 },
            { type: 'attractor', x: 300, y: 450, str: -1 },
        ],
        par: 4,
    },
    {
        startPos: [500, 300],
        uncannyPos: [[150, 300]],
        hole: [500, 50],
        name: 'git simulator (push and pull)',
        walls: [
            makeRect(300, 200, 400, 50),
            makeDiamond(300, 300, 100)
        ],
        coins: [[50, 300],[100, 300], [150, 300]],
        obstacles: [
            { type: 'attractor', x: 50, y: 50, str: -1 },
            { type: 'attractor', x: 550, y: 550, str: -1 },
            { type: 'attractor', x: 550, y: 50, str: 1 },
            { type: 'attractor', x: 50, y: 550, str: 1 },
            { type: 'attractor', x: 300, y: 300, str: 0.1 },
        ],
        par: 2,
    },
    {
        startPos: [50, 50],
        uncannyPos: [[300, 200], [200, 500], [500, 500]],
        hole: [550, 50],
        name: 'doorways',
        walls: [
            makeRect(100, 0, 50, 100),
            makeDiamond(125, 100, 25),
            makeRect(100, 250, 50, 400),
            makeDiamond(125, 250, 25),
            makeDiamond(350, 150, 100),
            makeDiamond(300, 0, 200),
            makeRect(325, 350, 50, 300),
            makeDiamond(350, 350, 25),
        ],
        coins: [],
        obstacles: [
            { type: 'sand', x: 100, y: 100, w: 50, h: 150 },
            { type: 'sand', x: 325, y: 200, w: 50, h: 150 }
        ],
        par: 3,
    },
    {
        startPos: [200, 50],
        uncannyPos: [[50, -150]],
        hole: [400, 550],
        name: 'lazer tag',
        walls: [
            makeRect(0, 100, 200, 50),
            makeRect(400, 200, 50, 200),
        ],
        coins: [[300, 100], [300, 200], [300, 300], [300, 400], [300, 500]],
        obstacles: [
            { type: 'lazer', x: 500, y: 300, dir: Math.PI, dx: 0, dy: 200, freq: 1000 },
        ],
        par: 3,
    },
    {
        startPos: [550, 50],
        uncannyPos: [[300, 300]],
        hole: [50, 50],
        name: 'around we go',
        walls: [
            makeRect(275, 0, 50, 200),
            makeRect(400, 250, 50, 100),
            makeRect(250, 400, 100, 50),
            makeRect(150, 250, 50, 100),
        ],
        coins: [[500, 250], [500, 350], [250, 500], [350, 500], [100, 250], [100, 350]],
        obstacles: [
            { type: 'lazer', x: 300, y: 250, dir: -Math.PI / 2, dx: 100, dy: 0, freq: 1000 },
            { type: 'lazer', x: 350, y: 300, dir: 0, dx: 0, dy: 100, freq: 1000 },
            { type: 'lazer', x: 300, y: 350, dir: Math.PI / 2, dx: -100, dy: 0, freq: 1000 },
            { type: 'lazer', x: 250, y: 300, dir: Math.PI, dx: 0, dy: -100, freq: 1000 },
            { type: 'sand', x: 500, y: 500, w: 100, h: 100 },
            { type: 'sand', x: 0, y: 500, w: 100, h: 100 },
        ],
        par: 5,
    },
    {
        startPos: [100, 550],
        uncannyPos: [[600, 300]],
        hole: [550, 50],
        name: 'carefully...',
        walls: [
            [[150, 0], [150, 150], [300, 0]],
            makeRect(0, 450, 100, 50),
            makeRect(500, 100, 100, 50),
            makeRect(150, 100, 50, 100),
            makeRect(400, 100, 50, 100),
            makeRect(150, 400, 50, 100),
            makeRect(400, 400, 50, 100),
        ],
        coins: [[300, 200], [300, 300], [300, 400], [50, 50], [100, 50], [50, 100], [100, 100]],
        obstacles: [
            { type: 'lazer', x: 475, y: 300, dir: Math.PI, dx: 0, dy: 200, freq: 500 },
            { type: 'lazer', x: 125, y: 300, dir: 0, dx: 0, dy: -200, freq: 500 },
        ],
        par: 4,
    },
    {
        startPos: [50, 300],
        uncannyPos: [[450, 300]],
        hole: [550, 300],
        name: 'turning tides',
        walls: [
            makeRect(150, 50, 50, 450),
            makeRect(400, 100, 50, 450),
        ],
        coins: [],
        obstacles: [
            { type: 'lazer', x: 600, y: 25, dy: 50, dx:0, dir: Math.PI, freq: 2000 },
            { type: 'lazer', x: 600, y: 575, dy: 50, dx:0, dir: Math.PI, freq: 2000 },
        ],
        par: 4,
    },
    {
        startPos: [50, 50],
        uncannyPos: [[300, 300]],
        hole: [550, 550],
        name: 'time it right',
        walls: [
            makeRect(0, 150, 200, 50),
            makeRect(0, 400, 200, 50),
        ],
        coins: [[300, 200], [300, 300], [300, 400]],
        obstacles: [
            { type: 'lazer', x: 300, y: 300, dir: Math.PI / 4, dx: -150, dy: 150, freq: 2000 },
            { type: 'lazer', x: 300, y: 300, dir: -Math.PI / 4, dx: 150, dy: 150, freq: 2000 },
        ],
        par: 4,
    },
    {
        startPos: [25, 575],
        uncannyPos: [],
        hole: [550, 50],
        name: 'take a little break :)',
        walls: [],
        coins: new Array(100).fill(0).map((_, i) => [(i % 10) * 50 + 75, Math.floor(i / 10) * 50 + 75]),
        obstacles: [],
        par: 10,
    },
    {
        startPos: [300, 550],
        uncannyPos: [[50, 550]],
        hole: [550, 50],
        name: 'the opps caught you lacking',
        walls: [
            makeRect(0, 450, 500, 50),
            makeRect(100, 100, 500, 50),
        ],
        coins: [[150, 300], [450, 300], [200, 50], [300, 50], [400, 50]],
        obstacles: [
            { type: 'turret', x: 300, y: 300, freq: 1000 },
            { type: 'sand', x: 0, y: 0, w: 100, h: 150 },
        ],
        par: 4,
    },
    {
        startPos: [300, 550],
        uncannyPos: [[300, 50]],
        hole: [300, 50],
        name: 'this is a robbery!',
        walls: [
            makeRect(0, 0, 200, 600),
            makeRect(400, 0, 200, 600)
        ],
        coins: [],
        obstacles: [
            { type: 'turret', x: 200, y: 300, freq: 400 },
            { type: 'turret', x: 400, y: 300, freq: 400 },
            { type: 'turret', x: 200, y: 200, freq: 400 },
            { type: 'turret', x: 400, y: 200, freq: 400 },
            { type: 'turret', x: 200, y: 400, freq: 400 },
            { type: 'turret', x: 400, y: 400, freq: 400 },
            { type: 'turret', x: 300, y: 0, freq: 400 },
            { type: 'sand', x: 0, y: 0, w: 600, h: 600 }
        ],
        par: 6,
    },
    {
        startPos: [100, 550],
        uncannyPos: [[100, 425], [200, 425], [400, 225], [500, 225]],
        hole: [300, 50],
        name: 'boss 2: the trio',
        walls: [
            [[100, 600], [600, 550], [600, 600]],
            [[0, 500], [500, 450], [500, 400], [0, 350]],
            [[100, 200], [100, 250], [600, 300], [600, 150]]
        ],
        coins: [],
        obstacles: [
            { type: 'turret', x: 600, y: 425, freq: 2000 },
            { type: 'turret', x: 0, y: 225, freq: 2000 },
        ],
        par: 4,
    },
    {
        startPos: [50, 550],
        uncannyPos: [[450, 300]],
        hole: [50, 50],
        name: 'scientific equipment',
        walls: [
            makeRect(350, 250, 50, 100),
        ],
        coins: [[375, 400], [375, 200], [450, 300]],
        obstacles: [
            { type: 'attractor', x: 200, y: 300, str: 1 },
            { type: 'sand', x: 400, y: 250, w: 100, h: 100 },
            { type: 'lazer', x: 300, y: 300, dy: 0, dx:0, dir: Math.PI, freq: 2000 },
        ],
        par: 2,
    },
    {
        startPos: [450, 50],
        uncannyPos: [[700, 200]],
        hole: [400, 200],
        name: 'home invasion',
        walls: [
            makeRect(0, 130, 450, 20),
            makeRect(200, 300, 250, 20),
            makeRect(450, 130, 20, 320),
            makeRect(100, 450, 370, 20),
        ],
        coins: [[200, 200], [250, 200], [300, 200], [200, 250], [250, 250], [300, 250]],
        obstacles: [
            { type: 'sand', x: 450, y: 450, w: 20, h: 150 },
            { type: 'turret', x: 400, y: 400, freq: 3000 },
            { type: 'turret', x: 50, y: 200, freq: 3000 },
            { type: 'lazer', x: 100, y: 400, dy: 0, dx: 50, dir: Math.PI / 2, freq: 1000 },
        ],
        par: 4,
    },
    {
        startPos: [300, 550],
        uncannyPos: [[300, 300]],
        hole: [300, 50],
        name: 'don\'t fall off!',
        walls: [
            makeRect(50, 450, 50, 100),
            makeRect(50, 275, 50, 50),
            makeDiamond(300, 300, 100),
            makeRect(500, 250, 50, 100),
            makeRect(50, 0, 50, 100),
            makeRect(350, 0, 50, 100),
            makeRect(250, 100, 150, 20),
        ],
        coins: [[150, 200], [150, 300], [150, 400], [450, 300]],
        obstacles: [
            { type: 'lazer', x: 20, y: 0, dy: 0, dx: 10, dir: Math.PI / 2, freq: 100 },
            { type: 'lazer', x: 580, y: 0, dy: 0, dx: 10, dir: Math.PI / 2, freq: 100 },
            { type: 'sand', x: 480, y: 250, w: 20, h: 100, },
            { type: 'attractor', x: 580, y: 100, str: 0.2 },
            { type: 'attractor', x: 580, y: 200, str: 0.2 },
            { type: 'attractor', x: 580, y: 300, str: 0.1 },
            { type: 'attractor', x: 580, y: 400, str: 0.2 },
            { type: 'attractor', x: 580, y: 500, str: 0.2 },
            { type: 'attractor', x: 20, y: 100, str: 0.2 },
            { type: 'attractor', x: 20, y: 200, str: 0.2 },
            { type: 'attractor', x: 20, y: 300, str: 0.1 },
            { type: 'attractor', x: 20, y: 400, str: 0.2 },
            { type: 'attractor', x: 20, y: 500, str: 0.2 },
        ],
        par: 3,
    },
    {
        startPos: [50, 300],
        uncannyPos: [[300, 400]],
        hole: [550, 50],
        name: 'thread the needle',
        walls: [
            makeRect(450, 0, 50, 250),
            makeRect(450, 350, 50, 250),
        ],
        coins: [[300, 550], [475, 300], [550, 150], [550, 250]],
        obstacles: [
            { type: 'turret', x: 300, y: 100, freq: 1000 },
            { type: 'turret', x: 300, y: 200, freq: 1000 },
            { type: 'turret', x: 300, y: 400, freq: 1000 },
            { type: 'attractor', x: 300, y: 300, str: -0.5 },
            { type: 'attractor', x: 550, y: 600, str: 0.5 },
            { type: 'lazer', x: 600, y: 550, dy: 0, dx: 0, dir: Math.PI, freq: 100 }
        ],
        par: 4,
    },
    {
        startPos: [550, 550],
        uncannyPos: [
            [200, 0], [200, 100], [200, 200], [200, 300], [200, 400], [200, 500], [200, 600],
            [300, 0], [300, 100], [300, 200], [300, 300], [300, 400], [300, 500], [300, 600],
            [400, 0], [400, 100], [400, 200], [400, 300], [400, 400], [400, 500], [400, 600],
        ],
        hole: [50, 50],
        name: 'the swarm beckons',
        walls: [
            makeRect(0, 100, 200, 400)
        ],
        coins: [],
        obstacles: [
            { type: 'attractor', x: 500, y: 400, str: 0.001 },
            { type: 'attractor', x: 500, y: 450, str: 0.001 },
            { type: 'attractor', x: 500, y: 350, str: 0.001 },
            { type: 'attractor', x: 500, y: 300, str: 0.001 },
        ],
        par: 3,
    },
    {
        startPos: [50, 500],
        uncannyPos: [[50, 100]],
        hole: [550, 100],
        name: 'precision instruments',
        walls: [
            makeRect(130, 400, 40, 20),
            makeRect(280, 200, 40, 20),
            makeRect(430, 400, 40, 20),
        ],
        coins: [],
        obstacles: [
            { type: 'lazer', x: 0, y: 575, dir: 0, dx: 0, dy: 0, freq: 100 }, 
            { type: 'lazer', x: 0, y: 25, dir: 0, dx: 0, dy: 0, freq: 100 },
            { type: 'lazer', x: 150, y: 0, dir: Math.PI / 2, dx: 20, dy: 0, freq: 1000 }, 
            { type: 'lazer', x: 300, y: 600, dir: -Math.PI / 2, dx: 20, dy: 0, freq: 1000 },
            { type: 'lazer', x: 450, y: 0, dir: Math.PI / 2, dx: 20, dy: 0, freq: 1000 },
        ],
        par: 5,
    },
    {
        startPos: [50, 300],
        uncannyPos: [[300, 250],[300, 350]],
        hole: [550, 300],
        name: 'try try again',
        walls: [
            [[0, 0], [0, 250], [250, 0]],
            [[0, 350], [0, 600], [250, 600]],
            [[350, 0], [600, 250], [600, 0]],
            [[350, 600], [600, 350], [600, 600]],
            makeRect(0, 0, 600, 100),
            makeRect(0, 500, 600, 100),
            makeDiamond(300, 300, 100),
        ],
        coins: [],
        obstacles: [],
        par: 2,
    },
    {
        startPos: [300, 550],
        uncannyPos: [[300, 300]],
        hole: [550, 50],
        name: 'the end is not far',
        walls: [
            makeDiamond(600, 250, 200),
            [[200, 0], [400, 0], [200, 200]],
            makeRect(400, 250, 200, 350),
            makeRect(0, 0, 200, 600),
        ],
        coins: [],
        obstacles: [
            { type: 'attractor', x: 200, y: 200, str: -1 },
        ],
        par: 1,
    },
    {
        startPos: [50, 50],
        uncannyPos: [[150, 300], [450, 300]],
        hole: [550, 550],
        name: 'keep going',
        walls: [
            makeRect(0, 200, 200, 200),
            makeRect(400, 200, 200, 200),
            [[0, 200], [0, 600], [400, 600]],
            [[200, 0], [600, 0], [600, 400]],
        ],
        coins: [],
        obstacles: [
            { type: 'turret', x: 300, y: 300, freq: 1000 },
        ],
        par: 1,
    },
    {
        startPos: [550, 50],
        uncannyPos: [[100, 100], [200, 400], [500, 500]],
        hole: [50, 550],
        name: 'almost there',
        walls: [
            makeRect(0, 0, 200, 200),
            makeRect(400, 400, 200, 200),
        ],
        coins: [],
        obstacles: [
            { type: 'lazer', x: 50, y: 400,  dir: -Math.PI / 4, dx: 25, dy: 25, freq: 1000 },
            { type: 'lazer', x: 200, y: 550,  dir: -Math.PI / 4, dx: -25, dy: -25, freq: 1000 },
        ],
        par: 1,
    },
    {
        startPos: [50, 300],
        uncannyPos: [[50, 50], [550, 550]],
        hole: [550, 300],
        name: 'seconds away',
        walls: [
            makeDiamond(150, 300, 75),
            makeDiamond(450, 300, 75),
            makeDiamond(300, 150, 75),
            makeDiamond(300, 450, 75),
            makeRect(450, 450, 150, 150),
            makeRect(0, 0, 150, 150),
        ],
        coins: [],
        obstacles: [
            { type: 'lazer', x: 0, y: 580, dx: 0, dy: 10, dir: 0, freq: 500 },
            { type: 'lazer', x: 600, y: 20, dx: 0, dy: -10, dir: Math.PI, freq: 500 },
        ],
        par: 1,
    },
    {
        startPos: [300, 400],
        uncannyPos: [[300, 100]],
        hole: [-100, -100],
        name: 'final boss: GARL KLANDER',
        walls: [
            [[0, 500], [200, 600], [0, 600]],
            [[400, 600], [600, 500], [600, 600]],
            [[0, 250], [50, 300], [0, 350]],
            [[200, 500], [300, 450], [400, 500]],
            makeDiamond(300, 200, 100),
            makeDiamond(600, 300, 50),
        ],
        coins: [],
        obstacles: 
        [
            { type: 'attractor', x: 300, y: 300, str: 0.01 },
        ],
        par: 100,
    },
];

class AudioWrapper {

    constructor(url) {
        this.audio = new Audio(url);
        this.audio.volume = 0.5;
        this.audio.preservesPitch = false;
        this.audio.pause();
    }

    play(rate = 1.0) {
        this.audio.playbackRate = rate;
        this.audio.currentTime = 0;
        if (this.audio.paused) {
            console.log(this.audio);
            try {
                this.audio.play();
            } catch (e) {}
        }
    }

    playMusicLoop(volume) {
        this.audio.play();
        this.audio.loop = true;
        this.audio.volume = volume;
    }

    pauseMusic() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.loop = false;
        this.audio.currentTime = 0;
    }

}

function preload() {
    for (const key in IMAGES) {
        IMAGES[key] = loadImage(`assets/images/${IMAGES[key]}`);
    }
    for (const key in GIFS) {
        GIFS[key] = loadImage(`assets/gifs/${GIFS[key]}`);
    }
    for (const key in SOUNDS) {
        SOUNDS[key] = new AudioWrapper(`assets/sounds/${SOUNDS[key]}`);
        SOUNDS[key].stop();
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

    game.flyingText = [];

    game.posX = level.startPos[0];
    game.posY = level.startPos[1];

    game.uncanny = level.uncannyPos.map(([x, y]) => [x, y, 0, 0]);
    game.coins = (level.coins || []).map(c => [c[0], c[1], 0, 0]);
    game.blessed = [];

    game.obstacles.sand = level.obstacles.filter(o => o.type === 'sand').map(o => [o.x, o.y, o.w, o.h]);
    game.obstacles.attractors = level.obstacles.filter(o => o.type === 'attractor').map(o => [o.x, o.y, o.str]);
    game.obstacles.lazers = level.obstacles.filter(o => o.type === 'lazer').map(o => [o.x, o.y, o.dir, o.dx, o.dy, o.freq]);
    game.obstacles.turrets = level.obstacles.filter(o => o.type === 'turret').map(o => [o.x, o.y, o.freq || 1000, 0, !!o.homing, !!o.uncanny]);

    game.lazers = [];
    game.bullets = [];

    game.velX = 0;
    game.velY = 0;

    game.bossHealth = 100;

    game.levelStart = 0;
    game.levelStartFr = millis();
}

function nextLevel() {
    game.level += 1;

    if (isBossLevel()) {
        game.bossApproaching = millis();
        SOUNDS.MUSIC.pauseMusic();
    } else if (game.level === 30) {
        game.garlIntro = millis();
        SOUNDS.MUSIC.pauseMusic();
    } else {
        reset();
    }
}

// STOLEN CODE SECTION !!!

function distanceToLine(pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY) {
    const A = pointX - lineStartX;
    const B = pointY - lineStartY;
    const C = lineEndX - lineStartX;
    const D = lineEndY - lineStartY;
  
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
  
    if (lenSq !== 0) {
        param = dot / lenSq;
    }
  
    let xx, yy;
  
    if (param < 0) {
        xx = lineStartX;
        yy = lineStartY;
    } else if (param > 1) {
        xx = lineEndX;
        yy = lineEndY;
    } else {
        xx = lineStartX + param * C;
        yy = lineStartY + param * D;
    }
  
    const dx = pointX - xx;
    const dy = pointY - yy;
  
    return Math.sqrt(dx * dx + dy * dy);
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
}

function setLevel(level) {
    game.level = level;
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
    SOUNDS.MUSIC.playMusicLoop(0.2);
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
    return (isBossLevel() || (game.velX === 0 && game.velY === 0)) && !game.jumpscare && !game.won;
}

function mouseReleased() {
    if (game.inGame && game.strokeStartX > 0 && game.strokeStartY > 0) {
        if (game.credits > 0) {
            game.credits = 0;
            SOUNDS.CREDITS.stop();
            game.inGame = false;
            game.inLevelSelect = false;
        } else {
            if (game.bossApproaching > 0 || game.garlIntro > 0) {
                reset();
            } else if (game.won) {
                if (game.level === 35) {
                    game.credits = millis();
                    SOUNDS.MUSIC.stop();
                    SOUNDS.CREDITS.playMusicLoop();
                } else {
                    if (game.selectFromMenu) {
                        game.inGame = false;
                    } else {
                        nextLevel();
                    }
                }
            } else {
                if (rawStrokeStrength() > 20 && canStroke()) {
                    strokeThatThang();
                }
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
const ATTRACTOR_DISTANCE_DIV = 40;
const ATTRACTOR_STRENGTH = 12;
const BULLET_SPEED = 1;

function strokeThatThang() {
    // should never be called if not in game.
    const [dx, dy] = strokeNormalized();
    const strength = (strokeStrength() ** 2) * MAX_STROKE_POWER * POWER_FACTOR;
    const [sdx, sdy] = [dx * strength, dy * strength];

    game.velX += sdx;
    game.velY += sdy;

    if (game.strokes === 0) {
        game.levelStart = millis();
    }

    SOUNDS.HIT.play(random(0.95, 1.05));

    game.strokes += 1;
}

function reset() {
    SOUNDS.JUMPSCARE.stop();
    game.bossApproaching = 0;
    game.garlIntro = 0;
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

function isBossLevel() {
    return game.level % 12 === 11;
}

function boing() {
    SOUNDS.BOING.play(random(0.95, 1.05));
}

function isWithin(px, py, x, y, w, h) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
}

function mouseIsWithin(x, y, w, h) {
    return isWithin(mouseX, mouseY, x, y, w, h);
}

function drawButton(x, y, w, h, onClick) {
    rect(x, y, w, h);
    if (mouseIsWithin(x, y, w, h) && input.mouse[LEFT] === 1) {
        onClick();
    }
}

function lazerPos(lazer) {
    const t = sin((millis() - game.levelStartFr) / lazer[5]);
    return [lazer[0] + t * lazer[3], lazer[1] + t * lazer[4]];
}

function die() {
    if (game.won) {
        return;
    }
    if (game.level > 30 && game.level < 35) {
        game.level = 30;
    }
    if (!game.jumpscare) {
        SOUNDS.JUMPSCARE.play();
    }
    game.jumpscare = true;
}

function update() {
    if (!game.inGame) {
        game.currentGif = 'STATIC';
        return;
    }
    
    const level = LEVELS[game.level];

    if (millis() % 2000 < 100) {
        game.nextGif = `NORMAL${floor(random(0, 12))}`;
        game.currentGif = 'STATIC';
    } else {
        game.currentGif = game.nextGif;
    }

    game.levelAnim = lerp(game.levelAnim, 0, 0.05);

    if (input.keys['J'.charCodeAt(0)] === 0) {
        if (game.level === 35) {
            game.bossHealth = 0;
        } else {
            nextLevel();
        }
    }

    if (input.keys['R'.charCodeAt(0)] === 0) {
        reset();
    }

    if (game.jumpscare || game.bossApproaching > 0 || game.garlIntro > 0 || game.credits > 0) {
        return;
    }

    game.lazers = game.obstacles.lazers.map(l => { 
        const p = lazerPos(l);
        return [p[0], p[1], max(p[0] + cos(l[2]) * 10000, 0), p[1] + sin(l[2]) * 10000];
    });

    let closestFrom, closestTo, closestDist = Infinity;
    const [py, px] = normalize([game.velX, game.velY]);
    const CHECKS = [
        [game.posX, game.posY], 
        [game.posX + px * KARL_RADIUS / 2, game.posY + py * KARL_RADIUS / 2],
        [game.posX - px * KARL_RADIUS / 2, game.posY - py * KARL_RADIUS / 2],
    ];
    for (const wall of level.walls) {
        
        for (let i = 0; i < wall.length; i += 1) {
            for (let c = 0; c < 3; c += 1) {
                
                const wallFrom = wall[i];
                const wallTo = wall[(i + 1) % wall.length];

                const intersect = lineIntersect(CHECKS[c][0], CHECKS[c][1], CHECKS[c][0] + game.velX * 2000, CHECKS[c][1] + game.velY * 2000, wallFrom[0], wallFrom[1], wallTo[0], wallTo[1]) || [Infinity, Infinity];
                const distance = dist(CHECKS[c][0] + game.velX, CHECKS[c][1] + game.velY, intersect[0], intersect[1]);
                if (intersect && distance < KARL_RADIUS && distance < closestDist) {
                    closestFrom = wallFrom;
                    closestTo = wallTo;
                    closestDist = distance;
                }

                for (const lazer of game.lazers) {
                    const intersect = lineIntersect(...lazer, wallFrom[0], wallFrom[1], wallTo[0], wallTo[1]);
                    if (intersect) {
                        lazer[2] = intersect[0];
                        lazer[3] = intersect[1];
                    }
                }
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

    if (game.obstacles.attractors.length > 0 && (game.velX != 0 || game.velY != 0)) {
        let gravity = [0, 0];
        for (const [ax, ay, strength] of game.obstacles.attractors) {
            const distance = dist(ax, ay, game.posX, game.posY);
            const d = (distance / ATTRACTOR_DISTANCE_DIV + 1) ** 2;
            const n = normalize([ax - game.posX, ay - game.posY]);
            gravity[0] += strength * ATTRACTOR_STRENGTH * n[0] / d;
            gravity[1] += strength * ATTRACTOR_STRENGTH * n[1] / d;
        }
        game.velX += gravity[0];
        game.velY += gravity[1];
    }

    for (const sand of game.obstacles.sand) {
        if (isWithin(game.posX, game.posY, ...sand)) {
            game.velX *= 0.8;
            game.velY *= 0.8;
        }
    }

    game.posX += game.velX;
    game.posY += game.velY;

    for (const lazer of game.lazers) {
        if (distanceToLine(game.posX, game.posY, ...lazer) < KARL_RADIUS / 2) {
            die();
            return;
        }
    }

    if (game.level === 35) {
        const distMag = dist(game.posX, game.posY, 300, 25);
        if (distMag < 100) {
            const velMag = dist(0, 0, game.velX, game.velY);
            const normDist = normalize([game.posX - 300, game.posY - 25]);
            console.log(velMag, normDist);
            game.posX += normDist[0] * (100 - distMag);
            game.posY += normDist[1] * (100 - distMag);
            game.velX = velMag * normDist[0];
            game.velY = velMag * normDist[1];
            game.bossHealth -= 1;
        }
    }

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
        if (isBossLevel() && !game.won) {
            die();
        }
        boing();
    }
    if (game.posY < KARL_RADIUS) {
        game.velY = abs(game.velY);
        game.posY = KARL_RADIUS;
        game.squish += (abs(game.velX) - abs(game.velY)) * SQUISH_FACTOR;
        boing();
    }

    if (isBossLevel()) {
        game.velY += 0.1;
    }

    if (dist(0, 0, game.velX, game.velY) < 1.0 && !isBossLevel()) {
        game.velX = 0;
        game.velY = 0;
    }

    game.flyingText = game.flyingText.map((f) => {
        f.pos = [f.pos[0] + f.vel[0], f.pos[1] + f.vel[1]];
        f.vel[1] += 0.2;
        return f;
    }).filter(f => f.pos[0] > 0 && f.pos[0] < 600 && f.pos[1] > 0 && f.pos[1] < 600);

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

        const prevReveal = floor(max(game.prevFrame - game.wonMillis - 1000, 0) / 500);
        const reveal = floor(max(millis() - game.wonMillis - 1000, 0) / 500);

        game.strokeScore = strokeScore(game.strokes, level.par);
        game.timeScore = timeScore(game.wonMillis - game.levelStart, level.par);
        game.score = game.strokeScore + game.timeScore;

        if (reveal > prevReveal) {
            if (reveal <= 4) {
                SOUNDS.GUNSHOT.play();
            } else if (reveal == 5) {
                if (game.score < 5000) {
                    SOUNDS.RANK_IHATEYOU.play();
                } else if (game.score < 10000) {
                    SOUNDS.RANK_MID.play();
                } else if (game.score < 15000) {
                    SOUNDS.RANK_ALRIGHT.play();
                } else if (game.score < 20000) {
                    SOUNDS.RANK_PEAK.play();
                } else {
                    SOUNDS.RANK_PERFECT.play();
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
        return;
    }

    const deltaTime = (frameRate() ? 1 / frameRate() : 0) * 1000;
    for (const turret of game.obstacles.turrets) {
        const dir = atan2(game.posY - turret[1], game.posX - turret[0]);
        if (game.levelStart > 0) {
            turret[3] += deltaTime;
            if (turret[3] > turret[2]) {
                game.bullets.push([turret[0], turret[1], cos(dir), sin(dir)]);
                turret[3] %= turret[2];
            }
        }
    }

    game.bullets = game.bullets.filter(b => {
        b[0] += b[2] * BULLET_SPEED;
        b[1] += b[3] * BULLET_SPEED;
        if (dist(b[0], b[1], game.posX, game.posY) < KARL_RADIUS) {
            die();
        }
        return isWithin(b[0], b[1], 0, 0, 600, 600);
    })

    game.coins = game.coins.filter(c => {
        c[0] += c[2];
        c[1] += c[3];
        c[2] *= 0.9;
        c[3] *= 0.9;
        if (dist(game.posX, game.posY, c[0], c[1]) < KARL_RADIUS * 2) {
            SOUNDS.COIN.play();
            game.levelStart = min(game.levelStart + 200, millis());
            game.flyingText.push({
                text: '-200ms',
                pos: [...c],
                vel: [random(-4, 4), random(-2, -4)],
            })
            return false;
        }
        return true;
    });

    for (const unc of game.uncanny) {
        const uncannyMagnitude = dist(game.posX, game.posY, unc[0], unc[1]);

        if (uncannyMagnitude < KARL_RADIUS * 1.5) {
            die();
        }

        const uncannyDiffX = game.posX - unc[0];
        const uncannyDiffY = game.posY - unc[1];

        unc[0] += unc[2];
        unc[1] += unc[3];

        unc[2] = lerp(unc[2], uncannyDiffX / uncannyMagnitude * UNCANNY_SPEED, 0.05);
        unc[3] = lerp(unc[3], uncannyDiffY / uncannyMagnitude * UNCANNY_SPEED, 0.05);
    }

    game.uncanny = game.uncanny.filter(unc => {
        if (game.obstacles.attractors.some(att => dist(unc[0], unc[1], att[0], att[1]) < KARL_RADIUS * 2)) {
            game.blessed.push([unc[0], unc[1], 1]);
            SOUNDS.BLESSED.play();
            for (let i = 0; i < 8; i += 1) {
                const theta = i * QUARTER_PI;
                game.coins.push([unc[0], unc[1], cos(theta) * 10, sin(theta) * 10]);
            }
            return false;
        }
        return true;
    });

    game.blessed = game.blessed.filter(bl => {
        bl[2] = lerp(bl[2], 0, 0.1);
        if (game.level === 35) {
            bl[0] = lerp(bl[0], 300, 0.05);
            bl[1] = lerp(bl[1], 0, 0.05);

            if (dist(bl[0], bl[1], 300, 20) < 50) {
                game.bossHealth -= 20;
                game.uncanny.push([300, 20, random(-20, 20), 20]);
                return false;
            }
        }
        return true;
    });

    if (game.bossHealth <= 0) {
        game.bossHealth = 0;
        game.won = true;
        game.wonAnim = 1;
        game.wonMillis = millis();
        game.confetti = new Array(100).fill(null).map(() => [300 + random(-20, 20), 20 + random(-20, 20), random(-10, 10) + game.velX, random(-10, 10) + game.velY]);
    }
}

function strokeScore(strokes, par) {
    return floor(min(10000 / max(strokes, 1) + 1000 * par, 10000) * (strokes <= par ? 1 : 0.5));
}

function timeScore(time, par) {
    return floor(max(10000 - pow(max(time - par * 1000, 0) / 100, 2), 0));
}

function revealShake(threshold, length = 1, start = game.wonMillis) {
    const reveal = max(millis() - start - 1000, 0) / 500;
    const over = 1 - constrain((reveal - threshold - 1) / length, 0, 1);
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
    fill(255);
    noStroke();
    rect(33, 422, 230, 110);
    image(GIFS[game.currentGif], 33, 422, 230, 110);
    image(IMAGES.CANNY, 199, 499, 100, 100);

    if (!game.inGame) {

        if (!game.inLevelSelect) {
            image(IMAGES.LOGO, 400, 100, 400, 200);

            fill(200);
            stroke(0);
            drawButton(400, 350, 400, 40, () => {
                game.inGame = true;
                game.bossHealth = 0;
                setLevel(0);
                reset();
            });
            drawButton(400, 400, 400, 40, () => {
                game.inLevelSelect = true;
            });

            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(24);
            text('PLAY FROM START', 600, 370);
            text('SELECT LEVEL', 600, 420);
        } else {
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(24);

            fill(230);
            stroke(0);
            drawButton(50, 300, 200, 100, () => {
                game.inLevelSelect = false;
            })

            fill(0);
            noStroke();
            text('< back', 150, 350);
            
            for (let i = 0; i < 36; i += 1) {
                const y = floor(i / 6);
                const x = i % 6;

                fill(230);
                stroke(0);
                drawButton(300 + x * 100, y * 100, 100, 100, () => {
                    game.selectFromMenu = true;
                    game.inGame = true;
                    setLevel(i);
                    reset();
                });

                fill(0);
                noStroke();
                text(i + 1, 300 + x * 100 + 50, y * 100 + 50);
            }

        }


        return;
    }

    // draw game

    if (game.credits > 0) {
        noStroke();
        fill(255);
        rect(300, 0, 600, 600);

        const up = (millis() - game.credits) / 20;
        push();
        translate(300, 600 - up);

        image(IMAGES.LOGO, 100, 0, 400, 200);
        textAlign(CENTER, TOP);
        textSize(24);
        fill(0);
        noStroke();

        text('game art / code', 300, 300);
        text('harper k davis', 300, 350);

        text('original concept / inspiration', 300, 500);
        text('SlappyHappy2000 (SH2K)', 300, 550);

        text('featuring', 300, 700);
        text('my guy karl', 300, 750);

        text('with voice talent from', 300, 900);
        text('@kidactivisttt ig', 300, 950);

        text('thanks for playing gang <3', 300, 1100);

        pop();
        return;
    }

    if (game.bossApproaching > 0) {
        noStroke();
        fill(0);
        rect(300, 0, 600, 600);

        const prevDelta = max(game.prevFrame - game.bossApproaching, 0);
        const delta = max(millis() - game.bossApproaching, 0);
        
        const prevReveal = floor(prevDelta / 1000);
        const reveal = floor(delta / 1000);
        
        if (game.level <= 24) {
            
            

            if (reveal > prevReveal) {
                if (reveal <= 2) {
                    SOUNDS.GUNSHOT.play(0.5);
                } else if (reveal === 3) {
                    SOUNDS.BOSS.play();
                }
            }

            if (reveal > 0) {
                image(IMAGES.BOSS_ALERT, 400 + revealShake(0, 1, game.bossApproaching) * 2, 50 + revealShake(0, 1, game.bossApproaching) * 2, 400, 100);
            }
            if (reveal > 1) {
                image(IMAGES.BOSS_APPROACHING, 300 + revealShake(2, 2, game.bossApproaching) * 4, 150 + revealShake(2, 2, game.bossApproaching) * 4, 600, 200);
            }
            if (reveal > 2) {
                image(IMAGES.BOSS_READY, 400 + sin(millis() / 100) * 10 + revealShake(4, 1, game.bossApproaching), 400 + revealShake(4, 1, game.bossApproaching), 400, 100);
                fill(255 * (0.5 + 0.5 * sin(millis() / 50)), 0, 0);
                rect(300, 590 + revealShake(4, 1, game.bossApproaching) * 2, 600, 20);
            }

        } else {

            const time = millis() - game.bossApproaching;

            fill(255);
            textAlign(CENTER, CENTER)
            text('a voice taunts you from afar...', 600, 50);
            if (reveal > prevReveal && reveal === 2) {
                SOUNDS.SECRET.play();
            }

            if (time < 255 * 5) {
                tint(255, min(time / 5, 255));
            } else {
                noTint();
            }
            
            if (millis() % 100 < 50 || reveal < 2) {
                image(IMAGES.GARL, 500, 200, 200, 200);
            } else {
                image(IMAGES.GARL_TALK, 500, 200, 200, 200);
            }
            noTint();
        }

        

        game.prevFrame = millis();
        return;
    }

    if (game.garlIntro > 0) {
        noStroke();
        fill(0);
        rect(300, 0, 600, 600);

        const time = millis() - game.garlIntro;
        const prevDelta = max(game.prevFrame - game.garlIntro, 0);
        const delta = max(time, 0);

        const prevReveal = floor(prevDelta / 500);
        const reveal = floor(delta / 500);

        if (reveal > prevReveal) {
            if (reveal > 1 && reveal < 7) {
                SOUNDS.GUNSHOT.play(1);
            }
            if (reveal === 8) {
                SOUNDS.GARL.play();
            }
        }

        if (reveal > 1) {
            image(IMAGES.GARL_0, 350 + revealShake(0, 1, game.garlIntro) * 2, 20 + revealShake(0, 1, game.garlIntro) * 2, 200, 100);
        }
        if (reveal > 2) {
            image(IMAGES.GARL_1, 600 + revealShake(1, 1, game.garlIntro) * 2, 20 + revealShake(1, 1, game.garlIntro) * 2, 200, 100);
        }
        if (reveal > 3) {
            image(IMAGES.GARL_2, 350 + revealShake(2, 1, game.garlIntro) * 2, 140 + revealShake(2, 1, game.garlIntro) * 2, 175, 100);
        }
        if (reveal > 4) {
            image(IMAGES.GARL_3, 500 + revealShake(3, 1, game.garlIntro) * 2, 120 + revealShake(3, 1, game.garlIntro) * 2, 175, 100);
        }
        if (reveal > 5) {
            image(IMAGES.GARL_4, 675 + revealShake(4, 1, game.garlIntro) * 2, 140 + revealShake(4, 1, game.garlIntro) * 2, 175, 100);
        }
        if (reveal > 7) {
            image(IMAGES.GARL_5, 350 + revealShake(6, 1, game.garlIntro) * 4, 450 + revealShake(6, 1, game.garlIntro) * 4, 500, 100);
        }
        
        if (time < 255 * 5) {
            tint(255, min(time / 5, 255));
        } else {
            noTint();
        }
        image(IMAGES.GARL, 500, 200, 200, 200);

        noTint();

        game.prevFrame = millis();
        return;
    }

    textAlign(LEFT, TOP);
    fill(0);
    noStroke();
    textSize(24);

    text(`STROKES: ${game.strokes}`, 20, 300);
    let timeDisplayX = 0, timeDisplayY = 0;
    if (levelTime() > 0) {
        timeDisplayX = sin(millis() / 200) * 10;
        timeDisplayY = sin(millis() / 200) ** 4 * 10;
    }
    text(`TIME: ${floor(levelTime() / 1000)}s ${nf(floor(levelTime() % 1000), 3, 0)}ms`, 20 + timeDisplayX, 350 + timeDisplayY);

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
        vertex(1, i * 60 + gridOffset);
        vertex(600, i * 60 + gridOffset);
        vertex(i * 60 + gridOffset, 0);
        vertex(i * 60 + gridOffset, 600);
    }
    endShape();

    for (const sand of game.obstacles.sand) {
        fill(150);
        noStroke();
        rect(...sand);
    }
    
    for (const wall of level.walls) {
        fill(200);
        stroke(0);
        beginShape();
        for (const [x, y] of wall) {
            vertex(x, y);
        }
        endShape(CLOSE);
    }

    

    if (isBossLevel()) {
        fill(255 * (0.5 + 0.5 * sin(millis() / 50)), 0, 0);
        rect(0, 590, 600, 20);
    }

    fill(0);
    circle(level.hole[0], level.hole[1], HOLE_RADIUS * 2);

    if (game.level >= 30 && game.level < 35) {
        image(IMAGES.GARL, level.hole[0] - KARL_RADIUS + KARL_RADIUS * sin(millis() / 100), level.hole[1] - KARL_RADIUS + KARL_RADIUS * sin(millis() / 50), KARL_RADIUS * 2, KARL_RADIUS * 2);
    }

    for (const coin of game.coins) {
        image(
            IMAGES.COIN, 
            coin[0] - KARL_RADIUS, 
            coin[1] - KARL_RADIUS, 
            (KARL_RADIUS * 2), 
            (KARL_RADIUS * 2)
        );
    }

    for (const attractor of game.obstacles.attractors) {
        image(
            attractor[2] < 0 ? IMAGES.REPULSOR : IMAGES.ATTRACTOR, 
            attractor[0] - KARL_RADIUS, 
            attractor[1] - KARL_RADIUS, 
            (KARL_RADIUS * 2), 
            (KARL_RADIUS * 2)
        );
    }

    
    for (const bl of game.blessed) {
        const size = 1 + 0.2 * bl[2];
        image(
            IMAGES.BLESSED, 
            bl[0] - KARL_RADIUS * size, 
            bl[1] - KARL_RADIUS * size, 
            (KARL_RADIUS * 2) * size, 
            (KARL_RADIUS * 2) * size,
        );
    }

    strokeWeight(5);
    stroke(255, 0, 0);
    for (const lazer of game.lazers) {
        line(lazer[0] + random(-2, 2), lazer[1] + random(-2, 2), lazer[2] + random(-2, 2), lazer[3] + random(-2, 2));
    }
    strokeWeight(1);

    for (const lazer of game.obstacles.lazers) {
        const pos = lazerPos(lazer);
        image(
            IMAGES.LAZER, 
            pos[0] - KARL_RADIUS, 
            pos[1] - KARL_RADIUS, 
            (KARL_RADIUS * 2), 
            (KARL_RADIUS * 2)
        );
    }

    for (const turret of game.obstacles.turrets) {
        const dir = atan2(turret[1] - game.posY, turret[0] - game.posX);
        push();
        translate(turret[0], turret[1]);
        rotate(dir + Math.PI / 2);
        image(IMAGES.TURRET, 
            -KARL_RADIUS, 
            -KARL_RADIUS, 
            (KARL_RADIUS * 2), 
            (KARL_RADIUS * 2)
        )
        pop();
    }

    image(
        IMAGES.CANNY, 
        game.posX - KARL_RADIUS / game.squish, 
        game.posY - KARL_RADIUS * game.squish, 
        (KARL_RADIUS * 2) / game.squish, 
        (KARL_RADIUS * 2) * game.squish
    );

    for (const bullet of game.bullets) {
        image(IMAGES.UNCANNY, bullet[0] - KARL_RADIUS / 2, bullet[1] - KARL_RADIUS / 2, KARL_RADIUS, KARL_RADIUS);
    }

    if (!game.won) {
        for (const unc of game.uncanny) {
            image(
                IMAGES.UNCANNY, 
                unc[0] - KARL_RADIUS, 
                unc[1] - KARL_RADIUS, 
                (KARL_RADIUS * 2), 
                (KARL_RADIUS * 2)
            );
        }
    }

    if (isBossLevel()) {
        const bossIndex = floor(game.level / 12);
        if (bossIndex === 0) {
            image(IMAGES.EASY_BOSS, 250 - sin(millis() / 200) * 10, 0, 100, 100);
        } else if (bossIndex === 1) {
            image(IMAGES.TRIO_BOSS, 250 - sin(millis() / 200) * 10, 0, 100, 100)
        }
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

    for (const f of game.flyingText) {
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();
        textSize(24);
        text(f.text, f.pos[0], f.pos[1]);
    }

    if (game.level === 35) {
        image(IMAGES.GARL, 200 + random(-2, 2), random(-2, 2), 200, 100);

        strokeWeight(1);
        fill(0);
        stroke(0);
        rect(200, 20, 200, 20);
        fill(255);
        rect(200, 20, 2 * game.bossHealth, 20);
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
    textSize(20 + 8 * game.levelAnim);

    translate(150 + min(game.levelAnim * 4, 1) * 450, 225);
    rotate(sin(millis() / 200) * 0.1);
    text(`level ${game.level + 1}\n${level.name}`, 0, 0);

    pop();

    if (game.won) {

        push();
        translate(320, 50 - game.wonAnim * 400);
        stroke(0);
        fill(100);

        rect(0, 0, 560, 400);

        if (game.level === 35) {
            image(IMAGES.YOU_WIN, 30 + random(-1, 1), 10 + random(-1, 1), 500, 100);
        } else {
            image(IMAGES.LEVEL_CLEAR, 30 + random(-1, 1), 10 + random(-1, 1), 500, 100);
        }

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
            } else if (game.score < 20000) {
                image(IMAGES.RANK_PEAK, posX, posY, SIZE, SIZE);
            } else {
                image(IMAGES.RANK_PERFECT, posX, posY, SIZE, SIZE);
            }

            fill(frameCount % 4 <= 1 ? 0 : 255, 0, frameCount % 2 === 0 ? 255 : 0);
            textAlign(CENTER, CENTER);
            textSize(32);
            text('CLICK TO ADVANCE', 280, 450);
        }
    }
}