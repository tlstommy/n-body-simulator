import React, { useRef, useEffect } from 'react';
import GravBody from "./GravBody";
import Simulation from './Simulation';


export default function Container(){

    const bodiesData = [
        { x: 400, y: 300, vX: 0, vY: 0, radius: 20, color: 'blue', mass: 200, staticBody: true},
        
        { x: 500, y: 300, vX: 0, vY: 1.5, radius: 10, color: 'green', mass: 10, staticBody: false},
        { x: 600, y: 300, vX: 0, vY: -1.5, radius: 10, color: 'red', mass: 10, staticBody: false},
    ];

    

    return(
        <div>
            <Simulation bodies={bodiesData} />
        </div>
    );
}