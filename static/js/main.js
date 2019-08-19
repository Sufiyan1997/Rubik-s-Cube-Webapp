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
    [17,{x:1,y:1,z:1}],
    [18,{x:1,y:1,z:-1}],
    [19,{x:1,y:-1,z:-1}],
    [20,{x:1,y:-1,z:1}],
    //center cubies (l,r,f,b,u,d)
    [21,{x:-1,y:0,z:0}],
    [22,{x:1,y:0,z:0}],
    [23,{x:0,y:0,z:1}],
    [24,{x:0,y:0,z:-1}],
    [25,{x:0,y:1,z:0}],
    [26,{x:0,y:-1,z:0}],
    ]
);

let shuffleSpeed = 2;
let solveSpeed = 2;
let oneRotationTime = 1700;
let filling = false;

const FACE_ID_MAP = ['r','l','u','d','f','b'];
const COLORS = [new THREE.Color(1,1,1),new THREE.Color(1,1,0),new THREE.Color(1,0,0),new THREE.Color(1,0.4,0),new THREE.Color(0,0,1),new THREE.Color(0,1,0)];

let cube = {
    LEFT_EDGE_CUBIES : [1,2,3,4],
    RIGHT_EDGE_CUBIES : [9,10,11,12],
    UP_EDGE_CUBIES : [5,9,6,1],
    DOWN_EDGE_CUBIES : [7,11,8,3],
    FRONT_EDGE_CUBIES : [6,12,7,2],
    BACK_EDGE_CUBIES : [5,4,8,10],

    LEFT_CORNER_CUBIES : [13,14,15,16],
    RIGHT_CORNER_CUBIES : [17,18,19,20],
    UP_CORNER_CUBIES : [13,18,17,14],
    DOWN_CORNER_CUBIES : [15,20,19,16],
    FRONT_CORNER_CUBIES : [14,17,20,15],
    BACK_CORNER_CUBIES : [18,13,16,19],

    LEFT_CENTRAL_CUBIES : [21],
    RIGHT_CENTRAL_CUBIES : [22],
    FRONT_CENTRAL_CUBIES : [23],
    BACK_CENTRAL_CUBIES : [24],
    UP_CENTRAL_CUBIES : [25],
    DOWN_CENTRAL_CUBIES : [26],

    RIGHT_MIDDLE_CUBIES : [9,25,1,21,3,26,11,22],
    FRONT_MIDDLE_CUBIES : [6,25,5,24,8,26,7,23],
    FRONT_MIDDLE_ROW_CUBIES : [2,23,12,22,10,24,4,21],

    verify : function(){
        let state = this.getState();
        let occurances = new Map(
            [
                ['r',0],
                ['g',0],
                ['b',0],
                ['w',0],
                ['y',0],
                ['o',0],
            ]
        );
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 9; j++){
                occurances.set(state[i][j],occurances.get(state[i][j])+1);
            }
        }
        for(let color of ['r','g','b','w','o','y']){
            if(occurances.get(color) != 9){
                return false;
            }
        }
        return true;
    },

    getCubieByVID : function (vid){
        for(let i = 0; i < 26; i++){
            if(this.cubies[i].vid == vid){
                return this.cubies[i];
            }
        }
    },
    
    getCubiesByVID : function (vids){
        let ans = [];
        for(let vid of vids){
            ans.push(this.getCubieByVID(vid));
        }
        return ans;
    },

    setCubiesVID : function(cubies,ids){
        for(let i = 0; i < ids.length; i++){
            cubies[i].vid = ids[i];
        }
    },

    rotateClockwise : function(ids,count){
        let cubies = this.getCubiesByVID(ids);
        let ids_clone = [...ids];//cloning
        ids_clone.push.apply(ids_clone,ids_clone.splice(0,count));
        this.setCubiesVID(cubies,ids_clone);
    },

    rotateAntiClockwise : function(ids,count){
        let cubies = this.getCubiesByVID(ids);
        let ids_clone = [...ids];//cloning
        ids_clone.unshift.apply(ids_clone,ids_clone.splice(ids_clone.length-count,count));
        this.setCubiesVID(cubies,ids_clone);
    },

    getState : function(){
        let state = [];
        let raycaster = new THREE.Raycaster();
        let origin = new THREE.Vector3();
        let direction = new THREE.Vector3();

        let leftOrderedVID = this.order(this.LEFT_EDGE_CUBIES,this.LEFT_CORNER_CUBIES,this.LEFT_CENTRAL_CUBIES);
        let leftOrderedCubies = this.getCubiesByVID(leftOrderedVID);
        let leftState = [];        
        for(let cubie of leftOrderedCubies){
            origin.set(-15,cubie.position.y,cubie.position.z);
            direction.set(1,0,0).normalize();
            raycaster.set(origin,direction);
            leftState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(leftState);

        let rightOrderedVID = this.order(this.RIGHT_EDGE_CUBIES,this.RIGHT_CORNER_CUBIES,this.RIGHT_CENTRAL_CUBIES);
        let rightOrderedCubies = this.getCubiesByVID(rightOrderedVID);
        let rightState = [];
        for(let cubie of rightOrderedCubies){
            origin.set(15,cubie.position.y,cubie.position.z);
            direction.set(-1,0,0).normalize();
            raycaster.set(origin,direction);
            rightState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(rightState);

        let frontOrderedVID = this.order(this.FRONT_EDGE_CUBIES,this.FRONT_CORNER_CUBIES,this.FRONT_CENTRAL_CUBIES);
        let frontOrderedCubies = this.getCubiesByVID(frontOrderedVID);
        let frontState = [];
        for(let cubie of frontOrderedCubies){
            origin.set(cubie.position.x,cubie.position.y,15);
            direction.set(0,0,-1).normalize();
            raycaster.set(origin,direction);
            frontState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(frontState);

        let backOrderedVID = this.order(this.BACK_EDGE_CUBIES,this.BACK_CORNER_CUBIES,this.BACK_CENTRAL_CUBIES);
        let backOrderedCubies = this.getCubiesByVID(backOrderedVID);
        let backState = [];
        for(let cubie of backOrderedCubies){
            origin.set(cubie.position.x,cubie.position.y,-15);
            direction.set(0,0,1).normalize();
            raycaster.set(origin,direction);
            backState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(backState);

        let upOrderedVID = this.order(this.UP_EDGE_CUBIES,this.UP_CORNER_CUBIES,this.UP_CENTRAL_CUBIES);
        let upOrderedCubies = this.getCubiesByVID(upOrderedVID);
        let upState = [];
        for(let cubie of upOrderedCubies){
            origin.set(cubie.position.x,15,cubie.position.z);
            direction.set(0,-1,0).normalize();
            raycaster.set(origin,direction);
            upState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(upState);

        let downOrderedVID = this.order(this.DOWN_EDGE_CUBIES,this.DOWN_CORNER_CUBIES,this.DOWN_CENTRAL_CUBIES);
        let downOrderedCubies = this.getCubiesByVID(downOrderedVID);
        let downState = [];
        for(let cubie of downOrderedCubies){
            origin.set(cubie.position.x,-15,cubie.position.z);
            direction.set(0,1,0).normalize();
            raycaster.set(origin,direction);
            downState.push(threeColor2Name(raycaster.intersectObject(cubie)[0].face.color));
        }
        state.push(downState);

        return state;

    },

    order : function(edge,corner,centre){
        let ans = [];
        ans.push(corner[0]);
        ans.push(edge[0]);
        ans.push(corner[1]);
        ans.push(edge[3]);
        ans.push(centre[0]);
        ans.push(edge[1]);
        ans.push(corner[3]);
        ans.push(edge[2]);
        ans.push(corner[2]);
        return ans;
    },

    makeWhite : function() {
        let leftSideCubies  = cube.getCubiesByVID([].concat(cube.LEFT_EDGE_CUBIES).concat(cube.LEFT_CORNER_CUBIES));
        let rightSideCubies = cube.getCubiesByVID([].concat(cube.RIGHT_EDGE_CUBIES).concat(cube.RIGHT_CORNER_CUBIES));
        let frontSideCubies = cube.getCubiesByVID([].concat(cube.FRONT_EDGE_CUBIES).concat(cube.FRONT_CORNER_CUBIES));
        let backSideCubies  = cube.getCubiesByVID([].concat(cube.BACK_EDGE_CUBIES).concat(cube.BACK_CORNER_CUBIES));
        let upSideCubies    = cube.getCubiesByVID([].concat(cube.UP_EDGE_CUBIES).concat(cube.UP_CORNER_CUBIES));
        let downSideCubies  = cube.getCubiesByVID([].concat(cube.DOWN_EDGE_CUBIES).concat(cube.DOWN_CORNER_CUBIES));
        
        for(let cubie of leftSideCubies){
            let face_id = FACE_ID_MAP.indexOf('l');
            colorFace(cubie,face_id,COLORS[0]);
        }
        
        for(let cubie of rightSideCubies){
            
            let face_id = FACE_ID_MAP.indexOf('r');
            colorFace(cubie,face_id,COLORS[0]);
        }
    
        for(let cubie of frontSideCubies){
            let face_id = FACE_ID_MAP.indexOf('f');
            colorFace(cubie,face_id,COLORS[0]);
        }
    
        for(let cubie of backSideCubies){
            let face_id = FACE_ID_MAP.indexOf('b');
            colorFace(cubie,face_id,COLORS[0]);
        }
    
        for(let cubie of upSideCubies){
            let face_id = FACE_ID_MAP.indexOf('u');
            colorFace(cubie,face_id,COLORS[0]);
        }

        for(let cubie of downSideCubies){
            let face_id = FACE_ID_MAP.indexOf('d');
            colorFace(cubie,face_id,COLORS[0]);
        }
    },

    r : function(){
        this.rotateClockwise(this.RIGHT_EDGE_CUBIES,1);
        this.rotateClockwise(this.RIGHT_CORNER_CUBIES,1);
    },

    r2 : function(){
        this.rotateClockwise(this.RIGHT_EDGE_CUBIES,2);
        this.rotateClockwise(this.RIGHT_CORNER_CUBIES,2);
    },

    r1 : function(){
        this.rotateAntiClockwise(this.RIGHT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.RIGHT_CORNER_CUBIES,1);
    },

    l : function(){
        this.rotateClockwise(this.LEFT_EDGE_CUBIES,1);
        this.rotateClockwise(this.LEFT_CORNER_CUBIES,1);
    },

    l2 : function(){
        this.rotateClockwise(this.LEFT_EDGE_CUBIES,2);
        this.rotateClockwise(this.LEFT_CORNER_CUBIES,2);
    },

    l1 : function(){
        this.rotateAntiClockwise(this.LEFT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.LEFT_CORNER_CUBIES,1);
    },

    f : function(){
        this.rotateClockwise(this.FRONT_EDGE_CUBIES,1);
        this.rotateClockwise(this.FRONT_CORNER_CUBIES,1);
    },

    f2 : function(){
        this.rotateClockwise(this.FRONT_EDGE_CUBIES,2);
        this.rotateClockwise(this.FRONT_CORNER_CUBIES,2);
    },

    f1 : function(){
        this.rotateAntiClockwise(this.FRONT_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.FRONT_CORNER_CUBIES,1);
    },

    b : function(){
        this.rotateClockwise(this.BACK_EDGE_CUBIES,1);
        this.rotateClockwise(this.BACK_CORNER_CUBIES,1);
    },

    b2 : function(){
        this.rotateClockwise(this.BACK_EDGE_CUBIES,2);
        this.rotateClockwise(this.BACK_CORNER_CUBIES,2);
    },

    b1 : function(){
        this.rotateAntiClockwise(this.BACK_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.BACK_CORNER_CUBIES,1);
    },

    u : function(){
        this.rotateClockwise(this.UP_EDGE_CUBIES,1);
        this.rotateClockwise(this.UP_CORNER_CUBIES,1);
    },

    u2 : function(){
        this.rotateClockwise(this.UP_EDGE_CUBIES,2);
        this.rotateClockwise(this.UP_CORNER_CUBIES,2);
    },

    u1 : function(){
        this.rotateAntiClockwise(this.UP_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.UP_CORNER_CUBIES,1);
    },

    d : function(){
        this.rotateClockwise(this.DOWN_EDGE_CUBIES,1);
        this.rotateClockwise(this.DOWN_CORNER_CUBIES,1);
    },

    d2 : function(){
        this.rotateClockwise(this.DOWN_EDGE_CUBIES,2);
        this.rotateClockwise(this.DOWN_CORNER_CUBIES,2);
    },

    d1 : function(){
        this.rotateAntiClockwise(this.DOWN_EDGE_CUBIES,1);
        this.rotateAntiClockwise(this.DOWN_CORNER_CUBIES,1);
    },

    mr : function(){
        this.rotateClockwise(this.RIGHT_MIDDLE_CUBIES,2);
    },

    mr2 : function(){
        this.rotateClockwise(this.RIGHT_MIDDLE_CUBIES,4);
    },

    mr1 : function(){
        this.rotateAntiClockwise(this.RIGHT_MIDDLE_CUBIES,2);
    },

    mf : function(){
        this.rotateClockwise(this.FRONT_MIDDLE_CUBIES,2);
    },

    mf2 : function(){
        this.rotateClockwise(this.FRONT_MIDDLE_CUBIES,4);
    },

    mf1 : function(){
        this.rotateAntiClockwise(this.FRONT_MIDDLE_CUBIES,2);
    },

    mc : function(){
        this.rotateClockwise(this.FRONT_MIDDLE_ROW_CUBIES,2);
    },

    mc2 : function(){
        this.rotateClockwise(this.FRONT_MIDDLE_ROW_CUBIES,4);
    },

    mc1 : function(){
        this.rotateAntiClockwise(this.FRONT_MIDDLE_ROW_CUBIES,2);
    },
};

let cubeAnimator = {
    r : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_CORNER_CUBIES).concat(cube.RIGHT_EDGE_CUBIES).concat(cube.RIGHT_CENTRAL_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(-1,0,0),Math.PI/2,0);
    },
    
    r2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_CENTRAL_CUBIES).concat(cube.RIGHT_CORNER_CUBIES).concat(cube.RIGHT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(-1,0,0),Math.PI,0);
    },

    r1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_CENTRAL_CUBIES).concat(cube.RIGHT_CORNER_CUBIES).concat(cube.RIGHT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(1,0,0),90*Math.PI/180,0);
    },

    l : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.LEFT_CENTRAL_CUBIES).concat(cube.LEFT_CORNER_CUBIES).concat(cube.LEFT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(1,0,0),90*Math.PI/180,0);
    },

    l2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.LEFT_CENTRAL_CUBIES).concat(cube.LEFT_CORNER_CUBIES).concat(cube.LEFT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(1,0,0),Math.PI,0);
    },

    l1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.LEFT_CENTRAL_CUBIES).concat(cube.LEFT_CORNER_CUBIES).concat(cube.LEFT_EDGE_CUBIES));        
        this.rotate(cubiesToRotate,new THREE.Vector3(-1,0,0),90*Math.PI/180,0);
    },

    f : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_CENTRAL_CUBIES).concat(cube.FRONT_CORNER_CUBIES).concat(cube.FRONT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,-1),Math.PI/2,0);
    },

    f2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_CENTRAL_CUBIES).concat(cube.FRONT_CORNER_CUBIES).concat(cube.FRONT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,-1),Math.PI,0);
    },

    f1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_CENTRAL_CUBIES).concat(cube.FRONT_CORNER_CUBIES).concat(cube.FRONT_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,1),90*Math.PI/180,0);
    },

    b : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.BACK_CENTRAL_CUBIES).concat(cube.BACK_CORNER_CUBIES).concat(cube.BACK_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,1),90*Math.PI/180,0);
    },

    b2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.BACK_CENTRAL_CUBIES).concat(cube.BACK_CORNER_CUBIES).concat(cube.BACK_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,1),Math.PI,0);
    },

    b1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.BACK_CENTRAL_CUBIES).concat(cube.BACK_CORNER_CUBIES).concat(cube.BACK_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,-1),90*Math.PI/180,0);
    },

    u : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.UP_CENTRAL_CUBIES).concat(cube.UP_CORNER_CUBIES).concat(cube.UP_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,-1,0),90*Math.PI/180,0);
    },

    u2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.UP_CENTRAL_CUBIES).concat(cube.UP_CORNER_CUBIES).concat(cube.UP_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,-1,0),Math.PI,0);
    },

    u1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.UP_CENTRAL_CUBIES).concat(cube.UP_CORNER_CUBIES).concat(cube.UP_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,1,0),90*Math.PI/180,0);
    },

    d : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.DOWN_CENTRAL_CUBIES).concat(cube.DOWN_CORNER_CUBIES).concat(cube.DOWN_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,1,0),90*Math.PI/180,0);
    },

    d2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.DOWN_CENTRAL_CUBIES).concat(cube.DOWN_CORNER_CUBIES).concat(cube.DOWN_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,1,0),Math.PI,0);
    },

    d1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.DOWN_CENTRAL_CUBIES).concat(cube.DOWN_CORNER_CUBIES).concat(cube.DOWN_EDGE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,-1,0),90*Math.PI/180,0);
        
    },

    mr : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,1),90*Math.PI/180,0);
    },

    mr2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,1),Math.PI,0);
    },

    mr1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.RIGHT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,0,-1),90*Math.PI/180,0);
    },

    mf : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(-1,0,0),90*Math.PI/180,0);
    },

    mf2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(-1,0,0),Math.PI,0);
    },

    mf1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(1,0,0),90*Math.PI/180,0);
    },

    mc : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_ROW_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,1,0),90*Math.PI/180,0);
    },

    mc2 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_ROW_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,1,0),Math.PI,0);
    },

    mc1 : function(){
        let cubiesToRotate = cube.getCubiesByVID([].concat(cube.FRONT_MIDDLE_ROW_CUBIES));
        this.rotate(cubiesToRotate,new THREE.Vector3(0,-1,0),90*Math.PI/180,0);
    },

    executeSequence : function (moves){
        let i = 0;
        let stepsEle = document.querySelector('#steps');
        for(; i < moves.length; i++){
            
            setTimeout(function(i){
                stepsEle.children[i].classList.add('moveActive');
                if(i != 0){
                    cube[moves[i-1]].call(cube);
                }
                cubeAnimator[moves[i]].call(cubeAnimator);
            },oneRotationTime*i,i);
        }
        setTimeout(function(){
            fixPosition();
            cube[moves[i-1]].call(cube);
        },oneRotationTime*i);
    },

    sineInverse : function(x,y) {
        let r = Math.sqrt(x**2+y**2);
        let angle = Math.asin(Math.abs(y)/r);
        if(x > 0 && y >= 0){
            return angle;
        }
        else if(x <= 0 && y > 0){
            return Math.PI - angle;
        }
        else if(x < 0 && y <= 0){
            return Math.PI + angle;
        }
        else if(x >= 0 && y < 0){
            return 2*Math.PI - angle;
        }
    },
    sine : function(angle,r){
        if(angle > 2*Math.PI){
            angle -= 2*Math.PI;
        }
        if(angle < 0){
            angle += 2*Math.PI;
        }
        if(angle >=0 && angle<Math.PI/2){
            return {
                x:Math.cos(angle)*r,
                y:Math.sin(angle)*r
            };
        }
        else if(angle >=Math.PI/2 && angle<Math.PI){
            return {
                x:(-1)*Math.cos(Math.PI - angle)*r,
                y:Math.sin(Math.PI - angle)*r
            };
        }
        else if(angle >= Math.PI && angle<3*Math.PI/2){
            return {
                x:(-1)*Math.cos(angle - Math.PI)*r,
                y:(-1)*Math.sin(angle - Math.PI)*r
            };
        }
        else if(angle >= 3*Math.PI/2 && angle < 2*Math.PI){
            return {
                x:Math.cos(2*Math.PI - angle)*r,
                y:(-1)*Math.sin(2*Math.PI - angle)*r
            };
        }
    },

    move : function(mesh,axis,rotation){
        mesh.rotateOnWorldAxis(axis,rotation);
        if(axis.x == 1 || axis.x == -1){
            let x = -1*mesh.position.z;
            let y = mesh.position.y;
            let radius = Math.sqrt(x**2 + y**2);
            if(radius != 0){
                let angle = +(this.sineInverse(x,y).toFixed(5));
                let newAngle = angle + axis.x*rotation;
                newAngle = +(newAngle.toFixed(5));
                let newPos = this.sine(newAngle,radius);
                mesh.position.z = (-1)*newPos.x;
                mesh.position.y = newPos.y;
            }
        }
        else if(axis.y == 1 || axis.y == -1){
            let x = mesh.position.x;
            let y = (-1)*mesh.position.z;
            let radius = Math.sqrt(x**2 + y**2);
            if(radius != 0){
                let angle = +(this.sineInverse(x,y).toFixed(5));
                let newAngle = angle + axis.y*rotation;
                newAngle = +newAngle.toFixed(5);
                let newPos = this.sine(newAngle,radius);
                mesh.position.x = newPos.x;
                mesh.position.z = (-1)*newPos.y;
            }
        }
        else if(axis.z == 1 || axis.z == -1){
            let x = mesh.position.x;
            let y = mesh.position.y;
            let radius = Math.sqrt(x**2 + y**2);
            if(radius != 0){
                let angle = +(this.sineInverse(x,y).toFixed(5));
                let newAngle = angle + axis.z*rotation;
                newAngle = +newAngle.toFixed(5);
                let newPos = this.sine(newAngle,radius);
                mesh.position.x = newPos.x;
                mesh.position.y = newPos.y;
            }
        }
        
    },

    rotate : function(cubies,axis,angle,total){
        if(total < angle){
            total+=2*Math.PI/180;
            for (let cube of cubies) {
                this.move(cube,axis,2*Math.PI/180);   
            }            
            renderer.render(scene,camera);
            requestAnimationFrame(function(){
                cubeAnimator.rotate(cubies,axis,angle,total);
            });
        }
        else{
            fixPosition();
        }
        
    }
};

