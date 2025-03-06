import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import LaunchLine from './LaunchLine';
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        
        //2body
        //{ x: 900, y: 415, vX: 0, vY: 0, radius: 15, color: 'white', mass: 5.972e24, staticBody: true, trail: [], id:"staticbody"},
        //{ x: 900, y: 215, vX: 1400000, vY: 0, radius: 5, color: 'blue', mass: 7.34767309e22, staticBody: false, trail: [], id:"orbitbody"},
        

        //{ x: 1000, y: 550, vX: 0, vY: 0, radius: 15, color: 'red', mass: setMassVal(6,24), staticBody: false, trail: []},
        { x: 800, y: 550, vX: 0, vY: 0, radius: 15, color: 'blue', mass: setMassVal(6,24), staticBody: false, trail: []},
        { x: 900, y: 550, vX: 0, vY: 0, radius: 15, color: 'green', mass: setMassVal(6,24), staticBody: false, trail: []},
       


        //3body
        //{ x: 900, y: 750, vX: 0, vY: 100, radius: 15, color: 'red', mass: setMassVal(6,24), staticBody: false, trail: []},
        //{ x: 600, y: 250, vX: 0, vY:-100, radius: 15, color: 'green', mass: setMassVal(6,24), staticBody: false, trail: []},
        //{ x: 1200, y: 250, vX: 100, vY: 0, radius: 15, color: 'blue', mass: setMassVal(6,24), staticBody: false, trail: []},
        //
        //{ x: 900, y: 415, vX: 0, vY: 0, radius: 1, color: 'white', mass: setMassVal(1,1), staticBody: true, trail: []},

        //four body 
        //{ x: 900, y: 215, vX: 100000, vY: 0, radius: 5, color: 'blue', mass: 7.34767309e22, staticBody: false, trail: []},
        //{ x: 900, y: 615, vX: -100000, vY: 0, radius: 5, color: 'red', mass: 7.34767309e22, staticBody: false, trail: []},
        //{ x: 700, y: 415, vX: 0, vY: -100000, radius: 5, color: 'green', mass: 7.34767309e22, staticBody: false, trail: []},
        //{ x: 1100, y: 415, vX: 0, vY: 100000, radius: 5, color: 'purple', mass: 7.34767309e22, staticBody: false, trail: []},
        
        
    ]);

    const colors = ['red','green','blue','yellow','purple','orange','pink','light-blue']

    const [startClickPos,setStartClickPos] = useState(null);
    const [endClickPos,setEndClickPos] = useState(null);
    const [mouseHeldDown,setMouseHeldDown] = useState(null);
    

    //sets the mass by raising mass val to massmult pow may be easier to use with future stuff??
    function setMassVal(massVal,massPow){
        return massVal * Math.pow(10,massPow);
    }

    const handleMouseDown = (e) => {
        setStartClickPos({ x: e.clientX, y: e.clientY });
        
        console.log(e.clientX + " , " + e.clientY )
        setMouseHeldDown(true);
    }   

    const handleMouseMove = (e) => {
        if (mouseHeldDown) {
            setEndClickPos({ x: e.clientX, y: e.clientY });
        }
        
    }

    const handleMouseUp = (e) => {

        if (!mouseHeldDown || !startClickPos) return;

        // Ensure endClickPos is not null
        const finalEndClickPos = endClickPos || startClickPos;
        
        
        //calc mouse velocity
        if(mouseHeldDown){
            console.log(endClickPos)
            if(endClickPos === null){
                setEndClickPos(startClickPos);
            }
            setEndClickPos({ x: e.clientX, y: e.clientY });
            var deltaX = startClickPos.x - finalEndClickPos.x;
            var deltaY = startClickPos.y - finalEndClickPos.y;
        } 

        let lastColor = ""


        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        console.log(mouseX,mouseY);
        
        let i = Math.floor(Math.random() * colors.length);
        
        const velocityFactor = 1e4;
        const randomIndex = Math.floor(Math.random() * colors.length);
        
        //make it 
        const newBody = {
            x: startClickPos.x - rect.left, //offset to match launch line 
            y: startClickPos.y - rect.top,  //offset to match launch line       
            vX: deltaX * velocityFactor, 
            vY: deltaY * velocityFactor, 
            radius: 5, 
            color: colors[randomIndex],
            mass: 6e1,
            staticBody: false,
            trail: [],
            id: "launchbody"
        };

        

        //add a new body
        setBodiesData((existingBodies) => [...existingBodies, newBody]);

        setMouseHeldDown(false);
        setStartClickPos(null);
        setEndClickPos(null);
    }
    

    return(
        <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <LaunchLine start={startClickPos} end={endClickPos} />
            <Simulation bodies={bodiesData} setBodiesData={setBodiesData} />
        </div>
    );
}