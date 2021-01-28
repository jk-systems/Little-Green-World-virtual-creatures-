let agent, food, enemy;
let baby, shot, eat, end; // for sounds
let population = [];
let foods = [];
let preditor = [];

//system initial controllers
let alignSlider, cohesionSlider, separationSlider;
let intpopu = 10;
let intfood = 5;
let initenemy = 2;
/////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\
function preload() {
  soundFormats('mp3', 'ogg');
  baby = loadSound('data/doorbell');
  //eat = loadSound('data/beat');
  shot = loadSound('data/crash');
  end = loadSound('data/end');
  eat = loadSound('data/bby');
}
/////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\
function setup() {
  //minimum size 300, 200
  createCanvas(400, 300, P2D);
  textSize(12);
  noStroke();
  push();

  pop();
  alignSlider = createSlider(0, 2, 1, 0.1);
  alignSlider.position(20, 20);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(20, 50);
  separationSlider = createSlider(0, 2, 1, 0.1);
  separationSlider.position(20, 80);
  
  for (let i = 0; i < intpopu; i++) {
    population.push(new Agent(random(width), random(height)));
  }
  for (let i = 0; i < intfood; i++) {
    foods.push(new Food(random(width), random(height)));
  }
  for (let i = 0; i < initenemy; i++) {
    preditor.push(new Enemy(random(width), random(height)));
  }
}
/////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\

function draw() {
  background(0);
  //agents
  for (agent of population) {
    //agent.move();
    agent.flock(population);
    agent.edges();
    agent.update();
    agent.show();
    agent.feed(foods);
  }
  //food/s
  for (food of foods) {
    food.display();
  }
  //enemy/s
  for (enemy of preditor) {
    enemy.render();
    enemy.feed(population);
  }
  //title
  push();
  fill(255);
  noStroke();
  textSize(20);
  text('the little green world', width/3, 20);
  pop();

  // tracking number(agents, food)
  push();
  //fill(0, 0, 255);
  noStroke();
  text('Agents Popu: ', 20, height - 20);
  text(population.length, 90, height - 20);
  text('Enemy Popu: ', width/2 -80, height - 20);
  text(preditor.length, width/2, height - 20);
  text('Food remaining: ', width -150, height - 20);
  text(foods.length, width -50, height - 20);
  pop();
  //sliders text
  text('alignment', alignSlider.x * 2 + alignSlider.width, 35);
  text('cohesion', cohesionSlider.x * 2 + cohesionSlider.width, 65);
  text('separation', separationSlider.x * 2 + separationSlider.width, 95);

  //end soundtrack
  if (population.length === 0) {
    console.log(end);
    end.play();
    noLoop();
  }
}
/////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\
function mousePressed() {
  baby.play();
}
/////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\
