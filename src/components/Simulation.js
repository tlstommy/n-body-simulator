import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyY, setBodyY] = useState(); 

    const SIM_SPEED = 0.1;
    const G = 1; // Grav constant
    
    function handleCollision(body, otherBody,dx,dy,r,combRadius){
        
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

                //r = distance between the two using pyth theroy
                const r = Math.sqrt(dx * dx + dy * dy);


                
                

                const combRadius = body.radius + otherBody.radius;
                
                
                //coll handling
                if (r < combRadius) {
                    if (body.mass === otherBody.mass) {
                        return [body, otherBody]; 
                    }
                    if (body.mass > otherBody.mass) {
                        return [otherBody]; 
                    }else{
                        return [body]; 
                    }
                    //return [body]; 
                }
                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                const force = G * ((body.mass * otherBody.mass) / (r * r));
                
                //multiply force by direction and add to dir
                aX += (force * dx / r) / body.mass;
                aY += (force * dy / r) / body.mass;
            }
        }


        if(!body.staticBody){
            
            body.vX += aX * SIM_SPEED;
            body.vY += aY * SIM_SPEED;

            body.x += body.vX;
            body.y += body.vY;
                     
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let bodiesToDelete = [];
        
            // Now draw the updated bodies
            bodies.forEach(body => {
                const collisionData = updateBody(body, bodies);
                GravBody({ ...body, ctx });

                if (collisionData) {
                    bodiesToDelete = bodiesToDelete.concat(collisionData);
                }
            });

            bodiesToDelete.forEach(bodyToDelete => {
                const index = bodies.indexOf(bodyToDelete);
                if (index !== -1) {
                    bodies.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, [bodies]);
    
    
    return( <div>
        <canvas id="canvas" ref={canvasRef} width={800} height={800} className="sim-canvas" />
        <p style={{ whiteSpace: "nowrap", width: "100px"}}>{bodyY}</p>
    </div>
    );
}