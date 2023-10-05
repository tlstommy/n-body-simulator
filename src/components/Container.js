import React, { useRef, useEffect } from 'react';
import GravBody from "./GravBody";
import Simulation from './Simulation';


export default function Container(){

    const bodiesData = [
        { x: 400, y: 300, vX: 0, vY: 0, radius: 20, color: 'yellow', mass: 5000, staticBody: true},

        { x: 550, y: 450, vX: 0, vY: 0, radius: 10, color: 'green', mass: 50, staticBody: false},
        { x: 250, y: 450, vX: 0, vY: 0, radius: 10, color: 'red', mass: 50, staticBody: false},
        { x: 400, y: 90, vX: 0, vY: 0, radius: 10, color: 'blue', mass: 50, staticBody: false},
    ];

    

    return(
        <div>
            <Simulation bodies={bodiesData} />
        </div>
    );
}