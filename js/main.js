'use strict';

const VID_POS_MAP = new Map(
    //edge cubies
    [
    [1,{x:-1,y:1,z:0}],
    [2,{x:-1,y:0,z:1}],
    [3,{x:-1,y:-1,z:0}],
    [4,{x:-1,y:0,z:-1}],
    [5,{x:0,y:1,z:-1}],
    [6,{x:0,y:1,z:1}],
    [7,{x:0,y:-1,z:1}],
    [8,{x:0,y:-1,z:-1}],
    [9,{x:1,y:1,z:0}],
    [10,{x:1,y:0,z:-1}],
    [11,{x:1,y:-1,z:0}],
    [12,{x:1,y:0,z:1}],
    //corner cubies
    [13,{x:-1,y:1,z:-1}],
    [14,{x:-1,y:1,z:1}],
    [15,{x:-1,y:-1,z:1}],
    [16,{x:-1,y:-1,z:-1}],
    [17,{x:1,y:1,z:-1}],
    [18,{x:1,y:-1,z:-1}],
    [19,{x:1,y:-1,z:1}],
    [20,{x:1,y:1,z:1}],
    //center cubies (l,r,f,b,u,d)
    [21,{x:-1,y:0,z:0}],
    [22,{x:1,y:0,z:0}],
    [23,{x:0,y:0,z:1}],
    [24,{x:0,y:0,z:-1}],
    [25,{x:0,y:1,z:0}],
    [26,{x:0,y:-1,z:0}],
    ]
);

const FACE_ID_MAP = ['r','l','u','d','f','b'];
const COLORS = [new THREE.Color(1,1,1),new THREE.Color(1,1,0),new THREE.Color(1,0,0),new THREE.Color(1,0.4,0),new THREE.Color(0,0,1),new THREE.Color(0,1,0)];

