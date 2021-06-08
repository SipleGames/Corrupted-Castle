var timerArrow;
var text;
var KeyA;
var KeyW;
var KeyS;
var KeySpace;
var KeyD;
var KeyP;
var KeyC;
var KeyV;
var player;
var enemyTauro;
var enemyDown;
var exit;
var arrowList;

class Castillo extends Phaser.Scene {

  constructor() {
        super({key: "Castillo"});
  }
  preload()
  {      
      //Cargar mapa
      this.load.tilemapTiledJSON("mapa", "game/assets/mapa/castillo.json");
      this.load.image("tiles", "game/assets/tiles/[Base]BaseChip_pipo.png");

      //Flechas
      this.load.atlas('atlas', 'game/assets/arrow/arrow.png', 'game/assets/arrow/arrow.json');
        
      //Personaje
      this.load.spritesheet('hero', 'game/assets/character/animMov.png', {frameWidth: 32, frameHeight: 32});
      this.load.spritesheet('roll', 'game/assets/character/Character_Roll.png', {frameWidth: 32, frameHeight: 32});

      //Enemigo
      this.load.spritesheet('enemyTauro', 'game/assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});
      this.load.spritesheet('enemyVolador', 'game/assets/enemies/volador.png', {frameWidth: 36,frameHeight: 50});

      //Portal
      this.load.image("portal", "game/assets/portal/portal.png");
  }


  create()
  {
    text = this.add.text(32);
    //Tiled
      const map = this.make.tilemap({ key: "mapa" });
      const tileset = map.addTilesetImage("[Base]BaseChip_pipo", "tiles");

      const belowLayer = map.createLayer("Bot", tileset);
      const worldLayer = map.createLayer("top", tileset);
      const aboveLayer = map.createLayer("superficie", tileset);

      belowLayer.setDepth(-1);
      worldLayer.setCollisionByProperty({collides:true});
      aboveLayer.setDepth(1);

   
    //Player
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "hero");
    player.setOrigin(0.5);
    player.setScale(1.5);
    player.direccion = 0;
    player.setSize(10,14);
    player.speed = 175;
    player.speedRoll = 400;

    //Portal
    const exit = map.findObject("Objects", obj => obj.name === "Exit");
    var portal = this.physics.add.sprite(exit.x, exit.y, "portal");
    portal.setOrigin(0.5);
    portal.setScale(0.2);
    portal.setDepth(-1);

    this.physics.add.collider(worldLayer, player);

    //Flechas
    arrowList = this.physics.add.group();

    //Enemigo prueba
    enemyTauro = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "enemyTauro");
    enemyTauro.setOrigin(0.5);
    enemyTauro.setScale(0.5);
    enemyTauro.direccion = 0;
    enemyTauro.setSize(40);
    enemyTauro.speed = 100;

    this.physics.add.overlap(portal, player, changeToCampo, null, this);


    //Colisiones dibujadas
    /*const debugGraphics = this.add.graphics().setAlpha(0.75);
      worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    const debugGraphics2 = this.add.graphics().setAlpha(0.75);
      aboveLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });*/


    //TECLAS

      KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      KeyP=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
      KeySpace=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      KeyV=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
      

    //CAMARA

    this.physics.world.setBounds(0, 0, 3200, 3200);
    this.cameras.main.setBounds(0, 0, 3200, 3200);

    this.cameras.main.startFollow(player);
    player.setCollideWorldBounds(true);

    

