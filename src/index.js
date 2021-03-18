import {FlowCanvas, Pipe} from './particle.js'

let canvas = document.getElementById('canvas');

// Create the FlowCanvas
let fc = new FlowCanvas({
  canvas: canvas,
})

// Add Pipes
fc.addPipes(new Pipe({
  // Canvas
  canvas: canvas,

  // Where the it should flow
  path: [
    {x: 0, y: 0}, // Start
    {x: 250, y: 350},
    {x: 250, y: 500} // End
  ],

  // How wide is the pipe? 15px shift from original route
  shift: 15,

  // number of particles
  numParticles: 400,

  // Speed of particles
  speed: 200,

  // Color
  color: '#0f82c8'
}))

// Add some more
fc.addPipes(new Pipe({
  canvas: canvas,
  path: [
    {x: 500, y: 0},
    {x: 272, y: 350},
    {x: 272, y: 500}
  ],
  shift: 10,
  numParticles: 300,
  speed: 200,
  color: '#0f3ac8'
}))

fc.addPipes(new Pipe({
  canvas: canvas,
  path: [
    {x: 500, y: 250},
    {x: 290, y: 350},
    {x: 290, y: 500}
  ],
  shift: 6,
  numParticles: 100,
  speed: 300,
  color: '#6a0fc8'
}))

// Let's start!
fc.start();

// Register buttons
document.getElementById('start').addEventListener("click", () => fc.start())
document.getElementById('stop').addEventListener("click", () => fc.stop())
