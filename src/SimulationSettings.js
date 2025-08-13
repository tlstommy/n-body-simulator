
export const SimulationSettings = {
  G: 6.674e-11, // gravitational constant
  simSpeed: 1e-6, // time step for simulation
  softening: 1e-9, // softening factor for collisions
  epsilon: 1e-2, // small value to prevent division by zero
  enableCollision: false,
  collisionType: 'elastic', // type of collision ('elastic' or 'inelastic')
  enablePhysicsMarkers: false,
  enableTrails: true,
  trailLength: 100, // length of the trail for each body
};



