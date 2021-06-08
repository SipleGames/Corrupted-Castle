//deliver
var KeyA;
var KeyW;
var KeyS;
var KeySpace;
var KeyD;
var KeyV;
var KeyP;
var KeyO;
var Key1, Key2, Key3, Key3, Key4, Key5;
var player;
var arrowList;
var enemyTauroList;
var text;
var contadorArrow = 0;
var contadorTauro = 0;
var numTauro = 0;
var contarTauro = numTauro;
var finOleada = 0;
var randomX;
var randomY;
var emyMovLi;
var vidas;


class Campo extends Phaser.Scene {
  
  constructor(){
    super({key: "Campo"});
  }

  preload(){
    this.load.tilemapTiledJSON('map', 'game/assets/mapa/campo.json');
    this.load.image('tileBase', 'game/assets/tiles/[Base]BaseChip_pipo.png');
    this.load.image('tileAgua', 'game/assets/tiles/[A]Water_pipo.png');
    this.load.image('tileHierba', 'game/assets/tiles/[A]Grass_pipo.png');

    this.load.atlas('atlas', 'game/assets/arrow/arrow.png', 'game/assets/arrow/arrow.json');
    this.load.spritesheet('atack', 'game/assets/character/swordt.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('hero', 'game/assets/character/animMov.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('roll', 'game/assets/character/Character_Roll.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemyTauro', 'game/assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});
    this.load.spritesheet('enemyVolador', 'game/assets/enemies/volador.png', {frameWidth: 36, frameHeight: 50});
    this.load.spritesheet('deathParticlesBlue', 'game/assets/particulas/deathParticlesBlue.png', {frameWidth: 128, frameHeight: 128});

    //Inventario
    this.load.image('inventory', 'game/assets/inventario/inventario.png');

    //Portal
      this.load.image("portal", "game/assets/portal/portal.png");
  }

  create(){

    this.scene.add("Castillo", new Castillo);
    //this.scene.add("Cueva", new Cueva);
    
    //Tilemap y colisiones
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("[Base]BaseChip_pipo", "tileBase");
    const tileset2 = map.addTilesetImage("[A]Water_pipo", "tileAgua");
    const tileset3 = map.addTilesetImage("[A]Grass_pipo", "tileHierba");
    const allTilesets = [tileset, tileset2, tileset3];

    const Base = map.createLayer("Base", allTilesets);
    const Puentes = map.createLayer("Puentes", allTilesets);
    const Medio = map.createLayer("Medio", allTilesets);
    const EntreTop = map.createLayer("Entre", allTilesets);
    const Agua = map.createLayer("Agua", allTilesets)
    const Top = map.createLayer("Top", allTilesets);

    Base.setDepth(-4);
    Medio.setCollisionByProperty({collides:true});
    EntreTop.setCollisionByProperty({collides:true});
    EntreTop.setDepth(-3);
    Agua.setCollisionByProperty({collides:true});
    Agua.setDepth(-4);
    Puentes.setDepth(-2);
    Top.setDepth(2);

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Castle");

    //Para ver objetos con colisiones
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    Medio.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    //Inventario
    inventory = this.add.image(690, 30, 'inventory').setScrollFactor(0)

    //Personaje principal
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "hero");
    player.setOrigin(0.5, 0.5);
    player.setScale(1.5, 1.5);
    player.direccion = 4;
    player.setSize(10,14);
    player.speed = 175;
    player.speedRoll = 400;
    player.setDepth(-1);

    //Portal
    const EnterCastle = map.findObject("Objects", obj => obj.name === "EnterCastle");
    var portalCastle = this.physics.add.sprite(EnterCastle.x, EnterCastle.y, "portal");
    portalCastle.setOrigin(0.5);
    portalCastle.setScale(0.2,0.2);
    portalCastle.setDepth(-1);

    const EnterCave = map.findObject("Objects", obj => obj.name === "EnterCave");
    var portalCave = this.physics.add.sprite(EnterCave.x, EnterCave.y, "portal");
    portalCave.setOrigin(0.5);
    portalCave.setScale(0.2,0.2);
    portalCave.setDepth(-1);

    //Grupos
    arrowList = this.physics.add.group();
    enemyTauroList = this.physics.add.group();
    

    //Colisiones
    this.physics.add.overlap(arrowList, enemyTauroList, destroyEnemies, null, this);
    this.physics.add.overlap(player, enemyTauroList, enemyDies, null, this);
    this.physics.add.overlap(portalCastle, player, changeCastillo, null, this);
    this.physics.add.overlap(portalCave, player, changeCueva, null, this);

    //Colision Medio player
    this.physics.add.collider(Medio, player);
    this.physics.add.collider(EntreTop, player);
    this.physics.add.collider(Agua, player);
    //Colision Medio enemigo
    this.physics.add.collider(Medio, enemyTauroList);
    this.physics.add.collider(EntreTop, enemyTauroList);
    this.physics.add.collider(Agua, enemyTauroList);


    //Input de teclas 
    KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    KeyP=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    KeySpace=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    KeyV=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    KeyO=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    //Teclas para inventario
    Key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    Key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    Key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    Key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    Key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);

    //Camara
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

      //Animaciones ataques
    this.anims.create({
      key: 'atackdown',
      frames: this.anims.generateFrameNumbers('atack', {start: 0, end: 4}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'atackright',
      frames: this.anims.generateFrameNumbers('atack', {start: 5, end: 9}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'atackleft',
      frames: this.anims.generateFrameNumbers('atack', {start: 10, end: 14}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'atackup',
      frames: this.anims.generateFrameNumbers('atack', {start: 15, end: 19}),
      frameRate: 10,
      repeat: -1
    });

  //Animacion Enemigo
  this.anims.create({
      key: 'tauroleft',
      frames: this.anims.generateFrameNumbers('enemyTauro', {start: 4, end: 7}),
      frameRate: 10,
      repeat: -1
    });
  this.anims.create({
      key: 'tauroright',
      frames: this.anims.generateFrameNumbers('enemyTauro', {start: 8, end: 11}),
      frameRate: 10,
      repeat: -1
    });
  this.anims.create({
      key: 'tauroup',
      frames: this.anims.generateFrameNumbers('enemyTauro', {start: 12, end: 15}),
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

  //Animacion particulas muerte
  this.anims.create({
    key: "enemyParticlesBlue",
    frames: this.anims.generateFrameNumbers('deathParticlesBlue', {start: 0, end: 14}),
  });


    this.text = this.add.text(32, 32).setScrollFactor(0).setFontSize(16).setColor('#ffffff');
    text = this.add.text(750, 32);

    //Valores para el reload
    contadorArrow = 0;
    contadorTauro = 0;
    numTauro = 0;
    vidas = 3;
    contarTauro = numTauro;
    finOleada = 0;
    randomX;
    randomY;
  }

  
  

  update(){

    if (KeyV.isDown)
    {
      savedatabase();
    }

    if (KeyS.isDown)
    {
      downMovement();
      player.speed = 175;
    }
    else if (KeyW.isDown)
    {
      upMovement();
      player.speed = 175;
    }
    else if (KeyD.isDown)
    {
      rightMovement();
      player.speed = 175;
    }
    else if (KeyA.isDown)
    {
      leftMovement();
      player.speed = 175;
    }
    else if (KeyP.isDown && !KeySpace.isDown)
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

    if (finOleada == 0)
    {
      if (contadorTauro == 0)
      {
        enemyDownCreation();
      }
    }


    for (i = 0; i < enemyTauroList.getChildren().length; i++)
        {
          emyMovLi = enemyTauroList.getChildren()[i];
          emyMovLi.anims.play('enemyDown', true);

          this.physics.moveTo(emyMovLi, player.x, player.y, 150);
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

    if (KeyO.isDown)
    {
      if (player.direccion == 1)
      {
        atackLeft();
      }
      else if (player.direccion == 2)
      {
        atackUp();
      }
      else if (player.direccion == 3)
      {
        atackRight();
      }
      else if (player.direccion == 4)
      {
        atackDown();
      }
    }

    if (contadorArrow > 0)
    {
      contadorArrow = contadorArrow - 25;
    }
    if (contadorTauro > 0)
    {
      contadorTauro = contadorTauro - 25;
    }
    player.body.velocity.normalize().scale(player.speed);


    this.text.setText([
      'vidas: ' + vidas,
      'contadorTauro: ' + contadorTauro,
      'contadorArrow: ' + contadorArrow,
      'numTauro: ' + numTauro,
      'finOleada: ' + finOleada,
      'randomX: ' + enemyTauro.x,
      'randomY: ' + enemyTauro.y,
      'playerX: ' + player.x,
      'playerY: ' + player.y
    ]);
  }
}

function downMovement()
{
	player.anims.play('down', true);
  player.setVelocityY(player.speed);
  player.setVelocityX(0);
  player.direccion = 4;
}

function rightMovement()
{
	player.anims.play('right', true);
  player.setVelocityX(player.speed);
  player.setVelocityY(0);
  player.direccion = 3;
}

function leftMovement()
{
	player.anims.play('left', true);
  player.setVelocityX(-player.speed);
  player.setVelocityY(0);
  player.direccion = 1;
}

function upMovement()
{
	player.anims.play('up', true);
  player.setVelocityY(-player.speed);
  player.setVelocityX(0);
  player.direccion = 2;
}

function idleDown()
{
	player.anims.play('idleDown');
}

function idleLeft()
{
  player.anims.play('idleLeft');
}

function idleUp()
{
  player.anims.play('idleUp');
}

function idleRight()
{
  player.anims.play('idleRight');
}

function rollUpMovement()
{
	player.anims.play('rollUp', true);
  player.setVelocityY(-player.speed);
}

function rollLeftMovement()
{
	player.anims.play('rollLeft', true);
  player.setVelocityX(-player.speed);
}

function rollRightMovement()
{
	player.anims.play('rollRight', true);
  player.setVelocityX(player.speed);
}

function rollDownMovement()
{
	player.anims.play('rollDown', true);
  player.setVelocityY(player.speed);
}

function arrowCreatorLeft()
{
  for (i = 0; i < 1; i++)
  {
    arrow = arrowList.create(player.x, player.y, 'atlas', 'left');
    arrow.setScale(0.10, 0.10);
    arrow.setOrigin(0.5, 0.5);
    arrow.speed = 250;
    arrow.setDepth(-1);
    arrow.setSize(10,14);

    arrow.setVelocityX(-arrow.speed);
  }
}

function arrowCreatorUp()
{
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

function arrowCreatorRight()
{
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

function arrowCreatorDown()
{
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

function enemyDownCreation()
{
  finOleada = numTauro;

  for (i = 0; i < numTauro; i++)
  {
    randomX = Phaser.Math.Between(0, 3128);
    randomY = Phaser.Math.Between(0, 3157);
    enemyTauro = enemyTauroList.create( randomX, randomY, "enemyTauro");
    enemyTauro.setOrigin(0.5, 0.5);
    enemyTauro.setScale(0.55, 0.55);
    enemyTauro.direccion = 0;
    enemyTauro.setSize(40,40);
    enemyTauro.speed = 1;
  }
  contadorTauro = 1000;
  numTauro = numTauro + 1;
}

function enemyMovement()
{
  
    for (i = 0; i < enemyTauroList.getChildren().length; i++)
  {
    emyMovLi = enemyTauroList.getChildren()[i];

    this.physics.moveTo(emyMovLi, player.x, player.y, emyMovLi.speed, 10);
  
  }
  
}

function destroyEnemies(a, e)
{
  a.disableBody(true, true);
  e.disableBody(true, true);
  arrowList.remove(a);
  enemyTauroList.remove(e);

  particlesDeath = this.add.sprite(e.x, e.y, 'deathParticlesBlue');
  particlesDeath.play('enemyParticlesBlue');



  finOleada = finOleada - 1;
}

function enemyDies(p, e)
{
  if (vidas > 0)
  {
    vidas = vidas - 1;
  }
}

function changeCastillo()
{
  this.scene.start("Castillo");
  this.scene.remove("Campo");
  this.scene.remove("Cueva");
}

function changeCueva()
{
  window.location.assign("http://localhost/CorruptedCastle/web/cueva.html");
  this.scene.remove("Campo");
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