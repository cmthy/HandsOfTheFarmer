// Multi-phase interactive sketch with image fill for each phase
// Requires p5.js and p5.sound
let poemLinesPhase1 = [
    "In the final dry breath,",
    "white blossoms scatter like whispers of hope,",
    "fragile stars that promise",
    "what is yet to come.",
    ""
];
let poemLinesPhase2 = [
    "Rain comes.",
    "Tiny green beads cling to the branch,",
    "delicate as breath",
    "a season of waiting,",
    "a silence of patience.",
    "Months pass.",
    "Then comes the flush of red",
    "berries glowing like drops of fire,",
    "juicy, ripe,",
    "a reward carved from struggle,",
    "a love made visible.",
    ""
];
let poemLinesPhase3 = [
    "The harvest begins.",
    "Fingers choose carefully,",
    "one by one,",
    "each fruit carried like a gift.",
    "Livelihood in the palms,",
    "a family’s tomorrow gathered today.",
    ""
];
let poemLinesPhase4 = [
    "And when the branches grow bare,",
    "these hands still work",
    "drying, pruning, preparing,",
    "as the trees breathe their quiet rest.",
    ""
];
let poemLinesPhase5 = [
    "The cycle begins again.",
    "Through rain and sun,",
    "through silence and song,",
    "all is written",
    "in the hands of the farmer.",
    ""
];


let currentLineIndex = 0;
let lastChangeTime = 0;
let currentText = "";

let currentPhase = 0;
let phase1;
let phase2;
let phase2After;
let phase3;
let phase4;
let phase5;
let ambient;
let texture;

//PHASE 1
let flower;
let bee;
let flowers = [];
let lastFlowerX = -1000;
let lastFlowerY = -1000;
let minFlowerDist = 50; // minimum distance between flowers
let quarterSounds = [[], [], [], []];
let sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8;
let wadjust = 150;
let hadjust = 100;
let increase = 1.0;
let particles = [];



//PHASE 2
let raindrops = [];
let phase2StartTime = 0;
let showPhase2After = false;
let soundphase2;
let phase2Slider;
let rainActive = true;


//PHASE 3
let phase3After1, phase3After2, phase3After3, phase3After4, phase3After5;
let phase3Images = [];
let phase3AnimIndex = 0;
let phase3AnimLastSwitch = 0;
let rustling;
let beanPouring;
let voice;
let phase3In;

//PHASE 4
let rustlingStep;
let rectX, rectY;
let speed = 5; // movement speed
let rectAngle = 0;
let cuoc_2;
let w = 150;
let h = 250;
let bean;
let beans = [];       // array of bean objects
let beanCount = 60;   // how many beans scatter
let collected = 0;
let phase4In;


//PHASE 5
let family;
let revealH = 0;
let soundPhase5;



