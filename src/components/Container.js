import React, { useRef, useEffect } from 'react';
import GravBody from "./GravBody";
import Simulation from './Simulation';


export default function Container(){

    const bodiesData = [
        { xCoord: 100, yCoord: 100, bodyRadius: 20, bodyColor: 'blue', bodyMass: 100 },
    ];

    

    return(
        <div>
            <Simulation bodies={bodiesData} />
        </div>
    );
}