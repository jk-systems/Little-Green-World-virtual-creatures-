class Food {
  constructor(x, y) {
    this.loc = createVector(x, y);
    this.microlife = 3600;
    this.col = fill(0, 255, 0);
  }
  display() {
    push();
    noStroke();
    this.col;
    ellipse(this.loc.x, this.loc.y, 10, 10);
    pop();
  }
}
