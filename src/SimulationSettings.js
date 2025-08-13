
export const SimulationSettings = {
  G: 100, // normalized gravitational constant for simulation
  simSpeed: 0.5, // visual speed multiplier (0.0 = paused, 1.0 = full speed)
  physicsTimeStep: 0.05, // smaller timestep for stability at high speeds
  physicsStepsPerFrame: 60, // many steps per frame for fast motion
  softening: 1e-9, // softening factor for collisions
  epsilon: 1e-2, // small value to prevent division by zero
  enableCollision: false,
  collisionType: 'elastic', // type of collision ('elastic' or 'inelastic')
  enablePhysicsMarkers: false,
  enableTrails: true,
  trailLength: 500, // shorter trails for cleaner view at high speeds
  launchVelocityFactor: 1e-2,
};



