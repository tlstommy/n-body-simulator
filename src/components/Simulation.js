import React, { useRef, useEffect } from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    
    
    const G = 0.2; // Grav constant
    

    //based on newtrons grav law
    function updateBody(body, bodies) {
        
        
        //x and y accel init
        let ax = 0;
        let ay = 0;

        for (const otherBody of bodies) {
            if (body !== otherBody) {

                //pos diffs for each body to calculate r 
                const dx = otherBody.x - body.x;
                const dy = otherBody.y - body.y;

                //r = distance between the two using pyth theroy
                const r = Math.sqrt(dx * dx + dy * dy);

                const combRadius = body.radius + otherBody.radius;
                
                
                //coll handling
                if (r < combRadius) {
            
                    [body.vx, otherBody.vx] = [otherBody.vx, body.vx];
                    [body.vy, otherBody.vy] = [otherBody.vy, body.vy];
                    continue;
                }
                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                const force = G * ((body.mass * otherBody.mass) / (r * r * r));
                
                //multiply force by direction and add to dir
                ax += force * dx;
                ay += force * dy;
                console.log(r);
            }
        }


        if(!body.staticBody){
            body.vX += ax;
            body.vY += ay;
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
            
            

            bodies.forEach(body => {
                updateBody(body, bodies);
            });
        
            // Now draw the updated bodies
            bodies.forEach(body => {
                GravBody({ ...body, ctx });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, [bodies]);
    
    
    return <canvas ref={canvasRef} width={800} height={800} className="sim-canvas" />
}