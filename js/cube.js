let cube = {
    cubies : [],
    
    function r1() {
        
    }
    function r2(){

    }
};
function makeCube(colors,location){
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial({vertexColors : THREE.FaceColors,side:THREE.DoubleSide});
    let cube = new THREE.Mesh(geometry,material);
    
    cube.position.x = location.x;
    cube.position.y = location.y;
    cube.position.z = location.z;

    for(let i = 0; i < 6; i++){
        colorFace(cube,i,colors[i]);
    }

    return cube;
}
function colorFace(cube,face,color){
    cube.faces[face*2].color = color;
    cube.faces[face*2+1].color = color;
}