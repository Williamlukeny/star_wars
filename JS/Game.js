

// ======================================================================================================= //

                                       /** VARIÁVEIS GLOBAIS */

// ======================================================================================================= //



var scene, material, geometry, mesh, ball, tronco, plano, nave, renderer,cube,cube0,cube1,cube2;
var luzesLigadas = false

var camera1, camera2, camera3, camera4, camera5, armaCentral, armaEsquerda, armaDireita, selecionado = "c";
var movel = false, onAir = false, follow = false
var paused = false, end = false

var c = createCamera(1);


var paredeEsquerda = new THREE.Object3D();
var paredeDireita = new THREE.Object3D();


// ======================================================================================================= //

                                       /** LÓGICA DO JOGO */

// ======================================================================================================= //


   // Criar o cubo
   var cubeGeometry = new THREE.BoxGeometry(19, 40, 40);
   var cubeMaterial = new THREE.MeshBasicMaterial({color:"#00BFFF", wireframe: false});
   cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

   // Criar o cubo
   var cubeGeometry0 = new THREE.BoxGeometry(19, 40, 40);
   var cubeMaterial0 = new THREE.MeshBasicMaterial({color:"#00BFFF", wireframe: false});
   cube0 = new THREE.Mesh(cubeGeometry0, cubeMaterial0);


  function createCamera(i){
      'use strict' 
      if(i == 1){
         camera1 =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
         camera1.position.set( 15, 110 , 380);
         camera1.lookAt( 0, 0, 0 );
         follow = false
         movel = false
         return camera1;
      }
      if(i == 2){
         camera2 =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
         camera2.position.set( 300, 100 , 50);
         camera2.lookAt( 0, 0, 0 );
         follow = false
         movel = false
         return camera2;
      }
      if(i == 3){
         camera3 =  new THREE.OrthographicCamera( 
            window.innerWidth / -2,
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / -2, 1, 1000);
         camera3.position.set(0, 500 , 50);
         camera3.lookAt( 0, 0, 0 );
         follow = false
         movel = false
         return camera3;
      }
      if(i == 4){
         // Camera Movel
         camera4 =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1200);
         camera4.position.set( 0, 270 , -600);
         camera4.lookAt( 0, 0, 0 );
         follow = false
         movel = true
         return camera4;
      }
      if(i == 5){
         // Segue a bala
         camera5 =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
         camera5.position.set(goodGuy.position.x, goodGuy.position.y, goodGuy.position.z + 100);
         movel = false
         follow = true
         return camera5;
      }
   }
 
 function createScene()
 {
    'use strict' 
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(20));

   Cenario();
   paredeEsquerda.add(cube0);
   paredeDireita.add(cube);

   // Plano
    material = new THREE.MeshPhongMaterial();
    const bumpTexture = new THREE.TextureLoader().load("../IMG/monalisa.jpg")
    material.bumpMap = bumpTexture
    material.bumpScale = 4

    geometry = new THREE.BoxGeometry(1200, 1, 730);
    var espaco = new THREE.Mesh(geometry, material);
    espaco.receiveShadow = true;

   //  Ajustar o plano de forma a atingir a posicao e rotacao correcta
    espaco.position.set(0, -70, -30);
    espaco.rotation.y = 0.00;
    scene.add(espaco);
    scene.add(paredeDireita);
    scene.add(paredeEsquerda);
  

   var artista = protagonista.NaveHeroi();
  
   // Posicionar os gajos
   artista.position.z = 230;
   artista.position.y = -10;

   // ======================================== //

   // Luzes
   if(directionalLight != null)
   scene.add( directionalLight );

   scene.add( holofote1 );
   scene.add(avlo1)

   scene.add(holofote2)
   scene.add(avlo2)

   scene.add(holofote3)
   scene.add(avlo3)

   scene.add(holofote4)
   scene.add(avlo4)


   // =======================================//

