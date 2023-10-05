import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        { x: 400, y: 400, vX: 0, vY: 0, radius: 20, color: 'yellow', mass: 5000, staticBody: true},
        { x: 600, y: 400, vX: 0, vY: 1.5, radius: 10, color: 'green', mass: 50, staticBody: false},
        { x: 200, y: 400, vX: 0, vY: -1.5, radius: 10, color: 'red', mass: 50, staticBody: false},
    ]);


    const handleClick = (e) => {

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        console.log(mouseX,mouseY);


        //create a new grav body
        const newBody = {
            x: 600, 
            y: 400, 
            vX: 0, 
            vY: 1.5, 
            radius: 10, 
            color: 'purple', 
            mass: 50, 
            staticBody: false
        }

        //add a new body
        setBodiesData(existingBodies => [...existingBodies, newBody]);

    }
    

    return(
        <div  onClick={handleClick}>
            <Simulation bodies={bodiesData} />
        </div>
    );
}