function preload() {
    // preload images 
    phase1 = loadImage("a/phase1.png");
    phase2 = loadImage("a/phase2.gif");
    phase3 = loadImage("a/phase3.png");
    phase4 = loadImage("a/phase4.png");
    phase5 = loadImage("a/phase5.png");
    flower = loadImage("a/flower.png");
    phase2After = loadImage("a/phase2-2.gif");
    phase3After1 = loadImage("a/phase3-1.png");
    phase3After2 = loadImage("a/phase3-2.png");
    phase3After3 = loadImage("a/phase3-3.png");
    phase3After4 = loadImage("a/phase3-4.png");
    phase3After5 = loadImage("a/phase3-5.png");
    texture = loadImage("a/texture.png");
    bee = loadImage("a/bee.png");
    cuoc_2 = loadImage("a/cuoc-2.png");
    family = loadImage("a/family.png");
    bean = loadImage("a/bean.png");

    // preload sounds 
    sound1 = loadSound('sound/sound1.mp3');
    sound2 = loadSound('sound/sound2.mp3');
    sound3 = loadSound('sound/sound3.mp3');
    sound4 = loadSound('sound/sound4.mp3');
    sound5 = loadSound('sound/sound5.mp3');
    sound6 = loadSound('sound/sound6.mp3');
    sound7 = loadSound('sound/sound7.mp3');
    sound8 = loadSound('sound/sound8.mp3');
    soundphase2 = loadSound('sound/rainy.wav');
    ambient = loadSound('sound/ambient.mp3');
    rustling = loadSound('sound/phase3.wav');
    beanPouring = loadSound('sound/phase3-2.wav');
    voice = loadSound('sound/voice.mp3');
    rustlingStep = loadSound('sound/phase4.wav');
    soundPhase5 = loadSound('sound/soundphase5.mp3');

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    switchPhase(0);

    for (let i = 0; i < 300; i++) {
        raindrops.push(new RainDrop());
    }
    phase3Images = [phase3After1, phase3After2, phase3After3, phase3After4, phase3After5];
    phase3AnimIndex = 0;
    phase3AnimLastSwitch = millis();

    let allSounds = [sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8];

    // shuffle them so they’re random
    shuffle(allSounds, true);

    // assign 2 sounds per quarter
    quarterSounds[0] = [allSounds[0], allSounds[1]]; // top-left
    quarterSounds[1] = [allSounds[2], allSounds[3]]; // top-right
    quarterSounds[2] = [allSounds[4], allSounds[5]]; // bottom-left
    quarterSounds[3] = [allSounds[6], allSounds[7]]; // bottom-right

    //Phase 2
    phase2Slider = createSlider(0, 1, 0, 0.01);
    phase2Slider.position(width / 2 + 600, height / 2);
    phase2Slider.style('width', '300px');
    phase2Slider.style('transform', 'rotate(-90deg)');
    phase2Slider.style('transform-origin', 'left center');
    phase2Slider.hide();

    phase2Slider.style('appearance', 'none');   // remove default browser style
    phase2Slider.style('height', '16px');        // bar thickness
    phase2Slider.style('background', '#ffcc66'); // bar color
    phase2Slider.style('border-radius', '0'); // rounded bar     // remove outline
    phase2Slider.style('opacity', '0.9');
    phase2Slider.addClass("phase2-slider");     // slight transparency

    //phase 3
    phase3In = select('#instructionphase3');
    phase3In.hide();

    //phase 4
    rectX = random(wadjust * increase, width - wadjust * increase);
    rectY = random(hadjust * increase, height - hadjust * increase);
    phase4In = select('#instructionphase4');
    phase4In.hide();


    //phase 5
    spawnBeans();



    // hide phase4 at the beginning



}

function draw() {

    if (currentPhase === 0) {
        phase1Effect();
        phase2Slider.hide();
        phase3In.show();
        phase4In.hide();
    } else if (currentPhase === 1) {
        phase2Effect();
        phase2Slider.show();   // show only in phase 2
        phase3In.hide();
        phase4In.hide();
    } else if (currentPhase === 2) {
        phase3Effect();
        phase2Slider.hide();
        phase3In.show();
        phase4In.hide();
    } else if (currentPhase === 3) {
        phase4Effect();
        phase2Slider.hide();
        phase4In.show();
        phase3In.hide();

    } else if (currentPhase === 4) {
        phase5Effect();
        phase2Slider.hide();
        phase3In.hide();
        phase4In.hide();

    }
}



// Phase 1: flowers follow the cursor
// === PARTICLE CLASS ===
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-0.5, 0.5); // horizontal speed
        this.vy = random(0, 0.2); // upward drift
        this.alpha = 255; // transparency
        this.size = random(1, 5);
        this.col = color(255, 251, 230, this.alpha); // yellowish
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 1; // fade out
        this.col.setAlpha(this.alpha);
    }

    show() {
        noStroke();
        fill(this.col);
        ellipse(this.x, this.y, this.size);
    }

    isDead() {
        return this.alpha <= 0;
    }
}
function phase1Effect() {
    imageMode(CENTER);
    image(phase1, width / 2, height / 2, width, height);


    
    text(currentText, width / 2, height - 50);

    for (let f of flowers) {
        push();
        translate(f.x, f.y);
        rotate(f.rot);
        imageMode(CENTER);
        image(flower, 0, 0, f.s, f.s);
        pop();
    }




    particles.push(new Particle(mouseX, mouseY)); // add new one every frame

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.show();
        if (p.isDead()) {
            particles.splice(i, 1);
        }
    }


    rectMode(CORNERS);
    image(bee, mouseX, mouseY, wadjust * increase, hadjust * increase);

    let delay;
    if (currentText === "") {
        delay = 1000;
    } else if (currentText.endsWith(".")) {
        delay = 2000;
    } else {
        delay = 1000 + (currentText.length * 50);
    }
    let poem = poemLinesPhase1;
    if (millis() - lastChangeTime > delay) {
        currentText = poem[currentLineIndex];
        currentLineIndex++;
        if (currentLineIndex >= poem.length) {
            // reset after full cycle
            currentLineIndex = 0;
        }
        lastChangeTime = millis();
    }

    // display the current text
    fill(255, 255, 85);          // text color
    textFont("amifer");
    textStyle(BOLD);
    stroke(28, 28, 28);
    strokeWeight(3);
    textAlign(CENTER);
    textSize(42);


}

