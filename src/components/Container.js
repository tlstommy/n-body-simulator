import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import LaunchLine from './LaunchLine';
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        { x: 400, y: 400, vX: 0, vY: 0, radius: 15, color: 'white', mass: 1000, staticBody: true},
        { x: 100, y: 400, vX: 0, vY: -1.5, radius: 8, color: 'yellow', mass: 10, staticBody: false},
        { x: 700, y: 400, vX: 0, vY: 1.5, radius: 8, color: 'green', mass: 10, staticBody: false},
        { x: 400, y: 100, vX: 1.5, vY: 0, radius: 8, color: 'red', mass: 10, staticBody: false},
        { x: 400, y: 700, vX: -1.5, vY: 0, radius: 8, color: 'blue', mass: 10, staticBody: false},
    ]);


    const [startClickPos,setStartClickPos] = useState(null);
    const [endClickPos,setEndClickPos] = useState(null);
    const [mouseHeldDown,setMouseHeldDown] = useState(null);
    
    const handleMouseDown = (e) => {
        setStartClickPos({ x: e.clientX, y: e.clientY });
        setMouseHeldDown(true);
    }   

    const handleMouseMove = (e) => {
        if(mouseHeldDown){
            setEndClickPos({ x: e.clientX, y: e.clientY });
            
        }
    }


    const handleMouseUp = (e) => {

        //calc mouse velocity
        if(mouseHeldDown){
            var deltaX = startClickPos.x - endClickPos.x;
            var deltaY = startClickPos.y - endClickPos.y;
        } 




        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        console.log(mouseX,mouseY);


        //create a new grav body
        const newBody = {
            x: mouseX, 
            y: mouseY, 
            vX: deltaX/100, 
            vY: deltaY/100, 
            radius: 10, 
            color: 'purple', 
            mass: 10, 
            staticBody: false
        }

        //add a new body
        setBodiesData(existingBodies => [...existingBodies, newBody]);

        setMouseHeldDown(false);
        setStartClickPos(null);
        setEndClickPos(null);
    }
    

    return(
        <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <LaunchLine start={startClickPos} end={endClickPos} />
            <Simulation bodies={bodiesData} />
        </div>
    );
}