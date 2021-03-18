# Fluid Particles

Easy to use flow particles, using only canvas and tween.js.  
See `src/index.js` for examples.

![The flow!](./flow.gif)

## Example
```javascript
// Create Flow Canvas
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
    {x: 250, y: 350}, //Stopover
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

// Lets run!
fc.start()
```