function mouseMoved() {
    if (currentPhase === 0) {
        let d = dist(mouseX, mouseY, lastFlowerX, lastFlowerY);
        if (d > minFlowerDist) {
            flowers.push({
                x: mouseX,
                y: mouseY,
                s: random(20, 150),
                rot: random(TWO_PI)
            });
            lastFlowerX = mouseX;
            lastFlowerY = mouseY;
        }
    }
}

function mousePressed() {
    if (currentPhase === 0) {
        let chosenQuarter;

        if (mouseX < width / 2 && mouseY < height / 2) {
            chosenQuarter = 0; // top-left
        } else if (mouseX >= width / 2 && mouseY < height / 2) {
            chosenQuarter = 1; // top-right
        } else if (mouseX < width / 2 && mouseY >= height / 2) {
            chosenQuarter = 2; // bottom-left
        } else {
            chosenQuarter = 3; // bottom-right
        }

        // play a random sound from that quarter
        random(quarterSounds[chosenQuarter]).play();
    }
    if (currentPhase === 2) {
        if (
            mouseX > width / 2 - 200 &&
            mouseX < width / 2 + 200 &&
            mouseY > height / 2 - 200 &&
            mouseY < height / 2 + 200
        ) {
            if (beanPouring.isPlaying()) beanPouring.stop();
            beanPouring.play();
        }

        // zone 2
        if (
            mouseX > width / 2 - 400 - 200 &&
            mouseX < width / 2 - 400 + 200 &&
            mouseY > height / 2 - 400 &&
            mouseY < height / 2 + 400
        ) {
            if (voice.isPlaying()) voice.stop();
            voice.play();
        }

        // zone 3
        if (
            mouseX > width / 2 + 200 - 300 &&
            mouseX < width / 2 + 200 + 300 &&
            mouseY > height / 2 + 300 - 100 &&
            mouseY < height / 2 + 300 + 100
        ) {
            if (rustling.isPlaying()) rustling.stop();
            rustling.play();
        }
    }
}
// Phase 2: raining effect
function phase2Effect() {
    imageMode(CORNER);
    let t = phase2Slider.value(); // 0 → 1

    // Define two sets of gradient colors
    let startTop = color(255, 255, 85);
    let startMid = color(255, 224, 102);
    let startBottom = color(255, 251, 230);


    let endTop = color(255, 111, 0);
    let endMid = color(255, 111, 0);
    let endBottom = color(255, 255, 85);

    // Interpolate based on slider value
    let color1 = lerpColor(startTop, endTop, t);
    let color2 = lerpColor(startMid, endMid, t);
    let color3 = lerpColor(startBottom, endBottom, t);

    // Draw gradient
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c;
        if (inter < 0.5) {
            let amt = map(inter, 0, 0.5, 0, 1);
            c = lerpColor(color1, color2, amt);
        } else {
            let amt = map(inter, 0.5, 1, 0, 1);
            c = lerpColor(color2, color3, amt);
        }
        stroke(c);
        line(0, y, width, y);
    }
    //PHASE2 IMAGE



    let thumbColor;
    if (t < 0.5) {
        thumbColor = "#7BA66B"; // xanh
    } else {
        // scale t từ 0.5–1 → 0–1
        let p = map(t, 0.5, 1, 0, 1);

        // nội suy màu xanh → đỏ
        let r = lerp(123, 255, p);
        let g = lerp(166, 0, p);
        let b = lerp(107, 0, p);
        thumbColor = `rgb(${r},${g},${b})`;
    }

    // gán màu thumb qua CSS variable
    phase2Slider.elt.style.setProperty("--thumb-color", thumbColor);


    tint(255, 255 * (1 - t));
    image(phase2, 0, -50);

    tint(255, 255 * t);
    image(phase2After, 0, -50);

    noTint();

    //RAIN EFFECT

    if (rainActive) {
        for (let drop of raindrops) {
            drop.update();
            drop.show();
        }
    }
    let delay;
    if (currentText === "") {
        delay = 1000;
    } else if (currentText.endsWith(".")) {
        delay = 2000;
    } else {
        delay = 1000 + (currentText.length * 50);
    }
    if (t >= 1) {
        rainActive = false;
        if (soundphase2.isPlaying()) {
            soundphase2.stop();
        }
    } else {
        rainActive = true;
        if (!soundphase2.isPlaying()) {
            soundphase2.loop();
        }
    }



    //Poem
    let poem = poemLinesPhase2;

    if (millis() - lastChangeTime > delay) {
        currentText = poem[currentLineIndex];
        currentLineIndex++;
        if (currentLineIndex >= poem.length) {
            // reset after full cycle
            currentLineIndex = 0;
        }
        lastChangeTime = millis();
    }

    // display the current text
    fill(255, 255, 85);          // text color
    textFont("amifer");
    textStyle(BOLD);
    stroke(28, 28, 28);
    strokeWeight(3);
    textAlign(CENTER);
    textSize(42);
    text(currentText, width / 2, height - 50);

    image(texture, 0, 0, width, height);



}

