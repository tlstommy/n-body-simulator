import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        { x: 400, y: 400, vX: 0, vY: 0, radius: 15, color: 'white', mass: 1000, staticBody: true},
        { x: 100, y: 400, vX: 0, vY: -1.5, radius: 8, color: 'yellow', mass: 10, staticBody: false},
        { x: 700, y: 400, vX: 0, vY: 1.5, radius: 8, color: 'green', mass: 10, staticBody: false},
        { x: 400, y: 100, vX: 1.5, vY: 0, radius: 8, color: 'red', mass: 10, staticBody: false},
        { x: 400, y: 700, vX: -1.5, vY: 0, radius: 8, color: 'blue', mass: 10, staticBody: false},
    ]);
    


    const handleClick = (e) => {
        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        console.log(mouseX,mouseY);


        //create a new grav body
        const newBody = {
            x: mouseX, 
            y: mouseY, 
            vX: -1.5, 
            vY: 0, 
            radius: 10, 
            color: 'purple', 
            mass: 10, 
            staticBody: false
        }

        //add a new body
        setBodiesData(existingBodies => [...existingBodies, newBody]);

    }
    

    return(
        <div onClick={handleClick}>
            <Simulation bodies={bodiesData} />
        </div>
    );
}