//Mudando a posicoes
for (let index = 0,valor = -245; index <= 7; index++) {

   var bandido = vilao.NaveVilao();
   bandido.castShadow = true; //default is false
   bandido.receiveShadow = false; //default
   badGuy [index]=bandido;
  
   //Frente
   if (index%2==0) {
      badGuy[index].position.z=valor+30;
      if ((index-2)>=0) {
         badGuy[index].position.x=badGuy[index-2].position.x+80;
      }
   } 
   //Tras
   else {
      badGuy[index].position.z=valor-30;
      if ((index-2)>=0) {
         badGuy[index].position.x=badGuy[index-2].position.x-80;
      }
   } 
   
  

  }

   goodGuy = artista;
   nave = goodGuy
   goodGuy.castShadow = true; //default is false
   goodGuy.receiveShadow = false; //default
 }

//  Variaveis globais (dentro deste escopo) representado os personagens 
var badGuy= [];   // Vilao
var goodGuy;     //protagonista

//  Velocidade da bala
var vBala = 50

// Decrementar a velocidade da bala a cada segundo
function BulletSpeedControl(){
   setInterval(() => {
      if(vBala > 0)
         vBala -= 5
      if(vBala < 20)
         vBala = 50
    }, 1000);
}
 

// Controla o comportamento da bala a cada frame. Simula o disparo
function bulletControl(){

   if(bala != null){
      bala.position.z -= vBala
      if(bala.position.z < -400){
         scene.remove(bala)
         onAir = false
      }else{
         onAir = true
      }
   }
}

// Determina a arma selecionada
function gunControl() { 
   if(selecionado == "c")
      posicao = {x: goodGuy.position.x, y: goodGuy.position.y + 10, z: goodGuy.position.z}
   if(selecionado == "e")
      posicao = {x: goodGuy.position.x - 30, y: goodGuy.position.y, z: goodGuy.position.z + 40};
   if(selecionado == "d")
      posicao = {x: goodGuy.position.x + 30, y: goodGuy.position.y, z: goodGuy.position.z + 40};
}

//Reset da posição dos Inimigos
function reset(){

   //Mudando a posicoes
   for (let index = 0,valor = -245; index <= 7; index++) {
     //Frente
     if (index%2==0) {
        badGuy[index].position.z=valor+30;
        if ((index-2)>=0) {
           badGuy[index].position.x=badGuy[index-2].position.x+80;
        }
     } 
     //Tras
     else {
        badGuy[index].position.z=valor-30;
        if ((index-2)>=0) {
           badGuy[index].position.x=badGuy[index-2].position.x-80;
        }
     }  
  }
}

// Define o lado actual do movimento do vilao
var ladoInimigo = "d"
var _ladoInimigo = "d"
// Define o lado actual do movimento do Hero
var lado = "d"
// Define o comportamento do movimento do vilao
function badGuyComportamento(){
   
   //Resetar a posição dos Inimigos
   reset();

   let move = 1
   
   
   for (let index = 0; index <= 7; index++) {

      move=4;
      // badGuy[index].rotation.y += 0.1


       if(index%2==0){

         if(ladoInimigo == "d"){
            badGuy[index].position.x +=  move
          }  
         if(badGuy[index].position.x >= 520){
            ladoInimigo = "e"
         }
         if(ladoInimigo == "e"){
            badGuy[index].position.x -= move;
         }
         if(badGuy[index].position.x <= -520){
            ladoInimigo = "d"
         }
       }else{
            if(_ladoInimigo == "d"){
               badGuy[index].position.x -= move;
             }
            if(_ladoInimigo == "e"){
               badGuy[index].position.x += move;
            }
            if(badGuy[index].position.x <= -520){
               _ladoInimigo = "e"
            }
            if(badGuy[index].position.x >= 520){
               _ladoInimigo = "d"
            }
       }
  }

  //Resetar a posição dos Inimigos
  reset();
}

// Velocidade da camera
var passo = 0 

