import React, { useRef, useEffect, useState } from 'react';
import GravBody from "./GravBody";
import { SimulationSettings } from '../SimulationSettings';
import LaunchLine from './LaunchLine';
import TrajectoryLine from './TrajectoryLine';
import Simulation from './Simulation';


export default function Container(){

    const [bodiesData, setBodiesData] = useState([
        
        // === STABLE THREE-BODY SYSTEMS ===
        
        // Figure-8 orbit (stable chaotic system)
        { x: 900, y: 400, vX: 0.347, vY: 0.533, radius: 8, color: 'red', mass: 1, staticBody: false, trail: [], id: "body1"},
        { x: 900, y: 600, vX: 0.347, vY: 0.533, radius: 8, color: 'green', mass: 1, staticBody: false, trail: [], id: "body2"},
        { x: 900, y: 500, vX: -0.694, vY: -1.066, radius: 8, color: 'blue', mass: 1, staticBody: false, trail: [], id: "body3"},
        
        // === ALTERNATIVE CONFIGURATIONS (comment/uncomment to try) ===
        
        // Stable triangular orbit (Lagrange points style)
        // { x: 900, y: 400, vX: -0.5, vY: 0.866, radius: 10, color: 'red', mass: 1, staticBody: false, trail: [], id: "body1"},
        // { x: 800, y: 573, vX: 1.0, vY: 0, radius: 10, color: 'green', mass: 1, staticBody: false, trail: [], id: "body2"},
        // { x: 1000, y: 573, vX: -0.5, vY: -0.866, radius: 10, color: 'blue', mass: 1, staticBody: false, trail: [], id: "body3"},
        
        // Hierarchical system (binary + third body)
        // { x: 850, y: 500, vX: 0, vY: 1.5, radius: 12, color: 'red', mass: 2, staticBody: false, trail: [], id: "body1"},
        // { x: 950, y: 500, vX: 0, vY: -1.5, radius: 12, color: 'green', mass: 2, staticBody: false, trail: [], id: "body2"},
        // { x: 900, y: 350, vX: 2.0, vY: 0, radius: 8, color: 'blue', mass: 0.5, staticBody: false, trail: [], id: "body3"},
        
        // Pythagorean three-body problem (chaotic)
        // { x: 900, y: 500, vX: 0, vY: 0, radius: 15, color: 'red', mass: 3, staticBody: false, trail: [], id: "body1"},
        // { x: 800, y: 500, vX: 0, vY: 0, radius: 12, color: 'green', mass: 4, staticBody: false, trail: [], id: "body2"},
        // { x: 1000, y: 400, vX: 0, vY: 0, radius: 10, color: 'blue', mass: 5, staticBody: false, trail: [], id: "body3"},
    ]);

    const colors = ['red','green','blue','yellow','purple','orange','pink','light-blue']

    const [startClickPos,setStartClickPos] = useState(null);
    const [endClickPos,setEndClickPos] = useState(null);
    const [mouseHeldDown,setMouseHeldDown] = useState(null);
    
    //Add keyboard event listener for reset and stuff
    const [isPaused, setIsPaused] = useState(false);

    const handleKeyPress = (event) => {
        if (!event.key || typeof event.key !== 'string') return;
        
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 'r':
                console.log('R key pressed - Reloading page');
                window.location.reload();
                break;
                
            case 't':
                console.log('T key pressed - Toggling trails from:', SimulationSettings.enableTrails);
                SimulationSettings.enableTrails = !SimulationSettings.enableTrails;
                console.log('Trails toggled to:', SimulationSettings.enableTrails);
                
                // Clear existing trails when disabling
                if (!SimulationSettings.enableTrails) {
                    setBodiesData(prevBodies => 
                        prevBodies.map(body => ({ ...body, trail: [] }))
                    );
                }
                break;
                
            case 'm':
                console.log('M key pressed - Toggling physics markers from:', SimulationSettings.enablePhysicsMarkers);
                SimulationSettings.enablePhysicsMarkers = !SimulationSettings.enablePhysicsMarkers;
                console.log('Physics markers toggled to:', SimulationSettings.enablePhysicsMarkers);
                break;
                
            case ' ':
            case 'p':
            case 'space':
                event.preventDefault(); // Prevent page scroll
                console.log('Space key pressed - Toggling pause from:', isPaused);
                setIsPaused(prev => !prev);
                break;
                
            default:
                // Do nothing for other keys
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    

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
        
        const velocityFactor = SimulationSettings.launchVelocityFactor;
        const randomIndex = Math.floor(Math.random() * colors.length);
        
        //make it 
        const newBody = {
            x: startClickPos.x - rect.left, //offset to match launch line 
            y: startClickPos.y - rect.top,  //offset to match launch line       
            vX: deltaX * velocityFactor, 
            vY: deltaY * velocityFactor, 
            radius: 5, 
            color: colors[randomIndex],
            mass: 1,
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

    // Create predicted body data for trajectory calculation
    const getPredictedBody = () => {
        if (!startClickPos || !endClickPos) return null;

        var canvas = document.getElementById("canvas");
        if (!canvas) return null;
        var rect = canvas.getBoundingClientRect();

        // Convert screen coordinates to canvas coordinates
        const startCanvasX = startClickPos.x - rect.left;
        const startCanvasY = startClickPos.y - rect.top;
        const endCanvasX = endClickPos.x - rect.left;
        const endCanvasY = endClickPos.y - rect.top;

        const deltaX = startCanvasX - endCanvasX;
        const deltaY = startCanvasY - endCanvasY;
        const velocityFactor = SimulationSettings.launchVelocityFactor;

        return {
            x: startCanvasX,
            y: startCanvasY,
            vX: deltaX * velocityFactor,
            vY: deltaY * velocityFactor,
            mass: 1,
            radius: 10
        };
    };
    

    return(
        <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <LaunchLine start={startClickPos} end={endClickPos} />
            <TrajectoryLine body={getPredictedBody()} existingBodies={bodiesData} />
            <Simulation bodies={bodiesData} setBodiesData={setBodiesData} isPaused={isPaused} />
        </div>
    );
}