// ---- RainDrop class ----
class RainDrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = random(-height, 0);
        this.z = random(0, 200); // depth effect
        this.len = map(this.z, 0, 20, 10, 40);
        this.yspeed = map(this.z, 0, 40, 8, 30);
    }

    update() {
        this.y += this.yspeed;
        if (this.y > height) {
            this.reset();
        }
    }

    show() {
        let thick = map(this.z, 0, 20, 2, 1);
        strokeWeight(thick);
        stroke(255, 251, 230, 200); // bluish rain
        line(this.x, this.y, this.x, this.y + this.len);
    }
}

// Phase 3: placeholder
function phase3Effect() {
    imageMode(CENTER);
    background(255, 251, 230);

    let color1 = color(46, 125, 255);   // 
    let color2 = color(98, 214, 255); // 
    let color3 = color(201, 250, 255);  //


    for (let y = 0; y < height; y++) {
        let inter;
        let c;

        if (y < height / 2) {
            // Top half: color1 → color2
            inter = map(y, 0, height / 2, 0, 1);
            c = lerpColor(color1, color2, inter);
        } else {
            // Bottom half: color2 → color3
            inter = map(y, height / 2, height, 0, 1);
            c = lerpColor(color2, color3, inter);
        }

        stroke(c);
        line(0, y, width, y);
    }

    image(phase3, width / 2, height / 2);
    let delay = 800;
    if (millis() - phase3AnimLastSwitch > delay) {
        phase3AnimIndex = (phase3AnimIndex + 1) % phase3Images.length;
        phase3AnimLastSwitch = millis();
    }

    // Draw outline
    stroke(28, 28, 28);
    strokeWeight(4);
    noFill();
    rectMode(CENTER);
    rect(width / 2 + 500, height / 2 - 150, 300, 300);

    // Draw current animated image
    image(phase3Images[phase3AnimIndex], width / 2 + 500, height / 2 - 150, 300, 300);


    //Poem
    let delaypoem;

    if (currentText === "") {
        delaypoem = 1000;
    } else if (currentText.endsWith(".")) {
        delaypoem = 2000;
    } else {
        delaypoem = 1000 + (currentText.length * 50);
    }

    let poem = poemLinesPhase3;

    if (millis() - lastChangeTime > delaypoem) {
        currentText = poem[currentLineIndex];
        currentLineIndex++;
        if (currentLineIndex >= poem.length) {
            // reset after full cycle
            currentLineIndex = 0;
        }
        lastChangeTime = millis();
    }

    // display the current text
    fill(255, 255, 85);          // text color
    textFont("amifer");
    textStyle(BOLD);
    stroke(28, 28, 28);
    strokeWeight(3);
    textAlign(CENTER);
    textSize(42);
    text(currentText, width / 2, height - 50);
}