// O nome ja indica ne? kkkkk
function CameraMovel(){
   if(movel)
   {
      passo += 0.01
      c.position.x = 360* Math.sin(passo);
      c.position.z = 360* Math.cos(passo);
      c.lookAt(0, 0, 0)
   }
}

//Camera que Segue a bala
function CameraFollow(){
   if(follow && bala != null){
      c.position.set( bala.position.x, bala.position.y , bala.position.z + 50);
      c.lookAt( bala.position.x, bala.position.y , bala.position.z);
   }
}

function animate() {
   'use strict'; 

   downHero()
   BalasInimigas()
   bulletControl()
   gunControl()
   badGuyComportamento()
   CameraMovel()
   CameraFollow()
   
   render();
   if(!paused)
      requestAnimationFrame(animate);
   downEnemy();
}


function LimparCena(){
   for( var i = scene.children.length - 1; i >= 0; i--) { 
      obj = scene.children[i];
      scene.remove(obj);
   }
}

var dead = 0

function downEnemy(){
   for (let index = 0; index < badGuy.length; index++) {

      // Criando novas BoundingBox nos dois objectos
      let balaBounding = new THREE.Box3().setFromObject(bala);
      let badGuyBounding = new THREE.Box3().setFromObject(badGuy[index]);
   
        if(balaBounding.isIntersectionBox(badGuyBounding)){
          scene.remove(bala)
          scene.remove(badGuy[index])
          dead += 1

          if(dead == badGuy.length ){
            LimparCena()
            dead = 0
            document.getElementById("opcoes").style.display = "flex"
            end = true
          }
          
        }
   
   }
}


function downHero(){
   var hits = 0
   for (let index = 0; index < balaInimiga.length; index++) {

      // Criando novas BoundingBox nos dois objectos
      let balaBounding = new THREE.Box3().setFromObject(balaInimiga[index]);
      let heroBounding = new THREE.Box3().setFromObject(nave);
   
        if(heroBounding.isIntersectionBox(balaBounding)){
          scene.remove(balaInimiga[index])
          hits += 1
          vida -= 1
          document.getElementById("vida").value -= hits

          if(document.getElementById("vida").value == 0 ){
            document.getElementById("opcoes").style.display = "flex"
            end = true
            LimparCena()
          }
          
        }
   
   }
}

function render(){
   'use strict'
   renderer.render(scene, c);
}

function init(){
   'use strict'   
   renderer = new THREE.WebGLRenderer({antialias: true});
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   document.body.appendChild(renderer.domElement);

   createScene();
   
   render();

   // window.addEventListener("resize",onResize);
   window.addEventListener("keydown", onKeyDown);

}

// A bala
var bala

// A posicao inicial da bala
var posicao;

// Cria uma nova bala a cada vez que o user prime a tecla de disparo
function Dispara(){
   if(!onAir){
      material = new THREE.MeshBasicMaterial({color: "black", wireframe:false});
      geometry = new THREE.SphereGeometry(5,5,5);
      bala = new THREE.Mesh(geometry,material);
      bala.position.set(posicao.x, posicao.y, posicao.z)  
      scene.add(bala)
   }
}

// Movimento do Heroi (Do Jeito que o prof quêr)
function PlayerControl(){
   let move = 0
   let destino = 100
   setInterval(() => {
      move++
      if(calculandoAsColisoes('direita')){
         lado == "e"
         nave.position.set(nave.position.x - 2, nave.position.y, nave.position.z)
      }else if(calculandoAsColisoes('esquerda')){
         lado == "d"
         nave.position.set(nave.position.x + 2, nave.position.y, nave.position.z)
      }else{
      if(move < destino){
         if(lado == "e"){
            nave.position.set(nave.position.x - 1, nave.position.y, nave.position.z)
         }
         if(lado == "d"){
            nave.position.set(nave.position.x + 1, nave.position.y, nave.position.z)
         }
      }else{
         nave.rotation.set(0, 0, 0)
      }
   }
   }, 10);
   move = 0
}

