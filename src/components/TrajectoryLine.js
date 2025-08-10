export default function TrajectoryLine(props) {
    const { body, existingBodies, steps = 100, stepSize = 1e-6 } = props;

    if (!body || !existingBodies) return null;

    //Physics constants
    const G = 6.6743e-11;
    const EPSILON = 1e-2;

    //function to calculate gravitational acceleration for trajectory prediction
    function calculateTrajectoryAcceleration(testBody, bodies) {
        let aX = 0;
        let aY = 0;
        
        for (const otherBody of bodies) {
            const deltaX = otherBody.x - testBody.x;
            const deltaY = otherBody.y - testBody.y;
            
            let r2 = deltaX ** 2 + deltaY ** 2;
            let r = Math.sqrt(r2) + EPSILON;
            
            const force = G * (testBody.mass * otherBody.mass) / r2;
            const acceleration = force / testBody.mass;
            
            aX += acceleration * (deltaX / r);
            aY += acceleration * (deltaY / r);
        }
        
        return { aX, aY };
    }

    //Predict trajectory points using simplified integration
    function predictTrajectory() {
        const trajectoryPoints = [];
        
        
        const testBody = {
            x: body.x,
            y: body.y,
            vX: body.vX,
            vY: body.vY,
            mass: body.mass
        };

        trajectoryPoints.push({ x: testBody.x, y: testBody.y });

        for (let i = 0; i < steps; i++) {
            // Calculate acceleration
            const { aX, aY } = calculateTrajectoryAcceleration(testBody, existingBodies);
            
            //simple Euler integration for the trajectory prediction line
            testBody.vX += aX * stepSize;
            testBody.vY += aY * stepSize;
            testBody.x += testBody.vX * stepSize;
            testBody.y += testBody.vY * stepSize;
            
            trajectoryPoints.push({ x: testBody.x, y: testBody.y });
        }
        
        return trajectoryPoints;
    }

    const trajectoryPoints = predictTrajectory();

    //get canvas position for the svg
    const canvas = document.getElementById("canvas");
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();

    return (
        <svg
            style={{
                position: 'absolute',
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: '1800px',
                height: '1000px',
                pointerEvents: 'none',
                zIndex: 10
            }}
        >
            <polyline
                points={trajectoryPoints.map(point => `${point.x},${point.y}`).join(' ')}
                fill="none"
                stroke="yellow"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
            />
        </svg>
    );
}