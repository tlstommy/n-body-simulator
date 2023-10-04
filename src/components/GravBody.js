//create a new grav body
export default function GravBody(props){

    const { x, y, vX, vY, radius, color, mass, staticBody, ctx } = props;

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