let cube = {
    LEFT_EDGE_CUBIES : [1,2,3,4],
    RIGHT_EDGE_CUBIES : [9,10,11,12],
    UP_EDGE_CUBIES : [1,5,9,6],
    DOWN_EDGE_CUBIES : [3,7,11,8],
    FRONT_EDGE_CUBIES : [6,12,7,2],
    BACK_EDGE_CUBIES : [5,4,8,10],

    LEFT_CORNER_CUBIES : [13,14,15,16],
    RIGHT_CORNER_CUBIES : [17,18,19,20],
    UP_CORNER_CUBIES : [13,17,20,14],
    DOWN_CORNER_CUBIES : [15,19,18,16],
    FRONT_CORNER_CUBIES : [14,20,19,15],
    BACK_CORNER_CUBIES : [13,16,18,17],

    LEFT_CENTRAL_CUBIES : [21],
    RIGHT_CENTRAL_CUBIES : [22],
    FRONT_CENTRAL_CUBIES : [23],
    BACK_CENTRAL_CUBIES : [24],
    UP_CENTRAL_CUBIES : [25],
    DOWN_CENTRAL_CUBIES : [26],

    setCubiesVID : function(cubies,ids){
        console.log(ids);
        for(let i = 0; i < ids.length; i++){
            console.log(cubies[i].vid+" "+ids[i]);
            cubies[i].vid = ids[i];
        }
    },

    rotateClockwise : function(ids,count){
        let cubies = getCubiesByVID(ids);
        let ids_clone = [...ids];//cloning
        ids_clone.push.apply(ids_clone,ids_clone.splice(0,count));
        this.setCubiesVID(cubies,ids_clone);
    },

    rotateAntiClockwise : function(ids,count){
        let cubies = getCubiesByVID(ids);
        let ids_clone = [...ids];//cloning
        ids_clone.unshift.apply(ids_clone,ids_clone.splice(ids_clone.length-count,count));
        this.setCubiesVID(cubies,ids_clone);
    },

    r1 : function(){
        this.rotateClockwise(this.RIGHT_EDGE_CUBIES,1);
        this.rotateClockwise(this.RIGHT_CORNER_CUBIES,1);
    },

    r2 : function(){
        this.rotateClockwise(this.RIGHT_EDGE_CUBIES,2);
        this.rotateClockwise(this.RIGHT_CORNER_CUBIES,2);
    },

    r3 : function(){
        this.rotateAntiClockwise(this.RIGHT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.RIGHT_CORNER_CUBIES,1);
    },

    l1 : function(){
        this.rotateClockwise(this.LEFT_EDGE_CUBIES,1);
        this.rotateClockwise(this.LEFT_CORNER_CUBIES,1);
    },

    l2 : function(){
        this.rotateClockwise(this.LEFT_EDGE_CUBIES,2);
        this.rotateClockwise(this.LEFT_CORNER_CUBIES,2);
    },

    l3 : function(){
        this.rotateAntiClockwise(this.LEFT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.LEFT_CORNER_CUBIES,1);
    },

    f1 : function(){
        this.rotateClockwise(this.FRONT_EDGE_CUBIES,1);
        this.rotateClockwise(this.FRONT_CORNER_CUBIES,1);
    },

    f2 : function(){
        this.rotateClockwise(this.FRONT_EDGE_CUBIES,2);
        this.rotateClockwise(this.FRONT_CORNER_CUBIES,2);
    },

    f3 : function(){
        this.rotateAntiClockwise(this.FRONT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.FRONT_CORNER_CUBIES,1);
    },

    b1 : function(){
        this.rotateClockwise(this.BACK_EDGE_CUBIES,1);
        this.rotateClockwise(this.BACK_CORNER_CUBIES,1);
    },

    b2 : function(){
        this.rotateClockwise(this.BACK_EDGE_CUBIES,2);
        this.rotateClockwise(this.BACK_CORNER_CUBIES,2);
    },

    b3 : function(){
        this.rotateAntiClockwise(this.BACK_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.BACK_CORNER_CUBIES,1);
    },

    u1 : function(){
        this.rotateClockwise(this.UP_EDGE_CUBIES,1);
        this.rotateClockwise(this.UP_CORNER_CUBIES,1);
    },

    u2 : function(){
        this.rotateClockwise(this.UP_EDGE_CUBIES,2);
        this.rotateClockwise(this.UP_CORNER_CUBIES,2);
    },

    u3 : function(){
        this.rotateAntiClockwise(this.UP_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.UP_CORNER_CUBIES,1);
    },

    d1 : function(){
        this.rotateClockwise(this.DOWN_EDGE_CUBIES,1);
        this.rotateClockwise(this.DOWN_CORNER_CUBIES,1);
    },

    d2 : function(){
        this.rotateClockwise(this.DOWN_EDGE_CUBIES,2);
        this.rotateClockwise(this.DOWN_CORNER_CUBIES,2);
    },

    d3 : function(){
        this.rotateAntiClockwise(this.DOWN_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.DOWN_CORNER_CUBIES,1);
    },
};


let canvas = document.getElementById('c');
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({canvas});
let camera = new THREE.PerspectiveCamera(75,canvas.clientWidth/canvas.clientHeight,0.1,10);

camera.position.set(5,4,5);
camera.lookAt(0,0,0);
scene.background = 0x000000;

let world = new THREE.Object3D();

canvas.addEventListener('resize',handleResizing);
canvas.addEventListener('click',clickHandler);


handleResizing();
makeCube();
resetColor();
cube.r3();


function makeCube(){
    let black = new THREE.Color(0,0,0);
    let cubies = [];
    for(let i = 0; i < 26; i++){
        let cubie = makeCubie([black,black,black,black,black,black],VID_POS_MAP.get(i+1),i+1);
        cubies.push(cubie);
    }

    cube['cubies'] = cubies;

}

function makeCubie(colors,location,vid){

    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial({vertexColors : THREE.FaceColors,side:THREE.DoubleSide});
    let cube = new THREE.Mesh(geometry,material);
    
    cube.position.x = location.x*1.05;
    cube.position.y = location.y*1.05;
    cube.position.z = location.z*1.05;

    for(let i = 0; i < 6; i++){
        colorFace(cube,i,colors[i]);
    }

    scene.add(cube);
    cube.vid= vid;
    return cube;
}