function onKeyDown(e){
   'use strict'; 
   switch(e.keyCode){

      case 37: //Move o protagonista para a esquerda
         lado = "e"
         PlayerControl()
         break;
      case 39: //Move o protagonista para a direita
         lado = "d"
         PlayerControl()
         break;
      case 49: // Seleciona a camera frontal
         c = createCamera(1);
         break;
      case 50: // Seleciona a camera Lateral
         c = createCamera(2);
         break;
      case 51: // Seleciona a camera do topo
         c = createCamera(3);
         break;
      case 52: // Seleciona a camera movel
         c = createCamera(4);
         break;
      case 53: // Seleciona a camera movel
         c = createCamera(5);
         break;
      case 32: //  dispara
         Dispara();
         break;
      case 81: // Seleciona arma a esquerda
         selecionado = "e"
         TrocaArma()
         break;
      case 87: // Seleciona arma do centro
         selecionado = "c"
         TrocaArma()
         break;
      case 69: // Seleciona arma a direita
         selecionado = "d"
         TrocaArma()
         break;
      case 76: // Liga e desliga as luzes
         ligaLuzes()
         break;
      case 55: // Liga e desliga as luzes
         LigaDesliga(holofote1)
         break;
      case 56: // Liga e desliga as luzes
         LigaDesliga(holofote2)
         break;
      case 57: // Liga e desliga as luzes
         LigaDesliga(holofote3)
         break;
      case 48: // Liga e desliga as luzes
         LigaDesliga(holofote4)
         break;
      case 83: // Pausa o jogo
         paused = !paused
         MenuPausa()
         animate()
         break;
      case 82: // Reinicia o jogo
        LimparCena()
        recarregar()
         break;
   }

}

function TrocaArma(){
      nave.remove(armaCentral)
      gunCenter(nave)

      nave.remove(armaEsquerda)
      gunLeft(nave)
      
      nave.remove(armaDireita)
      gunRight(nave)
}

function DisparoInimigo(){
   if(!end)
      for (let index = 0; index < badGuy.length; index++) {
      material = new THREE.MeshBasicMaterial({color: "red", wireframe:false});
      geometry = new THREE.SphereGeometry(5,5,5);
      balaInimiga[index] = new THREE.Mesh(geometry,material);
      balaInimiga[index].position.set(badGuy[index].position.x, badGuy[index].position.y, badGuy[index].position.z + 20)  
      scene.add(balaInimiga[index])
      }
   
}
var balaInimiga = []

function BalasInimigas(){
   for (let index = 0; index < badGuy.length; index++) {
      if(balaInimiga[index] != null){
         balaInimiga[index].position.z += 25
         if(balaInimiga[index].position.z > 400){
            scene.remove(balaInimiga[index])
         }
      }
   }
}

function shoot(){
   setInterval(() => {
      DisparoInimigo()
   }, 5000);
}

shoot()



// ======================================================================================================= //

                                       /** Os PERSONAGENS */

// ======================================================================================================= //


class Personagem{
   constructor(){}

   NaveHeroi(){
       
     const ship = new THREE.Object3D();
  
        bico(ship);
        back(ship)
        gunLeft(ship)
        gunCenter(ship);
        gunRight(ship)
 
         ship.position.z = 100
        scene.add(ship);
        return ship
     
 }

  NaveVilao(){
        
   const bandido = new THREE.Object3D();

     esfera(bandido);
     gun(bandido);

     bandido.position.z = 0
     bandido.rotation.y = 3.2
     scene.add(bandido);
     return bandido
}

}

var vilao = new Personagem();
var protagonista = new Personagem();

function bico(ship){
   'use strict' 
    
    material = new THREE.MeshLambertMaterial({color:0xBB0008, wireframe:false});
    geometry = new THREE.ConeGeometry(20, 60, 3);
    var ponta = new THREE.Mesh(geometry,material);
    ponta.position.set(0, 0, 0);
    ponta.rotation.x = 4.7;
    
   ship.add(ponta);
}

