import React, { useRef, useEffect } from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);



            //update
            bodies.forEach(body => {
                GravBody({ ...body, ctx });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, [bodies]);
    
    
    return <canvas ref={canvasRef} width={800} height={600} className="sim-canvas" />
}