function colorFace(cube,face,color){
    cube.geometry.faces[face*2].color = color;
    cube.geometry.faces[face*2+1].color = color;
}

function clickHandler(e){
    let rayCaster = new THREE.Raycaster();
    let mouse_position = new THREE.Vector2();
    
    mouse_position.x = (e.clientX/canvas.clientWidth)*2-1;
    mouse_position.y = 1 - 2*(e.clientY/canvas.clientHeight);

    rayCaster.setFromCamera(mouse_position.clone(),camera);
    let intersections = rayCaster.intersectObjects(cubes);
    console.log(intersections[0].face.color);
    intersections[0].face.color.setRGB(Math.random(),Math.random(),Math.random());
    intersections[0].object.geometry.colorsNeedUpdate = true;
}

let leftSideCubies = getCubiesByVID([].concat(cube.RIGHT_CENTRAL_CUBIES).concat(cube.RIGHT_CORNER_CUBIES).concat(cube.RIGHT_EDGE_CUBIES));

function render(time){
    
    for(let cubie of leftSideCubies){
        cubie.setRotationFromAxisAngle(new THREE.Vector3(1,0,0),0.01);
        cubie.rotateOnAxis(new THREE.Vector3(1,0,0),0.01);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function handleResizing(){
    renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
    camera.aspect = canvas.clientWidth/canvas.clientHeight;
    camera.updateProjectionMatrix();
}

function getCubieByVID(vid){
    for(let i = 0; i < 26; i++){
        if(cube.cubies[i].vid == vid){
            return cube.cubies[i];
        }
    }
}

function getCubiesByVID(vids){
    let ans = [];
    for(let vid of vids){
        ans.push(getCubieByVID(vid));
    }
    return ans;
}

function resetColor(){
    let leftSideCubies  = getCubiesByVID([].concat(cube.LEFT_EDGE_CUBIES).concat(cube.LEFT_CENTRAL_CUBIES).concat(cube.LEFT_CORNER_CUBIES));
    let rightSideCubies = getCubiesByVID([].concat(cube.RIGHT_EDGE_CUBIES).concat(cube.RIGHT_CENTRAL_CUBIES).concat(cube.RIGHT_CORNER_CUBIES));
    let frontSideCubies = getCubiesByVID([].concat(cube.FRONT_EDGE_CUBIES).concat(cube.FRONT_CENTRAL_CUBIES).concat(cube.FRONT_CORNER_CUBIES));
    let backSideCubies  = getCubiesByVID([].concat(cube.BACK_EDGE_CUBIES).concat(cube.BACK_CENTRAL_CUBIES).concat(cube.BACK_CORNER_CUBIES));
    let upSideCubies    = getCubiesByVID([].concat(cube.UP_EDGE_CUBIES).concat(cube.UP_CENTRAL_CUBIES).concat(cube.UP_CORNER_CUBIES));
    let downSideCubies  = getCubiesByVID([].concat(cube.DOWN_EDGE_CUBIES).concat(cube.DOWN_CENTRAL_CUBIES).concat(cube.DOWN_CORNER_CUBIES));

    for(let cubie of leftSideCubies){
        let face_id = FACE_ID_MAP.indexOf('l');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

    for(let cubie of rightSideCubies){
        let face_id = FACE_ID_MAP.indexOf('r');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

    for(let cubie of frontSideCubies){
        let face_id = FACE_ID_MAP.indexOf('f');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

    for(let cubie of backSideCubies){
        let face_id = FACE_ID_MAP.indexOf('b');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

    for(let cubie of upSideCubies){
        let face_id = FACE_ID_MAP.indexOf('u');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

    for(let cubie of downSideCubies){
        let face_id = FACE_ID_MAP.indexOf('d');
        colorFace(cubie,face_id,COLORS[face_id]);
    }

}