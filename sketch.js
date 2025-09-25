const noiseScale = 100;
let num = 20000;
let circles = [];
let sound;
function preload() {
    sound = loadSound("sound/background-sound.wav");
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(500);
    for (let i = 0; i < num; i++) {
        circles.push({
            pos: createVector(random(0, windowWidth), random(0, windowHeight)),
            vel: createVector(0, 0),
            thet: 0, speed: 0.3
        });
    }
    noStroke();
    colorMode(RGB, 255); // use RGB
    sound.loop();
   
}

function draw() {
    //stroke(255);
    //fill(0);
    //background(0);


    circles.forEach(c => {
        let noiseVal = noise(c.pos.x / noiseScale, c.pos.y / noiseScale);
        c.thet = noise(c.pos.x / noiseScale, c.pos.y / noiseScale) * TWO_PI;
        c.speed = noiseVal * 1;
        c.vel = createVector(c.speed * cos(c.thet), c.speed * sin(c.thet));
        c.pos.add(c.vel);

        if ((abs(c.pos.x - windowWidth / 2) > windowWidth / 2) ||
            (abs(c.pos.y - windowHeight / 2) > windowHeight / 2)) {
            c.pos.x = random(0, windowWidth);
            c.pos.y = random(0, windowHeight);
        }

        // RGB interpolation between #FF6F00 and #FFE066
        let rVal = lerp(255, 255, noiseVal);  // both are 255
        let gVal = lerp(111, 224, noiseVal);
        let bVal = lerp(0, 102, noiseVal);

        fill(rVal, gVal, bVal, noiseVal * 200); // alpha scaled by noise
        circle(c.pos.x, c.pos.y, noiseVal * 1);
    });
    



}

