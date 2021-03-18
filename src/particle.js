var TWEEN = require('@tweenjs/tween.js');

export class FlowCanvas {
  constructor(options)
  {
    this.options = options;
    this.context = this.options.canvas.getContext('2d');
    this.run = true;
    this.options.pipes = this.options.pipes ? this.options.pipes : [];
  }

  addPipes(pipes, start)
  {
    this.options.pipes = this.options.pipes.concat(pipes);

    if(start)
      pipes.forEach(p => p.start())
  }

  start()
  {
    this.options.pipes.forEach(p => p.start())
    this.update();

    return this;
  }

  stop()
  {
    this.options.pipes.forEach(p => p.stop())
    return this;
  }

  clear(color)
  {
    this.context.fillStyle = color ? color : '#ffffff';
    this.context.fillRect(0, 0, this.options.canvas.width, this.options.canvas.height);
  }

  /*
   * Function to clear layer canvas
   */
  overlay()
  {
    // let grd = this.canvas.createRadialGradient(winWidth, winHeight/2, 0, winWidth/2, winHeight/2, winWidth);
    //     grd.addColorStop(0,"rgba(25,25,54,0.22)");
    //     grd.addColorStop(1,"rgba(0,0,20,0.01)");
    // this.canvas.fillStyle=grd;

    this.context.fillStyle='rgba(255,255,255,0.1)';//grd;
    this.context.fillRect(0, 0, this.options.canvas.width, this.options.canvas.height);
  }
  
  /*
   * Function to update particles in canvas
   */
  update()
  {
    this.overlay();
    TWEEN.update();
    this.options.pipes.forEach(p => p.move())
    if(this.run)
      requestAnimationFrame(this.update.bind(this))
  }   
}

export class Pipe {
  constructor(options)
  {
    this.path = options.path;
    if(typeof options.shift != 'object')
    {
      this.shift = {x: options.shift, y: options.shift}
    }
    else
    {
      this.shift = options.shift ? options.shift : {x: 50, y: 50};
    }
    this.numParticles = options.numParticles ? options.numParticles : 5;
    this.canvas = options.canvas;
    this.canvasContext = options.canvas.getContext('2d');
    this.speed = options.speed;
    this.color = options.color ? options.color : '#2E4765';

    this.winWidth = options.canvas.width;
    this.winHeight = options.canvas.height;

    this.particles = [];
    
    // Popolate particles
    this.popolate(this.numParticles);

    // Update canvas
    // this.update()        
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  distance(p1, p2)
  {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    
    return Math.sqrt( a*a + b*b );
  }

  stop()
  {
    this.particles.forEach(p => p.stop())
  }
  
  /*
   * Function to clear layer canvas
   * @num:number number of particles
   */
  popolate(num){

    // Create Particles
    for (var i = 0; i < num; i++)
    {

      // Randomize Position
      let shiftX = this.getRandomInt(this.shift.x * -1, this.shift.x);
      let shiftY = this.getRandomInt(this.shift.y * -1, this.shift.y);

      let path = [];
      for(var j = 0; j < this.path.length; j++)
      {
        path.push({x: this.path[j].x + shiftX, y: this.path[j].y + shiftY})
      }

      // Calculate Speed of each
      for(var j = 0; j < path.length; j++)
      {
        if(j + 1 < path.length)
        {
          let p0 = path[j];
          let p1 = path[j + 1];
  
          // Calculate Distance
          let c = this.distance(p0, p1);

          // // Calculate Speed. Randomize +- 10%
          let speed = c / this.speed * 1000;
          p0.speed = this.getRandomInt(speed * 0.9, speed * 1.1);
  
        }
      }

      // Create Particle
      var particle = new Particle(this.canvas, {
        path: path,
        color: this.color
      })
      this.particles.push(particle)

    }

  }

  start()
  {
    // Calculate all over Distance for timing. Timing the particles so, that there are always particles on the run
    var maxDistance = 0;
    for(var i = 0; i < this.path.length - 1; i++)
    {
      maxDistance += this.distance(this.path[i], this.path[i + 1]);
    }

    let maxSpeed = maxDistance / this.speed * 1000;
    // Let them lose!
    this.particles.forEach((p, i) => setTimeout(() => p.start(), maxSpeed / this.numParticles * i))
  }

  move()
  {
    this.particles.forEach(p => p.move())
  }

}

export class Particle{
  constructor(canvas, options){
    const random = Math.random()
    this.progress = 5000;
    this.canvas = canvas;
    this.canvasContext = canvas.getContext('2d')
    this.winWidth = canvas.width;
    this.winHeight = canvas.height;

    this.run = true;

    this.options = options;


    this.radius = random*1.3
    this.color  = options.color;

    this.createTween();
  }

  stop()
  {
    this.run = false;
  }

  createTween()
  {    
    this.tweens = [];
    var pos = {x: this.options.path[0].x, y: this.options.path[0].y};
    for(var i = 0; i < this.options.path.length; i++)
    {
      if(i + 1 < this.options.path.length)
      {
        let p0 = this.options.path[i];
        let p1 = this.options.path[i + 1];

        let tween = new TWEEN.Tween(pos)
          .to({x: p1.x, y: p1.y}, p0.speed)
          .onUpdate(() => {
            this.x = pos.x;
            this.y = pos.y;
        })
        if(this.tweens.length > 0)
        {
          this.tweens[this.tweens.length - 1].chain(tween);
        }
        this.tweens.push(tween)
      }
    }

    // Repeat if still running

    this.tweens[this.tweens.length - 1].onComplete(() => {
      if(this.run)
      {
        this.createTween();
        this.start()
      }
    })

  }

  start()
  {
    // Start Tweening
    this.run = true;
    this.tweens[0].start();  
  }

  render()
  {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvasContext.lineWidth = 2;
    this.canvasContext.fillStyle = this.color;
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  move()
  {
    this.render();
    return true;
  }
}