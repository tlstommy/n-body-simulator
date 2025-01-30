import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyText, setBodyText] = useState(); 

    const SIM_SPEED = 0.1;
    const EPSILON = 1e6; //softening param
    const G = 6.6743e-11; //newtons universal Grav constant

    const enableCollisions = false;
    const collisonType = "bounce"
    
    
    function handleCollision(body, otherBody){
        if (body.mass === otherBody.mass) {
            return {
                type: "fragment",
                collidors: [body, otherBody]
            }; 
        }
        if (body.mass > otherBody.mass) {
            return {
                type: "",
                collidors: [otherBody]
            }; 
        }else{
            return {
                type: "",
                collidors: [body]
            }; 
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

                //r = distance between the two using pyth theroy plus the softening param squared
                const r = Math.sqrt(dx * dx + dy * dy + EPSILON * EPSILON);
                const combRadius = body.radius + otherBody.radius;
                
                
                //coll handling
                if (r < combRadius) {
                    if(enableCollisions){

                        if(collisonType === "bounce"){
                            [body.vX, otherBody.vX] = [otherBody.vX, body.vX];
                            [body.vY, otherBody.vY] = [otherBody.vY, body.vY];
                            continue;
                        }
                        else{
                            return handleCollision(body,otherBody);
                        }
                        
                    }else{
                        
                        continue;
                    }
                }
                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                const force = G * ((body.mass * otherBody.mass) / (r * r));
                
                //multiply force by direction and add to dir
                aX += (force / body.mass) * (dx / r);
                aY += (force / body.mass) * (dy / r);
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
        //chatgpt helped with this part
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