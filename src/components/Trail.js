import React from "react";
export default function Trail(props){

    const { positions, color } = props;

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <path
                d={positions.map((pos, index) => `${index === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`).join(' ')}
                stroke={color}
                strokeWidth="2"
                fill="none"
            />
        </svg>
    );
}