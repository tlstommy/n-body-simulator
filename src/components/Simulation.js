import React, { useRef, useEffect, useState} from 'react';
import GravBody from './GravBody';


export default function Simulation(props){
    const { bodies  } = props;
    
    const canvasRef = useRef(null);
    

    const [bodyText, setBodyText] = useState(); 

    const TRAILS = false;
    const PHYSICS_MARKERS = false;
    const SIM_SPEED = 1e-6;
    const EPSILON = 1e-2; //softening param to prevent singularities or physics errors on collisions
    const G = 6.6743e-11; //newtons universal Grav constant

    const enableCollisions = true;
    const collisionType = "elastic";
    
    function calculateTotalEnergy(bodies) {
        let keBlue = 0;
        let keGreen = 0;

        bodies.forEach(body => {
            if(body.color == 'green'){
            let speedSquared = body.vX ** 2 + body.vY ** 2;
            keGreen += 0.5 * body.mass * speedSquared; //KE = 0.5 * m * v^2
            
        }
            if(body.color == 'blue'){
                let speedSquared = body.vX **2 + body.vY**2;
                keBlue += 0.5 * body.mass * speedSquared; //KE = 0.5 * m * v^2
                
            }
        });
        //blue :2.9159466561511297e+34
        //console.log("\nTotal Kinetic Energy, Green:", keGreen);
        //console.log("Total Kinetic Energy, Blue :", keBlue);

        return keBlue;
    }
    
    
    
    function handleCollision(body, otherBody) {
        
        //var setup
        const x1 = { x: body.x, y: body.y };
        const x2 = { x: otherBody.x, y: otherBody.y };

        const m1v1 = { x: body.vX, y: body.vY };
        const m2v2 = { x: otherBody.vX, y: otherBody.vY };


        const dx = otherBody.x - body.x;
        //console.log(dx);
        const dy = otherBody.y - body.y;
        //console.log(dy);
        const distanceSquared =  dx**2 + dy**2;
        const distance = (Math.sqrt(distanceSquared));
        
        //console.log(Math.abs(body.vX - otherBody.vX));
        const overlap = body.radius + otherBody.radius - distance;
        
        
        if (overlap > 0) {
            const combMass = body.mass + otherBody.mass;
            
            
            const correction = overlap / 2;
            

        

            const normalX = dx / distance;
            const normalY = dy / distance;

            


            //move objects
            

            

            
            

            if (collisionType === "bounce") {
                [body.vX, otherBody.vX] = [otherBody.vX, body.vX];
                [body.vY, otherBody.vY] = [otherBody.vY, body.vY];
            } else if (collisionType === "elastic") {
                //rel velocitys
                const dvX = body.vX - otherBody.vX;
                const dvY = body.vY - otherBody.vY;
                //https://en.wikipedia.org/wiki/Elastic_collision
                //dot product of rel velocity and the normal coll vectors
                const dp = (dvX * normalX + dvY * normalY);    
                //console.log(overlap)
                if (dp >= 0 && overlap <= 0) return;
                //
                

                //from wiki
                //v`1 = v1 - (2m_2/(m1+m2) * (DP/ |x_1 - x_2|^2) * (x_1 - x_2)
                const v1 = ((2.0 * otherBody.mass) / combMass) * (dp / distance);
                const v2 = ((2.0 * body.mass) / combMass) * (dp / distance);
                body.vX -= v1 * dx;
                body.vY -= v1 * dy;
                otherBody.vX += v2 * dx;
                otherBody.vY += v2 * dy;


                //now update incase of overlaps
                const correction = overlap / 2.0;
                
                //console.log(distance)
                if (!body.staticBody) {
                    body.x -= normalX * correction;
                    body.y -= normalY * correction;
                }
                if (!otherBody.staticBody) {
                    otherBody.x += normalX * correction;
                    otherBody.y += normalY * correction;
                }

                
            }
        
        }
    }
    




    
    

    //calculate the Gravitational acceleration for a body based off the other bodies  https://en.wikipedia.org/wiki/Gravitational_acceleration
    function calculateGravAccelelration(body, bodies){
        
        //x and y accel init
        let aX = 0;
        let aY = 0;
        for (const otherBody of bodies) {
            if (body !== otherBody) {
    

                //pos diffs for each body to calculate r 
                const deltaX = otherBody.x - body.x;
                const deltaY = otherBody.y - body.y;

                //r = distance between the two bodies
                //const r = Math.sqrt(deltaX**2 + deltaY**2);
                let r2 = (deltaX ** 2 + deltaY ** 2);
                //r2 = Math.max(r2, EPSILON ** 2); // Prevents explosion in force at small r

                let r = Math.sqrt(r2) + EPSILON;
                
                
                //console.log(EPSILON);
                //console.log("")
                
                const combRadius = body.radius + otherBody.radius;

                //coll handling here
                
                if (r < combRadius) {
                    
                    if(enableCollisions){
                        handleCollision(body, otherBody);
                    }else{
                        continue;
                    }
                    //console.log("hit")
                    //continue;
                    
                    
                    
                }


                
                
                //Newton's law of universal gravitation to calc F, the gravitational force acting between the two objects
                
                
                //const force = G * ((body.mass * otherBody.mass) / (r**2  + EPSILON**2));
                
                var denom = r2

                const force = G * (body.mass * otherBody.mass) / (denom);
                //console.log(`\n${force.toFixed(4).padEnd(10)} = ${G} * (${(body.mass * otherBody.mass).toExponential(4).padEnd(10)}) / (${denom.toExponential(4).padEnd(10)})`);
                //console.log(force)
                //console.log(`Force between ${body.id} and ${otherBody.id}:, ${force}`);
                //console.log(`Mass of ${body.id}: ${body.mass}, Mass of ${otherBody.id}: ${otherBody.mass}`);
                
                //get the accel from force
                const acceleration = force / body.mass;
                //multiply acell force by direction and add to dir
                aX += acceleration * (deltaX / r);
                aY += acceleration * (deltaY / r);
                
                
                //console.log(dX: ${deltaX}, dY: ${deltaY}, r: ${r});
                //console.log(aX: ${aX}, aY: ${aY});

            }
        }

        
        
        
        return { aX, aY };


    }

    //https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
    //integrate with RK4 
    function rk4(body, bodies, dt){
        console.log(body)
        if(isNaN(body.vX)){
            throw 'nan error'
        }
        //get initial vals
        const {x:x0,y:y0,vX:vx0,vY: vy0 } = body

        


        //k1 - estimate accel
        const {aX:k1_ax, aY: k1_ay} = calculateGravAccelelration(body,bodies)
        
       
        // ✅ Compute k1 safely
    
        if (isNaN(k1_ax) || isNaN(k1_ay)) {
            console.error("NaN detected in k1 calculation!", { k1_ax, k1_ay, body });
            return;
        }
        
        
        
        const k1_vx = k1_ax * dt;
        const k1_vy = k1_ay * dt;
        
        const k1_x = vx0 * dt;
        const k1_y = vy0 * dt;

        console.log("k1")
        console.log(body)
        //k2 - estimate acceleration with k1 (half step)
        const k1_body = { ...body, x: x0 + 0.5 * k1_x, y: y0 + 0.5 * k1_y, vX: vx0 + 0.5 * k1_vx, vY: vy0 + 0.5 * k1_vy };
        
        //get accel now
        const { aX: k2_ax,aY:k2_ay} = calculateGravAccelelration(k1_body,bodies)
        const k2_vx = k2_ax * dt;
        const k2_vy = k2_ay * dt;

        const k2_x = (vx0 + 0.5 * k1_vx) * dt;
        const k2_y = (vy0 + 0.5 * k1_vy) * dt;


        console.log("k2")
        console.log(body)

        //k3 - estimate acceleration with k2 (half step)
        const k2_body = { ...body, x: x0 + 0.5 * k2_x, y: y0 + 0.5 * k2_y, vX: vx0 + 0.5 * k2_vx, vY: vy0 + 0.5 * k2_vy };
        const { aX: k3_ax,aY:k3_ay} = calculateGravAccelelration(k2_body,bodies)
        const k3_vx = k3_ax * dt;
        const k3_vy = k3_ay * dt;

        const k3_x = (vx0 + 0.5 * k2_vx) * dt;
        const k3_y = (vy0 + 0.5 * k2_vy) * dt;

        console.log("k3")
        console.log(body)
        //k4 - estimate acceleration with k3 (full)
        const k3_body = { ...body, x: x0 + 0.5 * k3_x, y: y0 + 0.5 * k3_y, vX: vx0 + 0.5 * k3_vx, vY: vy0 + 0.5 * k3_vy };
        const { aX: k4_ax,aY:k4_ay} = calculateGravAccelelration(k3_body,bodies)
        const k4_vx = k4_ax * dt;
        const k4_vy = k4_ay * dt;

        const k4_x = (vx0 + k3_vx) * dt;
        const k4_y = (vy0 + k3_vy) * dt;


        //rk4 final integration step

        body.x += (k1_x + 2 * k2_x + 2 * k3_x + k4_x) / 6;
        body.y += (k1_y + 2 * k2_y + 2 * k3_y + k4_y) / 6;
        body.vX += (k1_vx + 2 * k2_vx + 2 * k3_vx + k4_vx) / 6;
        body.vY += (k1_vy + 2 * k2_vy + 2 * k3_vy + k4_vy) / 6;
        
        console.log("k4")
        console.log(body)
        
    }

    //based on newtons grav law
    function updateBody(body, bodies) {
        
        //no need to check static bodies
        if (body.staticBody) return; 

        //call rk4 method for integration
        rk4(body, bodies, SIM_SPEED);


        if(TRAILS){
            //trail stuff
            //add cur pos to trail list
            body.trail.push({ x: body.x, y: body.y });

            //trail lims
            if (body.trail.length > 5000) {
                body.trail.shift();
            }
        }
                     
        
        //setBodyText("G: " + G + ", Sim Speed: " + SIM_SPEED + " " + Math.sqrt((aX * aX) + (aY * aY)));
    }

    const animationRef = useRef();
    
    useEffect(() => {
        
        const canvas = canvasRef.current;
        
        const ctx = canvas.getContext('2d');

        //fix anim loop bug with multiple bodies
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        let frameCount = 0;
        
        //Anim bodies
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let bodiesToDelete = [];
            
            // Now draw the updated bodies
            bodies.forEach(body => {
                const collsionData = updateBody(body, bodies);
                
                //const { aX, aY } = calculateGravAccelelration(body, bodies);
                GravBody({ ...body, ctx, showPhysicsMarkers: PHYSICS_MARKERS  });
                
                if(collsionData){
                    if (collsionData.type === "fragment") {
                        bodiesToDelete = bodiesToDelete.concat(collsionData.collidors);
                    
                    //normal removal
                    }else if(collsionData.type === ""){
                        bodiesToDelete = bodiesToDelete.concat(collsionData.collidors);
                    }
                }
            });

            bodiesToDelete.forEach(bodyToDelete => {
                const index = bodies.indexOf(bodyToDelete);
                if (index !== -1) {
                    bodies.splice(index, 1);
                }
            });
            

            calculateTotalEnergy(bodies);
            
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            
        };
    }, [bodies]);
    
    
    return( <div>
        <canvas id="canvas" ref={canvasRef} width={1800} height={1000} className="sim-canvas" />
        <p style={{ whiteSpace: "nowrap", width: "100px"}}>{bodyText}</p>
    </div>
    );
}