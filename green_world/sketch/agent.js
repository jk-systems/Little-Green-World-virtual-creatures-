class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = 8;
    this.r = 3.0;
    this.maxspeed = 10.0;
    this.maxforce = 0.8;
    this.perception = 50;
  }
  show() {
    //stroke(255);
    //strokeWeight(this.size);
    //point(this.pos.x, this.pos.y);

    // Draw a triangle rotated in the direction of velocity
    let theta = this.vel.heading() + radians(90);
    fill(0, 255, 0);
    stroke(200);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
  update() {
    //accumulation of force using vectors
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);

    //reset acc vector
    this.acc.mult(0);
  }
  move() {
    let randomF = p5.Vector.random2D();
    this.acc.add(randomF);
    this.vel.setMag(this.maxspeed);
  }
  edges() {
    //bouncing walls
    if (this.pos.x <0) {
      this.pos.x = width;
    }
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y <0) {
      this.pos.y = height;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  seek() {
    //comments
   let target = p5.Vector(mouseX, mouseY);
   let desired = target.sub(this.pos);
   console.log(desired);
   let d = desired.mag();
   let speed = this.maxspeed;
   if (d < 100) {
     speed = map(d, 0, 100, 0, this.maxspeed);
   }
   desired.setMag(speed);
   let steer = p5.Vector.sub(desired, this.vel);
   steer.limit(this.maxforce);
   this.acc.add(steer);
  }
  feed(foods) {
    //cheek collision
    for (let food of foods) {
      let dx = this.pos.x - food.loc.x;
      let dy = this.pos.y - food.loc.y;
      let dis_sq = dx*dx + dy*dy;
      if (Math.floor(dis_sq)<50) {
        console.log('agent feeding');
        foods.pop(food);
        this.clone();
        eat.play();
      }
    }
  }
  clone() {
    //reproduce in a random chance
    let chance = random(0, 1);
    console.log(chance);
    if (chance >= 0.6) {
      console.log('Yay got dem babies!');
      console.log(baby);
      population.push(new Agent(random(width), random(height)));
      population.push(new Agent(random(width), random(height)));
      baby.play();
    }
  }
  die() {
    console.log('Agent About to die!!');
    //agent leaves food when it dies
    foods.push(new Food(random(width), random(height)));
    population.pop(this);
    shot.play();
  }

  ////////////////////////////////////////////////////////////////////////////
  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.pos.x, 
        this.pos.y, 
        other.pos.x, 
        other.pos.y
        );
      if (other != this && d < this.perception) {
        steering.add(other.vel);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxspeed);
      steering.sub(this.vel);
      steering.limit(this.maxforce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.pos.x, 
        this.pos.y, 
        other.pos.x, 
        other.pos.y
        );
      if (other != this && d < this.perception) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxspeed);
      steering.sub(this.vel);
      steering.limit(this.maxforce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.pos.x, 
        this.pos.y, 
        other.pos.x, 
        other.pos.y
        );
      if (other != this && d < this.perception) {
        steering.add(other.pos);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxspeed);
      steering.sub(this.vel);
      steering.limit(this.maxforce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
  }
}
