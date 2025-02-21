//create a new grav body
export default function GravBody(props){

    const { x, y, vX, vY, radius, color, mass, staticBody, ctx } = props;
    if (!ctx) return null;
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