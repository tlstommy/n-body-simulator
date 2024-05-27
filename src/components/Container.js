import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import LaunchLine from './LaunchLine';
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        { x: 400, y: 400, vX: 0, vY: 0, radius: 15, color: 'white', mass: setMassVal(1,14), staticBody: true, trail: []},
        { x: 250, y: 200, vX: 0, vY: 0, radius: 15, color: 'white', mass: setMassVal(1,14), staticBody: true, trail: []},   
        { x: 550, y: 200, vX: 0, vY: 0, radius: 15, color: 'white', mass: setMassVal(1,14), staticBody: true, trail: []},

        
        
    ]);


    const [startClickPos,setStartClickPos] = useState(null);
    const [endClickPos,setEndClickPos] = useState(null);
    const [mouseHeldDown,setMouseHeldDown] = useState(null);
    
    const handleMouseDown = (e) => {
        setStartClickPos({ x: e.clientX, y: e.clientY });
        setMouseHeldDown(true);
    }   

    const handleMouseMove = (e) => {
        
        setEndClickPos({ x: e.clientX, y: e.clientY });
        
    }


    //sets the mass by raising mass val to massmult pow
    function setMassVal(massVal,massPow){
        return massVal * Math.pow(10,massPow);
    }


    const handleMouseUp = (e) => {

        //calc mouse velocity
        if(mouseHeldDown){
            console.log(endClickPos)
            if(endClickPos === null){
                setEndClickPos(startClickPos);
            }
            setEndClickPos({ x: e.clientX, y: e.clientY });
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
            x: mouseX+deltaX, 
            y: mouseY+deltaY, 
            vX: deltaX/50, 
            vY: deltaY/50, 
            radius: 5, 
            color: 'purple', 
            mass: setMassVal(5,11), 
            staticBody: false,
            trail: []
        }

        //add a new body
        setBodiesData(existingBodies => [...existingBodies, newBody]);

        setMouseHeldDown(false);
        setStartClickPos(null);
        //setEndClickPos(null);
    }
    

    return(
        <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <LaunchLine start={startClickPos} end={endClickPos} />
            <Simulation bodies={bodiesData} />
        </div>
    );
}