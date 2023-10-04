import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyY, setBodyY] = useState(); 

    const TIME_MODIFIER = 1;
    const G = 0.000667; // Grav constant
    

    //based on newtons grav law
    function updateBody(body, bodies) {
        
        
        //x and y accel init
        let aX = 0;
        let aY = 0;

        for (const otherBody of bodies) {
            if (body !== otherBody) {

                //pos diffs for each body to calculate r 
                const dx = otherBody.x - body.x;
                const dy = otherBody.y - body.y;

                //r = distance between the two using pyth theroy
                const r = Math.sqrt(dx * dx + dy * dy);


                
                
                //coll handling
                if (r <  body.radius + otherBody.radius) {
                    
                    console.log("collide!")
                    
                    
                    continue;
                }
                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                const force = G * ((body.mass * otherBody.mass) / (r * r));
                
                //multiply force by direction and add to dir
                aX += (force * dx / r) / body.mass;
                aY += (force * dy / r) / body.mass;
                console.log(r);
            }
        }


        if(!body.staticBody){
            const newX = body.x + body.vX * TIME_MODIFIER + 0.5 * aX * TIME_MODIFIER * TIME_MODIFIER;
            const newY = body.y + body.vY * TIME_MODIFIER + 0.5 * aY * TIME_MODIFIER * TIME_MODIFIER;

            body.vX += aX * TIME_MODIFIER;
            body.vY += aY * TIME_MODIFIER;

            body.x = newX;
            body.y = newY;
                     
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < 10; i++) {
                bodies.forEach(body => {
                    updateBody(body, bodies);
                });
            }

            
        
            // Now draw the updated bodies
            bodies.forEach(body => {
                updateBody(body, bodies);
                GravBody({ ...body, ctx });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, [bodies]);
    
    
    return( <div>
        <canvas ref={canvasRef} width={800} height={600} className="sim-canvas" />
        <p style={{ whiteSpace: "nowrap", width: "100px"}}>{bodyY}</p>
    </div>
    );
}