// Phase 4: sunlight generate
function phase4Effect() {
    imageMode(CENTER);
    image(phase4, width / 2, height / 2);

    let cx = width / 2 - 600;   // sun center X
    let cy = height / 2 - 350;  // sun center Y
    let maxRadius = 80;  // how far the glow spreads

    // --- Glowing gradient circle (sun glow) ---
    for (let r = maxRadius; r > 0; r -= 5) {
        let alpha = map(r, 0, maxRadius, 150, 0); // softer glow
        fill(255, 255, 180, alpha);
        noStroke();
        ellipse(cx, cy, r * 2, r * 2);
    }


    for (let b of beans) {
        if (!b.collected) {
            image(bean, b.x, b.y, b.size, b.size);

            // check collision with cuoc_2 player
            let d = dist(rectX, rectY, b.x, b.y);
            if (d < (b.size / 2 + w * increase / 2)) {
                b.collected = true;
                collected++;  // add to score
                // resonate effect: e.g. sound or glow
                // play resonance sound here if you want
            }
        }
    }

    fill(255, 255, 85);       // yellow fill
    stroke(28, 28, 28);       // dark stroke
    strokeWeight(2);
    rectMode(CENTER);
    rect(width / 2 + 650, 95, 150, 50);

    // Draw text inside box
    fill(28, 28, 28);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    textFont('hagrid');
    text("Tons: " + collected, width / 2 + 650, 100);

    let moved = false;

    if (keyIsDown(87)) { // W - lên
        rectY -= speed;
        rectAngle = PI;
        moved = true;
    }
    if (keyIsDown(83)) { // S - xuống
        rectY += speed;
        rectAngle = 0;
        moved = true;
    }
    if (keyIsDown(65)) { // A - trái
        rectX -= speed;
        rectAngle = HALF_PI;
        moved = true;
    }
    if (keyIsDown(68)) { // D - phải
        rectX += speed;
        rectAngle = -HALF_PI;
        moved = true;
    }
    // --- Play sound if moved --- 
    if (moved) {
        if (!rustlingStep.isPlaying()) {
            rustlingStep.loop(); // loop while moving 
        }
    } else {
        if (rustlingStep.isPlaying()) {
            rustlingStep.stop(); // stop when no movement 
        }
    }

    // --- Sun rays ---
    push();
    translate(cx, cy);
    stroke(255, 255, 200, 40); // lower opacity (40 instead of 120)
    strokeWeight(100);         // thinner lines

    let rayCount = 40;         // fewer rays = cleaner look
    let t = millis() * 0.001;  // animate over time
    for (let i = 0; i < rayCount; i++) {
        let angle = TWO_PI * (i / rayCount) + t * 0.05;
        let baseLen = 1800;                          // minimum length
        let extraLen = random(100, 400);            // random extension
        let rayLen = baseLen + extraLen * sin(t * 2 + i);

        line(0, 0, cos(angle) * rayLen, sin(angle) * rayLen);
    }
    pop();


    // --- Draw the rectangle ---
    push();
    translate(rectX, rectY);
    rotate(rectAngle);

    // rectangle
    /*stroke(28, 28, 28);
    strokeWeight(2);
    fill(246, 241, 170);
    rectMode(CENTER);
    rect(0, 0, w * increase, h * increase);*/

    // image
    imageMode(CENTER);
    image(cuoc_2, 0, 0, w * increase, h * increase);

    pop();



    //poem
    let delaypoem;

    if (currentText === "") {
        delaypoem = 1000;
    } else if (currentText.endsWith(".")) {
        delaypoem = 2000;
    } else {
        delaypoem = 1000 + (currentText.length * 50);
    }

    let poem = poemLinesPhase4;

    if (millis() - lastChangeTime > delaypoem) {
        currentText = poem[currentLineIndex];
        currentLineIndex++;
        if (currentLineIndex >= poem.length) {
            // reset after full cycle
            currentLineIndex = 0;
        }
        lastChangeTime = millis();
    }
    fill(255, 255, 85);          // text color
    textFont("amifer");
    textStyle(BOLD);
    stroke(28, 28, 28);
    strokeWeight(3);
    textAlign(CENTER);
    textSize(42);
    text(currentText, width / 2, height - 50);
}
function resetPhase4() {
    rectX = random(wadjust * increase, width - wadjust * increase);
    rectY = random(hadjust * increase, height - hadjust * increase);


    if (rustlingStep && rustlingStep.isPlaying()) {
        rustlingStep.stop();
    }
}
function spawnBeans() {
    beans = [];
    for (let i = 0; i < beanCount; i++) {
        let b = {
            x: random(100, width - 100),
            y: random(100, height - 300) + 150,
            size: 30,
            collected: false
        };
        beans.push(b);
    }
}