function gunLeft(ship){
   'use strict' 

   if(selecionado == "e")
   {
     material = new THREE.MeshBasicMaterial({color:0xffa4a, wireframe:false});
   }
   else
      material = new THREE.MeshPhongMaterial({color:0xffa4a, wireframe:false});

    geometry = new THREE.ConeGeometry(6, 15, 3);
    armaEsquerda = new THREE.Mesh(geometry, material);
    armaEsquerda.position.set(-30, 0, 22);
    armaEsquerda.rotation.x = 4.7;
    
   ship.add(armaEsquerda);
}

function gunCenter(ship){
   'use strict' 
    
   if(selecionado == "c")
   {
     material = new THREE.MeshBasicMaterial({color:0xffa4a, wireframe:false});
   }
   else
      material = new THREE.MeshPhongMaterial({color:0xffa4a, wireframe:false});

    geometry = new THREE.ConeGeometry(6, 15, 3);
    armaCentral = new THREE.Mesh(geometry,material);
    armaCentral.position.set(0, 0, -22);
    armaCentral.rotation.x = 4.7;
    
   ship.add(armaCentral);
}

function gunRight(ship){
   'use strict' 
    
    if(selecionado == "d")
   {
      material = new THREE.MeshBasicMaterial({color:0xffa4a, wireframe:false});
   }
   else
      material = new THREE.MeshPhongMaterial({color:0xffa4a, wireframe:false});

    geometry = new THREE.ConeGeometry(6, 15, 3);
     armaDireita = new THREE.Mesh(geometry,material);
    armaDireita.position.set(30, 0, 22);
    armaDireita.rotation.x = 4.7;
    
   ship.add(armaDireita);
}

function back(ship){
   'use strict' 
    
      material = new THREE.MeshLambertMaterial({color:0xBB0008, wireframe:false});
      geometry = new THREE.BoxGeometry(70, 10, 5);
      let backWing = new THREE.Mesh(geometry, material);

      backWing.position.set(0, 0, 35);
      backWing.rotation.x = 4.7;
      backWing.rotation.z = 0;
    
   ship.add(backWing);
}

function esfera(bandido){
    'use strict' 
     
     material = new THREE.MeshPhongMaterial({color:0x00bfff, wireframe:false});
     geometry = new THREE.SphereGeometry(20, 60, 3);
     var ponta = new THREE.Mesh(geometry,material);
     ponta.position.set(0, 0, 0);
     ponta.rotation.x = 4.7;
     
    bandido.add(ponta);
 }

 function gun(bandido){
    'use strict' 
     
     material = new THREE.MeshLambertMaterial({color:"red", wireframe:false});
     geometry = new THREE.ConeGeometry(6, 15, 3);
     var ponta = new THREE.Mesh(geometry,material);
     ponta.position.set(0, 0, -22);
     ponta.rotation.x = 4.7;
     
    bandido.add(ponta);
 }



// ======================================================================================================= //

                                       /** AS LUZES */

// ======================================================================================================= //



// ========================================================== //

                    // Luz Directional

var  directionalLight = new THREE.DirectionalLight( 0xffffff, .3);
directionalLight.castShadow = true; 


function ligaLuzes(){
    directionalLight.visible = !directionalLight.visible
}


// =================================================================//

                        // Holofotes e alvos

const holofote1 = new THREE.SpotLight( 0xffffff );
holofote1.position.set( 0, 1, 0 );
const avlo1 = new THREE.Object3D();
avlo1.position.set( 10, 13, 0 )

holofote1.target = avlo1

const holofote2 = new THREE.SpotLight( 0xffffff );
holofote2.position.set( 0, 1, 0 );
const avlo2 = new THREE.Object3D();
avlo2.position.set( -10, 13, 0 )

holofote2.target = avlo2

