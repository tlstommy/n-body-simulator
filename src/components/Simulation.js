import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyText, setBodyText] = useState(); 

    const TRAILS = false;
    const PHYSICS_MARKERS = false;
    const SIM_SPEED = 1e-6;
    const EPSILON = 1e-2; //softening param to prevent singularities or physics errors on collisions
    const G = 6.6743e-11; //newtons universal Grav constant

    const enableCollisions = true;
    const collisionType = "elastic";
    
    
    function handleCollision(body, otherBody) {
        
        //var setup
        const x1 = { x: body.x, y: body.y };
        const x2 = { x: otherBody.x, y: otherBody.y };

        const m1v1 = { x: body.vX, y: body.vY };
        const m2v2 = { x: otherBody.vX, y: otherBody.vY };


        const dx = otherBody.x - body.x;
        //console.log(dx);
        const dy = otherBody.y - body.y;
        //console.log(dy);
        const distanceSquared =  dx**2 + dy**2;
        const distance = (Math.sqrt(distanceSquared));
        console.log(dx**2 + dy**2)
        console.log(dx*dx + dy*dy);
        //console.log(Math.abs(body.vX - otherBody.vX));
        const overlap = body.radius + otherBody.radius - distance;
        //console.log(body)

        
        if (overlap > 0) {
            const combMass = body.mass + otherBody.mass;
            
            
            const correction = overlap / 2;



            const normalX = dx / distance;
            const normalY = dy / distance;

            


            //move objects
            

            

            //console.log(body);
            

            if (collisionType === "bounce") {
                [body.vX, otherBody.vX] = [otherBody.vX, body.vX];
                [body.vY, otherBody.vY] = [otherBody.vY, body.vY];
            } else if (collisionType === "elastic") {
                //rel velocitys
                const dvX = body.vX - otherBody.vX;
                const dvY = body.vY - otherBody.vY;
                //https://en.wikipedia.org/wiki/Elastic_collision
                //dot product of rel velocity and the normal coll vectors
                const dp = (dvX * normalX + dvY * normalY);    
                //console.log(dp)
                if (dp > 0 && overlap <= 0) return;
                //
                const v1 = ((2.0 * otherBody.mass) / combMass) * (dp / distance);
                const v2 = ((2.0 * body.mass) / combMass) * (dp / distance);

                //from wiki
                //v`1 = v1 - (2m_2/(m1+m2) * (DP/ |x_1 - x_2|^2) * (x_1 - x_2)
                body.vX -= v1 * dx;
                body.vY -= v1 * dy;

                otherBody.vX += v2 * dx;
                otherBody.vY += v2 * dy;


                //now update incase of overlaps
                const correction = overlap / 2.0;
                //console.log(distance)
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

                //r = distance between the two bodies
                //const r = Math.sqrt(deltaX**2 + deltaY**2);
                let r2 = deltaX ** 2 + deltaY ** 2;
                //r2 = Math.max(r2, EPSILON ** 2); // Prevents explosion in force at small r

                let r = Math.sqrt(r2 + EPSILON);
                //console.log(r);
                //console.log(EPSILON);
                //console.log("")
                
                const combRadius = body.radius + otherBody.radius;

                //coll handling here
                
                if (Math.ceil(r) < combRadius) {
                    if(enableCollisions){
                        handleCollision(body, otherBody);
                    }
                    //console.log("hit")
                    //continue;
                    
                    
                    
                }


                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                
                
                //const force = G * ((body.mass * otherBody.mass) / (r**2  + EPSILON**2));

                var denom = r2

                const force = G * (body.mass * otherBody.mass) / (denom);
                //console.log(`${force.toFixed(4).padEnd(10)} = ${G} * (${(body.mass * otherBody.mass).toExponential(4).padEnd(10)}) / (${denom.toExponential(4).padEnd(10)})`);

                //console.log(`Force between ${body.id} and ${otherBody.id}:, ${force}`);
                //console.log(Mass of ${body.id}: ${body.mass}, Mass of ${otherBody.id}: ${otherBody.mass});
                
                //get the accel from force
                const acceleration = force / body.mass;
                //multiply acell force by direction and add to dir
                aX += acceleration * (deltaX / r);
                aY += acceleration * (deltaY / r);
                
                
                //console.log(dX: ${deltaX}, dY: ${deltaY}, r: ${r});
                //console.log(aX: ${aX}, aY: ${aY});

            }
        }
    
        return { aX, aY };


    }

    //https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
    //function RK4


    //based on newtons grav law
    function updateBody(body, bodies) {
        
        //no need to check static bodies
        if (body.staticBody) return; 

        //gett accel vals 
        const { aX, aY } = calculateGravAccelelration(body, bodies);
        //console.log(Math.sqrt(body.vX))
       
            
        //caclulate velocity using leapfrog integration
        body.vX += 0.5 * aX * SIM_SPEED;
        body.vY += 0.5 * aY * SIM_SPEED;

        body.x += body.vX * SIM_SPEED;
        body.y += body.vY * SIM_SPEED;
        ///second half of lf 
        const { aX: newAX, aY: newAY } = calculateGravAccelelration(body, bodies);
    

        // Final velocity update
        body.vX += 0.5 * newAX * SIM_SPEED;
        body.vY += 0.5 * newAY * SIM_SPEED;

        if(TRAILS){
            //trail stuff
            //add cur pos to trail list
            body.trail.push({ x: body.x, y: body.y });

            //trail lims
            if (body.trail.length > 5000) {
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
        
            // Now draw the updated bodies
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