// Phase 5: photo creation
function phase5Effect() {
    imageMode(CENTER);
    let color1 = color(255, 111, 0); // greenish
    let color2 = color(255, 255, 85);   // reddish

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color1, color2, inter);
        stroke(c);
        line(0, y, width, y);
    }
    image(phase5, width / 2, height / 2);
    //poem
    let delaypoem;
    if (currentText === "") {
        delaypoem = 1000;
    } else if (currentText.endsWith(".")) {
        delaypoem = 2000;
    } else {
        delaypoem = 1000 + (currentText.length * 50);
    }

    let poem = poemLinesPhase5;

    if (millis() - lastChangeTime > delaypoem) {
        currentText = poem[currentLineIndex];
        currentLineIndex++;
        if (currentLineIndex >= poem.length) {
            currentLineIndex = 0;
        }
        lastChangeTime = millis();
    }

    fill(255, 255, 85);
    textFont("amifer");
    textStyle(BOLD);
    stroke(28, 28, 28);
    strokeWeight(3);
    textAlign(CENTER);
    textSize(42);
    text(currentText, width / 2, height - 50);

    phase5Reset();

}
function phase5Reset() {
    // draw only the revealed slice, anchored at (0,0)
    revealH = min(revealH + 3, family.height);

    // Draw just the revealed part of the image, aligned at the bottom
    copy(
        family,                     // source image
        0, family.height - revealH, // source x, y (start from bottom)
        family.width, revealH,      // source width, height (slice)
        0, height - revealH + 27,        // destination x, y
        width, revealH              // destination width, height
    );
    image(texture, 0, 0, width, height);
}






function switchPhase(newPhase) {
    ambient.play();
    if (ambient.isPlaying()) {
        ambient.loop();
    }
    ambient.setVolume(0.5);
    if (currentPhase === 1 && soundphase2 && soundphase2.isPlaying()) {
        soundphase2.stop();
    }

    currentPhase = newPhase;
    document.getElementById('flowering').style.color = '';
    document.getElementById('berry-growth').style.color = '';
    document.getElementById('harvest').style.color = '';
    document.getElementById('drying').style.color = '';
    document.getElementById('renewal').style.color = '';

    // Highlight the current phase
    if (currentPhase === 0) {
        document.getElementById('flowering').style.color = '#E53935';
        currentLineIndex = 0;
        lastChangeTime = millis();
        currentText = poemLinesPhase1[0];
    } else if (currentPhase === 1) {
        document.getElementById('berry-growth').style.color = '#E53935';
        currentLineIndex = 0;
        lastChangeTime = millis();
        currentText = poemLinesPhase2[0];
        phase2StartTime = millis();
        if (soundphase2 && !soundphase2.isPlaying()) {
            soundphase2.loop(); // loop so rain continues
        }
    } else if (currentPhase === 2) {
        document.getElementById('harvest').style.color = '#E53935';
        currentLineIndex = 0;
        lastChangeTime = millis();
        currentText = poemLinesPhase3[0];
    } else if (currentPhase === 3) {
        document.getElementById('drying').style.color = '#E53935';
        currentLineIndex = 0;
        lastChangeTime = millis();
        currentText = poemLinesPhase4[0];
    } else if (currentPhase === 4) {
        document.getElementById('renewal').style.color = '#E53935';
        currentLineIndex = 0;
        lastChangeTime = millis();
        currentText = poemLinesPhase5[0];
        phase5Reset();
    }
    if (currentPhase === 1) {
        phase2StartTime = millis();
        showPhase2After = false;

    }
    if (currentPhase === 4) {
        if (!soundPhase5.isPlaying()) {
            soundPhase5.loop();
        }
    } else {
        if (soundPhase5.isPlaying()) {
            soundPhase5.stop();
        }
    }
    


}
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        let nextPhase = (currentPhase + 1) % 5; // wrap around 0–4
        switchPhase(nextPhase);
    } else if (keyCode === LEFT_ARROW) {
        let prevPhase = (currentPhase - 1 + 5) % 5; // wrap around backwards
        switchPhase(prevPhase);
    } else if (key === 'r' || key === 'R') {
        // Reset to phase 1 and clear flowers

        flowers = [];
        lastFlowerX = -1000;
        lastFlowerY = -1000;

        if (currentPhase === 1) {
            // Reset Phase 2
            phase2StartTime = millis();    // reset timer
            showPhase2After = false;       // về lại phase2 gốc
            phase2Slider.value(0);         // slider reset về 0
            currentLineIndex = 0;          // reset poem
            lastChangeTime = millis();
            currentText = poemLinesPhase2[0];

            // reset mưa
            for (let drop of raindrops) {
                drop.reset();
            }

            // reset âm thanh
            if (soundphase2.isPlaying()) {
                soundphase2.stop();
            }
            soundphase2.loop();
        }
        resetPhase4();
        if (currentPhase === 4) {
            revealH = 0;
        }
        spawnBeans();
        collected = 0;


    }


    if (keyCode === UP_ARROW) {
        increase *= 1.2;
    }
    if (keyCode === DOWN_ARROW) {
        increase *= 0.8;
    }

}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