const MOVES = [
[cube.r,cubeAnimator.r],
[cube.l,cubeAnimator.l],
[cube.u,cubeAnimator.u],
[cube.d,cubeAnimator.d],
[cube.f,cubeAnimator.f],
[cube.b,cubeAnimator.b],
[cube.r2,cubeAnimator.r2],
[cube.l2,cubeAnimator.l2],
[cube.u2,cubeAnimator.u2],
[cube.d2,cubeAnimator.d2],
[cube.f2,cubeAnimator.f2],
[cube.b2,cubeAnimator.b2],
[cube.r1,cubeAnimator.r1],
[cube.l1,cubeAnimator.l1],
[cube.u1,cubeAnimator.u1],
[cube.d1,cubeAnimator.d1],
[cube.f1,cubeAnimator.f1],
[cube.b1,cubeAnimator.b1],
            ];


let currentColor = 1;
let displayColor = document.querySelector('#displayColor');
displayColor.style.backgroundColor = "rgb(" + Math.floor(COLORS[currentColor].r*255) + ", " + Math.floor(COLORS[currentColor].g*255) + ", " + Math.floor(COLORS[currentColor].b*255) + ")";

let fillingSwitch = document.querySelector('#filling');
fillingSwitch.checked = false;
let resetColorBtn = document.querySelector('#resetColor');
let shuffleBtn = document.querySelector('#shuffle');
let colorBtn = document.querySelector('#pickColor');
let verifyBtn = document.querySelector('#verify');
let solveBtn = document.querySelector('#solve');
fillingSwitch.addEventListener('change',function(e){
    console.log("unchecked");
    if(fillingSwitch.checked){
        fillingStart();
    }
    else{
        fillingStop();
    }
});
resetColorBtn.addEventListener('click',function(){
    for(let cubie of cube.cubies){
        scene.remove(cubie);
    }
    fillingSwitch.checked = false;
    fillingStop();
    makeCube();
    resetColor();
});
shuffleBtn.addEventListener('click',function () {
    shuffle();
});
colorBtn.addEventListener('click',function(e){
    currentColor = +e.target.value;
    displayColor.style.backgroundColor = "rgb(" + Math.floor(COLORS[currentColor].r*255) + ", " + Math.floor(COLORS[currentColor].g*255) + ", " + Math.floor(COLORS[currentColor].b*255) + ")";
});
verifyBtn.addEventListener('click',function(){
    let valid = cube.verify();    
    let msgEle = document.createElement('h2');
    msgEle.innerText = valid?"Valid":"Invalid";
    msgEle.style.color = valid?"#00FF00":"#FF0000";
    document.querySelector('#verify').after(msgEle);
    setTimeout(()=>{msgEle.remove()},2000);

});
solveBtn.addEventListener('click',function(){
    if(cube.verify()){
        let state = cube.getState();
        $.ajax(
            {
                method:"POST",
                url : '/solver',
                contentType:"application/json",
                data:JSON.stringify(state),
                success:function(data,status){
                    if (status == "success") {
                        if(data.status == 1){
                            let msgEle = document.querySelector('#msg');
                            msgEle.textContent = "Message : Cube Solved !!";
                            let nstepEle = document.querySelector('#nstep');
                            nstepEle.textContent = "No. of steps : "+data.length;
                            let timeEle = document.querySelector("#time");
                            timeEle.textContent = "Time taken to solve : "+data.time/1000000+" Seconds";
                            let infoBlock = document.querySelector('#infoBlock');
                            infoBlock.hidden = false;
                            let stepsELe = document.querySelector('#steps');
                            stepsELe.innerHTML = "";
                            for(let i = 0; i < data.length; i++){
                                let move = document.createElement('span');
                                move.classList.add('move');
                                move.textContent = data.ans[i].toUpperCase();
                                stepsELe.append(move);
                            }
                            cubeAnimator.executeSequence(data.ans);
                        }
                        else{
                            let msgEle = document.querySelector('#msg');
                            msgEle.textContent = "Message : Cube is in invalid state.";
                            let infoBlock = document.querySelector('#infoBlock');
                            infoBlock.hidden = false;
                        }
                    }
                    else{
                        let msgEle = document.querySelector('#msg');
                        msgEle.textContent = msgEle.textContent.concat("Something went wrong with the server !!");
                    }
                }
            }
        );
    }
    else{
        let msgEle = document.querySelector('#msg');
        msgEle.textContent = "Message : Cube is in invalid state.";
    }
    
});