const holofote3 = new THREE.SpotLight( 0xffffff );
holofote3.position.set( 0, 1, 0 );
const avlo3 = new THREE.Object3D();
avlo3.position.set( 0, 11, 10 )

holofote3.target = avlo3

const holofote4 = new THREE.SpotLight( 0xffffff );
holofote4.position.set( 0, 1, 0 );
const avlo4 = new THREE.Object3D();
avlo4.position.set( 0, 11, -10 )

holofote4.target = avlo4

// Liga e desliga os 4 holofotes
function LigaDesliga(holofote){
    holofote.visible = !holofote.visible
}

// ================================================= //




// ======================================================================================================= //

                                       /** A CENA */

// ======================================================================================================= //


//Criar os cubos a serem usados 
function Cenario(){
        
   // Criar o cubo
   var cubeGeometry = new THREE.BoxGeometry(20, 120, 20);
   const texturaEsquerda = new THREE.TextureLoader().load("../IMG/monalisa.jpg")
   var cubeMaterial = new THREE.MeshBasicMaterial({map: texturaEsquerda, wireframe: false});
   cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

   // Criar o cubos a direita
   var cubeGeometry0 = new THREE.BoxGeometry(20, 120, 20);
   const texturaDireita = new THREE.TextureLoader().load("../IMG/scream.jpg")
   var cubeMaterial0 = new THREE.MeshLambertMaterial({map: texturaDireita, wireframe: false});
   cube0 = new THREE.Mesh(cubeGeometry0, cubeMaterial0);

   // Criar o Inferior
   var cubeGeometry1 = new THREE.BoxGeometry(33, 120, 5);
   var cubeMaterial1 = new THREE.MeshBasicMaterial({color:"#ff4500", wireframe: false});
   cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);

   // Criar o Superior
   var cubeGeometry2 = new THREE.BoxGeometry(33, 120, 5);
   var cubeMaterial2 = new THREE.MeshBasicMaterial({color:"#ff4500", wireframe: false});
   cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
   //Os parametros da função set referente ao position do cubo são as coordenadas x,y,z

   //------ Blocos a Direita -----

   cube0.position.set(590, -50, -30);
   cube0.scale.y = 1.5;
   cube0.scale.x = 36;
   cube0.rotation.y = 1.579

  //--------------------------------

   //Blocos a Esquerda
   cube.position.set(-590, -50, -30);
   cube.scale.y = 1.5;
   cube.scale.x = 36;
   cube.rotation.y = 1.579

  //--------------------------------

   //Blocos de Baixo
   cube1.position.set(0, -50, 335);
   cube1.scale.y = 1.5;
   cube1.scale.x = 36;
   cube1.rotation.y = 0

   //--------------------------------

   //Blocos de cima
   cube2.position.set(0, -50, -375);
   cube2.scale.y = 1.5;
   cube2.scale.x = 36;
   cube2.rotation.y = 0

   //------------------------------------

   //Adiconar os cubos a cena
   scene.add(cube1);
   scene.add(cube2);
   

}


// ======================================================================================================= //

                                       /** COLISÕES */

// ======================================================================================================= //


var bboxFirst,bboxSecond;

function calculandoAsColisoes(dados) { 

   if (dados == 'direita') {
   // Criando novas BoundingBox nos dois objectos
   bboxFirst = new THREE.Box3().setFromObject(nave);
   bboxSecond = new THREE.Box3().setFromObject(paredeEsquerda);
   
   if(bboxFirst.isIntersectionBox(bboxSecond)){
      return true;
   }

   return false;

  }else if (dados == 'esquerda'){
    // Criando novas BoundingBox nos dois objectos
    bboxFirst = new THREE.Box3().setFromObject(nave);
    bboxSecond = new THREE.Box3().setFromObject(paredeDireita);

    if(bboxFirst.isIntersectionBox(bboxSecond)){
      return true;
   }
   
   return false;

   }
   
   return false; 
   
 }