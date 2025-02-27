//create a new grav body
export default function GravBody(props){

    const { x, y, vX, vY, aX, aY, radius, color, mass, staticBody, showPhysicsMarkers, ctx} = props;
    if (!ctx) return null;
    
    //draw physics markers/lines
    if (ctx && showPhysicsMarkers) {
        const physicsMarkerLen = 50;

        //calc magnitudes
        const vMag = Math.sqrt(vX ** 2 + vY ** 2);
        const aMag = Math.sqrt(aX ** 2 + aY ** 2);

        //normalize vectors
        const vNormX = vMag > 0 ? (vX / vMag) * physicsMarkerLen : 0;
        const vNormY = vMag > 0 ? (vY / vMag) * physicsMarkerLen : 0;
        const aNormX = aMag > 0 ? (aX / aMag) * physicsMarkerLen : 0;
        const aNormY = aMag > 0 ? (aY / aMag) * physicsMarkerLen : 0;

        //accell vector
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.moveTo(x, y);
            ctx.lineTo(x + aNormX, y + aNormY);
            ctx.stroke();
        }

        //velocity vector
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(x, y);
            ctx.lineTo(x + vNormX, y + vNormY);
            ctx.stroke();
        }
    }

    //draw trails
    if (ctx && props.trail) {
        ctx.beginPath();
        props.trail.forEach((point, index) => {
            ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            if (index > 0) {
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(props.trail[index - 1].x, props.trail[index - 1].y);
            }
        });
        ctx.strokeStyle = props.color;
        ctx.stroke();
    }  

    //draw body to canvas
    if(ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }


    //draws on canvas so return null
    return(null);

}