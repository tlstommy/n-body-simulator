import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyText, setBodyText] = useState(); 

    const SIM_SPEED = 0.0001;
    const EPSILON = 1e6; //softening param
    const G = 6.6743e-11; //newtons universal Grav constant

    const enableCollisions = false;
    const collisionType = "bounce"
    
    
    function handleCollision(body, otherBody) {
        const dx = otherBody.x - body.x;
        const dy = otherBody.y - body.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const overlap = body.radius + otherBody.radius - distance;

        if (overlap > 0) {
            const correction = overlap / 2;
            const normalX = dx / distance;
            const normalY = dy / distance;
            body.x -= normalX * correction;
            body.y -= normalY * correction;
            otherBody.x += normalX * correction;
            otherBody.y += normalY * correction;

            if (collisionType === "bounce") {
                [body.vX, otherBody.vX] = [otherBody.vX, body.vX];
                [body.vY, otherBody.vY] = [otherBody.vY, body.vY];
            } else if (collisionType === "elastic") {
                const totalMass = body.mass + otherBody.mass;

                const newVX1 = (body.vX * (body.mass - otherBody.mass) + 2 * otherBody.mass * otherBody.vX) / totalMass;
                const newVY1 = (body.vY * (body.mass - otherBody.mass) + 2 * otherBody.mass * otherBody.vY) / totalMass;
                const newVX2 = (otherBody.vX * (otherBody.mass - body.mass) + 2 * body.mass * body.vX) / totalMass;
                const newVY2 = (otherBody.vY * (otherBody.mass - body.mass) + 2 * body.mass * body.vY) / totalMass;

                body.vX = newVX1;
                body.vY = newVY1;
                otherBody.vX = newVX2;
                otherBody.vY = newVY2;
            }
        }
    }

    //based on newtons grav law
    function updateBody(body, bodies) {
        
        
        //x and y accel init
        let aX = 0;
        let aY = 0;

        for (const otherBody of bodies) {
            if (body !== otherBody) {
                const bodyData = body;
                //pos diffs for each body to calculate r 
                const dx = otherBody.x - body.x;
                const dy = otherBody.y - body.y;

                //r = distance between the two bodies
                const r = Math.sqrt(dx**2 + dy**2);
                
                const combRadius = body.radius + otherBody.radius;
                
                
                //coll handling
                if (r < combRadius) {
                    if(enableCollisions){

                        
                        handleCollision(body,otherBody);
                        
                        
                    }else{
                        
                        continue;
                    }
                }
                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                
                
                const force = G * ((body.mass * otherBody.mass) / (r**2  + EPSILON**2));

                console.log(`Force between ${body.id} and ${otherBody.id}:`, force);
                console.log(`Mass of ${body.id}: ${body.mass}, Mass of ${otherBody.id}: ${otherBody.mass}`);
                
                const accel = force / body.mass;
                //multiply acell force by direction and add to dir
                aX += accel * (dx / r);
                aY += accel * (dy / r);
                
                
                console.log(`dx: ${dx}, dy: ${dy}, r: ${r}`);
                console.log(`ax: ${aX}, ay: ${aY}`);


            }
            
        }


        if(!body.staticBody){
            
            body.vX += aX * SIM_SPEED;
            body.vY += aY * SIM_SPEED;

            body.x += body.vX;
            body.y += body.vY;

            //trail stuff
            //add cur pos to trail list
            body.trail.push({ x: body.x, y: body.y });

            //trail lims
            if (body.trail.length > 1000) {
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
        
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let bodiesToDelete = [];
        
            // Now draw the updated bodies
            bodies.forEach(body => {
                const collsionData = updateBody(body, bodies);
                
                GravBody({ ...body, ctx });
                
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