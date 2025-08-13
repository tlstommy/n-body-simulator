import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';
import { SimulationSettings } from '../SimulationSettings';

export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyText, setBodyText] = useState(); 

    const TRAILS = SimulationSettings.enableTrails;
    const PHYSICS_MARKERS = SimulationSettings.enablePhysicsMarkers;
    const SIM_SPEED = SimulationSettings.simSpeed
    const EPSILON = SimulationSettings.epsilon; //softening param to prevent singularities or physics errors on collisions
    const G = SimulationSettings.G; //newtons universal Grav constant
    const enableCollisions = SimulationSettings.enableCollision;
    const collisionType = SimulationSettings.collisionType;

    function calculateTotalEnergy(bodies) {
        let totalKE = 0;
        let totalPE = 0;
        
        // Calculate kinetic energy
        bodies.forEach(body => {
            let speedSquared = body.vX ** 2 + body.vY ** 2;
            //KE = 0.5 * m * v^2
            totalKE += 0.5 * body.mass * speedSquared; 
        });
        
        //Calculate potential energy
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const body1 = bodies[i];
                const body2 = bodies[j];
                
                const deltaX = body2.x - body1.x;
                const deltaY = body2.y - body1.y;
                const r = Math.sqrt(deltaX ** 2 + deltaY ** 2 + EPSILON ** 2);
                
                // PE = -G * m1 * m2 / r (negative because gravitational PE is negative)
                totalPE += -G * body1.mass * body2.mass / r;
            }
        }
        
        const totalEnergy = totalKE + totalPE;
        //console.log(`KE: ${totalKE.toExponential(3)}, PE: ${totalPE.toExponential(3)}, Total: ${totalEnergy.toExponential(3)}`);
        return { kinetic: totalKE, potential: totalPE, total: totalEnergy };
    }
    
    
    
    function handleCollision(body, otherBody) {
        
        //var setup
        const dx = otherBody.x - body.x;
        const dy = otherBody.y - body.y;
        const distanceSquared = dx**2 + dy**2;
        const distance = Math.sqrt(distanceSquared);
        
        const overlap = body.radius + otherBody.radius - distance;
        
        if (overlap > 0) {
            const combMass = body.mass + otherBody.mass;
            const normalX = dx / distance;
            const normalY = dy / distance;

            if (collisionType === "bounce") {
                [body.vX, otherBody.vX] = [otherBody.vX, body.vX];
                [body.vY, otherBody.vY] = [otherBody.vY, body.vY];
            } else if (collisionType === "elastic") {
                //relative velocities
                const dvX = body.vX - otherBody.vX;
                const dvY = body.vY - otherBody.vY;
                
                //dot product of relative velocity and collision normal
                const dp = dvX * normalX + dvY * normalY;    
                
                //if not collided move on
                if (dp >= 0) return;
                
                //conservation of momentum for elastic collision
                const impulse1 = (2.0 * otherBody.mass / combMass) * dp;
                const impulse2 = (2.0 * body.mass / combMass) * dp;
                
                body.vX -= impulse1 * normalX;
                body.vY -= impulse1 * normalY;
                otherBody.vX += impulse2 * normalX;
                otherBody.vY += impulse2 * normalY;

                // Separate overlapping objects
                const correction = overlap / 2.0;
                if (!body.staticBody) {
                    body.x -= normalX * correction;
                    body.y -= normalY * correction;
                }
                if (!otherBody.staticBody) {
                    otherBody.x += normalX * correction;
                    otherBody.y += normalY * correction;
                }
            }
        }
    }
    




    
    

    //calculate the Gravitational acceleration for a body based off the other bodies  https://en.wikipedia.org/wiki/Gravitational_acceleration
    function calculateGravAccelelration(body, bodies){
        //x and y accel init
        let aX = 0;
        let aY = 0;
        for (const otherBody of bodies) {
            if (body !== otherBody) {
    

                //pos diffs for each body to calculate r 
                const deltaX = otherBody.x - body.x;
                const deltaY = otherBody.y - body.y;

                //r = distance between the two bodies (with softening to prevent singularities)
                let r2 = deltaX ** 2 + deltaY ** 2 + EPSILON ** 2;
                let r = Math.sqrt(r2);
                
                const combRadius = body.radius + otherBody.radius;

                //coll handling here
                if (r - EPSILON < combRadius) {
                    if(enableCollisions){
                        handleCollision(body, otherBody);
                    }
                    // Use minimum separation to prevent unrealistic forces during collision
                    r = Math.max(r, combRadius);
                    r2 = r * r;
                }

                //Newton's law of universal gravitation: F = G * m1 * m2 / r^2
                //Acceleration = F / m1 = G * m2 / r^2
                const acceleration = G * otherBody.mass / r2;
                
                //Direction unit vector: deltaX/r, deltaY/r
                //Add acceleration components
                aX += acceleration * (deltaX / r);
                aY += acceleration * (deltaY / r);
            }
        }
    
        return { aX, aY };
    }

    //based on newtons grav law - proper leapfrog (Verlet) integration
    function updateBody(body, bodies) {
        
        //no need to check static bodies
        if (body.staticBody) return; 

        // Store current acceleration if not already stored (for first timestep)
        if (body.aX === undefined || body.aY === undefined) {
            const { aX, aY } = calculateGravAccelelration(body, bodies);
            body.aX = aX;
            body.aY = aY;
        }

        // Leapfrog integration - kick-drift-kick method
        // First half-step velocity update (kick)
        body.vX += 0.5 * body.aX * SIM_SPEED;
        body.vY += 0.5 * body.aY * SIM_SPEED;

        // Full position update (drift)
        body.x += body.vX * SIM_SPEED;
        body.y += body.vY * SIM_SPEED;
        
        // Calculate new acceleration at the new position
        const { aX: newAX, aY: newAY } = calculateGravAccelelration(body, bodies);
        
        // Second half-step velocity update (kick)
        body.vX += 0.5 * newAX * SIM_SPEED;
        body.vY += 0.5 * newAY * SIM_SPEED;
        
        // Store acceleration for next timestep
        body.aX = newAX;
        body.aY = newAY;

        if(TRAILS){
            //trail stuff
            //add cur pos to trail list
            body.trail.push({ x: body.x, y: body.y });

            //trail lims
            if (body.trail.length > SimulationSettings.trailLength) {
                body.trail.shift();
            }
        }
                     
        
        //setBodyText("G: " + G + ", Sim Speed: " + SIM_SPEED + " " + Math.sqrt((aX * aX) + (aY * aY)));
    }

    const animationRef = useRef();

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        //fix anim loop bug with multiple bodies
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        let frameCount = 0;
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let bodiesToDelete = [];
        
            //run through each body and update its position and velocity
            bodies.forEach(body => {
                const collsionData = updateBody(body, bodies);
                const { aX, aY } = calculateGravAccelelration(body, bodies);
                GravBody({ ...body, ctx, aX, aY, showPhysicsMarkers: PHYSICS_MARKERS  });
                
                if(collsionData){
                    if (collsionData.type === "fragment") {
                        bodiesToDelete = bodiesToDelete.concat(collsionData.collidors);
                    
                    //normal removal
                    }else if(collsionData.type === ""){
                        bodiesToDelete = bodiesToDelete.concat(collsionData.collidors);
                    }
                }
            });

            bodiesToDelete.forEach(bodyToDelete => {
                const index = bodies.indexOf(bodyToDelete);
                if (index !== -1) {
                    bodies.splice(index, 1);
                }
            });
            

            //const energyData = calculateTotalEnergy(bodies);
            //only get it every 60 frames
            if (frameCount % 60 === 0) {
                //console.log(`Frame ${frameCount}: Total Energy = ${energyData.total.toExponential(3)}`);
            }
            frameCount++;
            
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            
        };
    }, [bodies]);
    
    
    return( <div>
        <canvas id="canvas" ref={canvasRef} width={1800} height={1000} className="sim-canvas" />
        <p style={{ whiteSpace: "nowrap", width: "100px"}}>{bodyText}</p>
    </div>
    );
}