    //Animaciones andar e idle personaje
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('hero', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('hero', {start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero', {start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero', {start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'idleDown',
        frames: [{ key: 'hero', frame: 0 }],
        frameRate: 10
      });
      this.anims.create({
        key: 'idleLeft',
        frames: [{ key: 'hero', frame: 8 }],
        frameRate: 10
      });
      this.anims.create({
        key: 'idleUp',
        frames: [{ key: 'hero', frame: 12 }],
        frameRate: 10
      });
      this.anims.create({
        key: 'idleRight',
        frames: [{ key: 'hero', frame: 4 }],
        frameRate: 10
      });

      //Animacion roll
      this.anims.create({
        key: 'rollDown',
        frames: this.anims.generateFrameNumbers('roll', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'rollUp',
        frames: this.anims.generateFrameNumbers('roll', {start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'rollLeft',
        frames: this.anims.generateFrameNumbers('roll', {start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'rollRight',
        frames: this.anims.generateFrameNumbers('roll', {start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
      });


      //Animacion enemigos a mele
      this.anims.create({
        key: "enemyDown",
        frames: this.anims.generateFrameNumbers('enemyTauro', {start: 0, end: 3}),
        frameRate: 5,
        repeat: -1
      });

      this.scene.add("Campo", new Campo);

  }


  update()
  {   

    if (KeyV.isDown)
    {
      savedatabase();
    }
    
    if (KeyW.isDown)
    {
        upMovement();
        player.speed = 175;
    }

    else if(KeyS.isDown)
    {
        downMovement();
        player.speed = 175;
    }

    else if(KeyA.isDown)
    {
        leftMovement();
        player.speed = 175;
    }

    else if(KeyD.isDown)
    {
        rightMovement();
        player.speed = 175;
    }

    else if(KeyP.isDown && !KeySpace.isDown)
    {
      player.speed = 400;
      if (player.direccion == 1)
      {
        rollLeftMovement();
      }

      else if (player.direccion == 2)
      {
        rollUpMovement();
      }

      else if (player.direccion == 3)
      {
        rollRightMovement();
      }

      else if (player.direccion == 4)
      {
        rollDownMovement();
      }
    }

    else
    {
      if (player.direccion == 1)
        {
          idleLeft();
        }
        else if (player.direccion == 2)
        {
          idleUp();
        }
        else if (player.direccion == 3)
        {
          idleRight();
        }
        else if (player.direccion == 4)
        {
          idleDown();
        }
      player.setVelocity(0);
    }

    if (KeySpace.isDown)
    {
      if (contadorArrow == 0)
      {
        if (player.direccion == 1)
        {
          arrowCreatorLeft();
        }
        else if (player.direccion == 2)
        {
          arrowCreatorUp()
        }
        else if (player.direccion == 3)
        {
          arrowCreatorRight();
        }
        else if (player.direccion == 4)
        {
          arrowCreatorDown();
        }

        contadorArrow = 1000;
      }
    }

    if (contadorArrow > 0)
    {
      contadorArrow = contadorArrow - 25;
    }
    player.body.velocity.normalize().scale(player.speed);

 
  
  }
}

function downMovement(){
  player.anims.play('down', true);
  player.setVelocityY(player.speed);
    player.direccion = 4;
}

function rightMovement(){
  player.anims.play('right', true);
  player.setVelocityX(player.speed);
  player.direccion = 3;
}

function leftMovement(){
  player.anims.play('left', true);
  player.setVelocityX(-player.speed);
    player.direccion = 1;
}

function upMovement(){
  player.anims.play('up', true);
  player.setVelocityY(-player.speed);
    player.direccion = 2;
} 

function idleDown(){
  player.anims.play('idleDown');
}

function idleLeft(){
  player.anims.play('idleLeft');
}

function idleUp(){
  player.anims.play('idleUp');
}

function idleRight(){
    player.anims.play('idleRight');
}

function rollUpMovement(){
  player.anims.play('rollUp', true);
  player.setVelocityY(-player.speedRoll);
}

function rollLeftMovement(){
  player.anims.play('rollLeft', true);
  player.setVelocityX(-player.speedRoll);
}

function rollRightMovement(){
  player.anims.play('rollRight', true);
    player.setVelocityX(player.speedRoll);
}

function rollDownMovement(){
  player.anims.play('rollDown', true);
    player.setVelocityY(player.speedRoll);
}

function arrowCreatorLeft(){
  for (i = 0; i < 1; i++)
  {
    arrow = arrowList.create(player.x, player.y, 'atlas', 'left');
    arrow.setScale(0.1);
    arrow.setOrigin(0.5);
    arrow.speed = 250;
    arrow.setDepth(-1);
    arrow.setSize(10,14);

    arrow.setVelocityX(-arrow.speed);
  }
}

function arrowCreatorUp(){
  for (i = 0; i < 1; i++)
  {
    arrow = arrowList.create(player.x, player.y, 'atlas', 'up');
    arrow.setScale(0.10, 0.10);
    arrow.setOrigin(0.5, 0.5);
    arrow.speed = 250;
    arrow.setDepth(-1);
    arrow.setSize(10,14);

    arrow.setVelocityY(-arrow.speed);
  }
}

function arrowCreatorRight(){
  for (i = 0; i < 1; i++)
  {
    arrow = arrowList.create(player.x, player.y, 'atlas', 'right');
    arrow.setScale(0.10, 0.10);
    arrow.setOrigin(0.5, 0.5);
    arrow.speed = 250;
    arrow.setDepth(-1);
    arrow.setSize(10,14);

    arrow.setVelocityX(arrow.speed);
  }
}

function arrowCreatorDown(){
  for (i = 0; i < 1; i++)
  {
    arrow = arrowList.create(player.x, player.y, 'atlas', 'down');
    arrow.setScale(0.10, 0.10);
    arrow.setOrigin(0.5, 0.5);
    arrow.speed = 250;
    arrow.setDepth(-1);
    arrow.setSize(10,14);

   arrow.setVelocityY(arrow.speed);
  }
}

function changeToCampo()
{
this.scene.start("Campo");
//this.scene.launch("Campo");
this.scene.remove("Castillo");
}

function savedatabase()
{
  var directions = player.direccion;
  var vida = vidas;
  var positionx = player.x;
  var positiony = player.y
  
  var urlllamada = 'http://localhost/CorruptedCastle/web/php/index.php';

  xhr = new XMLHttpRequest();

  xhr.open('POST', urlllamada);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Acciones a procesar tras recibir la respuesta
  xhr.onload = function xhrOnload()
  {
    if (xhr.status === 200) {
      console.log('Respuesta recibida: ' + xhr.responseText);
    }
    else if (xhr.status !== 200) {
      console.log('Algo ha fallado: ' + xhr.status);
    }
  }
  // Envia datos al servidor php
  datos = 'directions=' + directions + '&vida=' + vida + '&positionx=' + positionx + '&positiony=' + positiony;
  // Debug
  console.log(datos);
  xhr.send(datos); 
}