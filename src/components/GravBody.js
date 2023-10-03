//create a new grav body
export default function GravBody(props){

    const { xCoord, yCoord, bodyRadius, bodyColor, bodyMass, staticBody, ctx } = props;

    //draw body to canvas
    if(ctx) {
        ctx.beginPath();
        ctx.arc(xCoord, yCoord, bodyRadius, 0, 2 * Math.PI);
        ctx.fillStyle = bodyColor;
        ctx.fill();
    }


    //draws on canvas so return null
    return(null);

}