let canvas = document.getElementById('c');
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({canvas});
let camera = new THREE.PerspectiveCamera(75,canvas.clientWidth/canvas.clientHeight,0.1,50);

camera.position.set(4,3,4);
camera.lookAt(0,0,0);
scene.background = 0x000000;

canvas.addEventListener('resize',handleResizing);


const controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(0,0,0);
controls.update();

handleResizing();
makeCube();
resetColor();


renderer.render(scene,camera);
requestAnimationFrame(render);

//shuffle();

function render(time) {
    requestAnimationFrame(render);
    if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene,camera);
}


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

    cube.dynamic = true;
    scene.add(cube);
    cube.vid= vid;
    return cube;
}

function colorFace(cube,face,color){
    cube.geometry.faces[face*2].color.setRGB(color.r,color.g,color.b);
    cube.geometry.faces[face*2+1].color.setRGB(color.r,color.g,color.b);
    cube.geometry.colorsNeedUpdate = true;
}

function clickHandler(e){
    let rayCaster = new THREE.Raycaster();
    let mouse_position = new THREE.Vector2();
    
    let rect = renderer.domElement.getBoundingClientRect();
    mouse_position.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
    mouse_position.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    rayCaster.setFromCamera(mouse_position.clone(),camera);
    let intersections = rayCaster.intersectObjects(cube.cubies);
    
    if(intersections[0]){
        if(intersections[0].object.vid < 21){
            colorFace(intersections[0].object,Math.floor(intersections[0].faceIndex/2),COLORS[currentColor]);
        }
    }
}

