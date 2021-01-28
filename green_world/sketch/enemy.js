class Enemy {
  constructor(x, y) {
    this.loc = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.speed = 7.9;
    this.force = 0.2;
  }
  render() {
    this.edges();
    this.move();
    this.update();
    this.show();
  }
  show() {
    push();
    fill(255, 0, 0);
    noStroke();
    rect(this.loc.x, this.loc.y, 20, 20);
    pop();
  }
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.speed);
    this.loc.add(this.vel);

    this.acc.mult(0);
  }
  move() {
    let f = p5.Vector.random2D();
    this.acc.add(f);
  }
  edges() {
    //bouncing walls
    if (this.loc.x <0) {
      this.loc.x = width;
    }
    if (this.loc.x > width) {
      this.loc.x = 0;
    }
    if (this.loc.y <0) {
      this.loc.y = height;
    }
    if (this.loc.y > height) {
      this.loc.y = 0;
    }
  }
  feed(agents) {
    //cheek food/agent distance
    for (let food of agents) {
      let dx = this.loc.x - food.pos.x;
      let dy = this.loc.y - food.pos.y;
      let dis_sq = dx*dx + dy*dy;
      if (Math.floor(dis_sq)<50) {
        //call agent/food dying function
        food.die();
      }
    }
  }
}