function handleResizing(){
    if (resizeRendererToDisplaySize()) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}

function resetColor(){
    let leftSideCubies  = cube.getCubiesByVID([].concat(cube.LEFT_EDGE_CUBIES).concat(cube.LEFT_CENTRAL_CUBIES).concat(cube.LEFT_CORNER_CUBIES));
    let rightSideCubies = cube.getCubiesByVID([].concat(cube.RIGHT_EDGE_CUBIES).concat(cube.RIGHT_CENTRAL_CUBIES).concat(cube.RIGHT_CORNER_CUBIES));
    let frontSideCubies = cube.getCubiesByVID([].concat(cube.FRONT_EDGE_CUBIES).concat(cube.FRONT_CENTRAL_CUBIES).concat(cube.FRONT_CORNER_CUBIES));
    let backSideCubies  = cube.getCubiesByVID([].concat(cube.BACK_EDGE_CUBIES).concat(cube.BACK_CENTRAL_CUBIES).concat(cube.BACK_CORNER_CUBIES));
    let upSideCubies    = cube.getCubiesByVID([].concat(cube.UP_EDGE_CUBIES).concat(cube.UP_CENTRAL_CUBIES).concat(cube.UP_CORNER_CUBIES));
    let downSideCubies  = cube.getCubiesByVID([].concat(cube.DOWN_EDGE_CUBIES).concat(cube.DOWN_CENTRAL_CUBIES).concat(cube.DOWN_CORNER_CUBIES));

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
function shuffle(){
    let lastMove = null;
    let i = 0;
    for(; i < 5; i++){
        setTimeout(function(){
            if(lastMove != null){
                lastMove.call(cube);
            }
            lastMove = randomMove();
        },oneRotationTime*i);
    }
    setTimeout(function(){
        fixPosition();
        lastMove.call(cube);
    },oneRotationTime*i);
}
function randomMove(){
    let side = Math.floor(Math.random()*6);
    let turns = Math.floor(Math.random()*3);
    MOVES[6*turns+side][1].call(cubeAnimator);
    return MOVES[6*turns+side][0];
}
function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
function threeColor2Name(color) {
    if(color.r == 1 && color.g == 0 && color.b == 0){
    return 'r';
    }
    else if(color.r == 0 && color.g == 1 && color.b == 0){
    return 'g';
    }
    else if(color.r == 0 && color.g == 0 && color.b == 1){
    return 'b';
    }
    else if(color.r == 1 && color.g == 1 && color.b == 1){
    return 'w';
    }
    else if(color.r == 1 && color.g == 1 && color.b == 0){
    return 'y';
    }
    else if(color.r == 1 && color.g == 0.4 && color.b == 0){
        return 'o';
    }
}
function fixPosition() {
    for(let cubie of cube.cubies){
        cubie.position.x = Math.round(cubie.position.x)*1.05;
        cubie.position.y = Math.round(cubie.position.y)*1.05;
        cubie.position.z = Math.round(cubie.position.z)*1.05;

        let xR = Math.round(Math.round(cubie.rotation.x*180/Math.PI)/90)*90;
        let yR = Math.round(Math.round(cubie.rotation.y*180/Math.PI)/90)*90;
        let zR = Math.round(Math.round(cubie.rotation.z*180/Math.PI)/90)*90;

        cubie.rotation.x = xR*Math.PI/180;
        cubie.rotation.y = yR*Math.PI/180;
        cubie.rotation.z = zR*Math.PI/180;
    }
}
function fillingStart(){
    canvas.addEventListener('click',clickHandler);
    shuffleBtn.classList.add('disabled');
    solveBtn.classList.add('disabled');
    filling = true;
    for(let cubie of cube.cubies){
        scene.remove(cubie);
    }
    makeCube();
    resetColor();
    cube.makeWhite();
}
function fillingStop(){
    shuffleBtn.classList.remove('disabled');
    solveBtn.classList.remove('disabled');
    canvas.removeEventListener('click',clickHandler);
    filling = false;
}