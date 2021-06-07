//nombre para colocar portal->Portal
var player;
var tauro;
var portal;
var contadorArrow = 0;
var heartText;
var maxHearts = 3;
var x;
var y;
var playermuerto = false;

var KeyA;
var KeyO;
var KeyW;
var KeyS;
var KeySpace;
var KeyD;
var KeyV;
var KeyP;
var KeyL, Key1, Key2, Key3, Key4, Key5;
var arrowList;
var enemyTauroList;
var casilla1 = false;
var casilla2 = false;
var casilla3 = false;
var casilla4 = false;
var casilla5 = false;
var inventory;
var potionCasilla;
var pocion;
var potion;
var apple;
var Portal;
var tauros;


class Cueva extends Phaser.Scene{

  
constructor()
{
  super({key: "Cueva"})
}


preload() {

  //Personaje
    this.load.spritesheet('hero', 'assets/character/animMov.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('roll', 'assets/character/Character_Roll.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('atack', 'assets/character/swordt.png', { frameWidth: 32, frameHeight: 32 });

  //Enemigo
    this.load.spritesheet('enemyTauro', 'assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});

  //Mapa
    this.load.image("tiles", 'assets/tiles/[Base]BaseChip_pipo16x16.png');
    this.load.image("sombras", 'assets/tiles/[A]Wall-Up_Dungeon1_pipo.png');
    this.load.tilemapTiledJSON("map", "assets/mapa/cueva.json");
    this.load.image("portal", "assets/portal/portal.png");

  //Flechas
    this.load.atlas('atlas', 'assets/arrow/arrow.png', 'assets/arrow/arrow.json');

  //Inventario
    this.load.image('pocion', 'assets/inventario/pocion.png');
    this.load.image('manzana', 'assets/inventario/manzana.png');
    this.load.image('inventory', 'assets/inventario/inventario.png');

  //Corazones
    this.load.image('heart', 'assets/health/heart.png');
    this.load.image('heartempty', 'assets/health/border.png')
}

create() {
  this.scene.add("Campo", new Campo); 
  //TILEMAP
  const map = this.make.tilemap({ key:"map" });
  const tileset = map.addTilesetImage("[Base]BaseChip_pipo16x16", "tiles");
  const sombra = map.addTilesetImage("[A]Wall-Up_Dungeon1_pipo", "sombras");

  const Techo = map.createLayer("Top", tileset, 0, 0);
  const Agujero = map.createLayer("Agujero", tileset, 0, 0);
  const Mundo = map.createLayer("World", tileset, 0, 0);
  const Below = map.createLayer("Below", tileset, 0, 0);
  Below.setDepth(-1);
  Mundo.setCollisionByProperty({ collides: true });
  Techo.setCollisionByProperty({ collides: true });
  Agujero.setCollisionByProperty({ collides: true });
  this.physics.world.setBounds(0, 0, 1600, 1600); 
  

  
  //SPAWNPOINT
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Cueva");

  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'hero');
	player.setSize(10,14);
  player.setScale(1.2)
  player.speed = 175;
  player.speedRoll = 400;

  //Portal
   const Portal = map.findObject("Objects", obj => obj.name === "Portal");
    var portalCampo = this.physics.add.sprite(Portal.x, Portal.y, "portal");
    portalCampo.setOrigin(0.5);
    portalCampo.setScale(0.2,0.2);
    portalCampo.setDepth(-1);

//Enemy
  tauros = this.physics.add.group()
  for (var i = 0; i < 9; i++)
    {
    /*Phaser.Math.Between(0, Mundo.width), Phaser.Math.Between(0, Mundo.height)*/
      tauro = tauros.create(200, 200, 'Tauro2');
      tauro.setScale(0.6);
      tauro.velocidad = 60;  
      tauro.patrolCircle = new Phaser.Geom.Circle(0, 0, 256);
      tauro.direccion = -1;
    }

  //Grupos
  var arrowList = this.physics.add.group(); 
  player.setCollideWorldBounds(true);
  
  /*debugGraphics = this.add.graphics().setAlpha(0.7);
	Mundo.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
	});*/

  //Inventario 
  inventory = this.add.image(690, 30, 'inventory').setScrollFactor(0);
  potion = this.physics.add.sprite(300, 200, 'pocion');
  apple = this.physics.add.sprite(340, 150, 'manzana');

  //Colision
  this.physics.add.collider(tauro, Mundo, cambiar, null, this);
  this.physics.add.collider(arrowList, Mundo);
  this.physics.add.collider(Mundo, player);
  this.physics.add.overlap(player, tauro, shake, null, this);
  ;
  this.physics.add.overlap(arrowList, tauros, enemyDie, null, this);

  this.physics.add.overlap(player, potion, llevarinv, null, this);
    this.physics.add.overlap(player, apple, llevarinv, null, this)
  this.physics.add.overlap(portalCampo, player, changeCampo, null, this);
  
  
  

  //CAMARA
	this.cameras.main.setBounds(0, 0, 1600, 1600);
  this.cameras.main.startFollow(player);


  

  //CORAZONES
  const hearts = this.add.group({
    classType: Phaser.GameObjects.Image
  })
  hearts.createMultiple({
    key: 'heart',
    setXY: {
      x: 10,
      y: 10,
      stepX: 18
    },
    quantity: 3
  })

  
   heartText = this.add.text(16, 16, 'Hearts: '+ maxHearts, { fontSize: '16px', fill: '#ffc0cb' }).setScrollFactor(0);


  //MOVIMIENTO
    KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    KeyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    KeySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    Key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    Key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    Key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    Key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    Key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    KeyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

//Animaciones movimiento
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

//Animaciones roll
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
  
   

}

update(time, delta) {

  for(var i = 0; i < 9; i++)
  { 
    tauro.body.setVelocityX(tauro.direccion * tauro.velocidad);
 
    tauro.patrolCircle.x = player.x;
    tauro.patrolCircle.y = player.y;

    if(tauro.patrolCircle.contains(player.x, player.y)){
      if (player.x < tauro.x && tauro.body.setVelocityX >= 0) 
        tauro.body.setVelocityX = -150;
    }
    else if (player.x > tauro.x && tauro.body.setVelocityX <= 0) {
        tauro.body.setvelocityX = 150;
    }

  }

  //Codigo caminar

    if (KeyS.isDown)
	{
    downMovement();
	}
  else if (KeyW.isDown)
	{
		upMovement();
	}
  else if (KeyD.isDown)
	{
		rightMovement();
	}
	else if (KeyA.isDown)
	{
		leftMovement();
	}
  else if (KeyP.isDown)
  {
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
  player.body.velocity.normalize().scale(player.speed);

  //Codigo ataques
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

  if(casilla1)
  {
    if (Phaser.Input.Keyboard.JustDown(Key1))
    {
      this.time.addEvent({delay: 6000, callback: acaboboost})
      potionCasilla.destroy();
      player.speed = 400; 
      casilla1 = false;
    }   
  }

  if(KeyL.isDown && casilla1 || casilla2 || casilla3 || casilla4 || casilla5)
  {
    potionCasilla.destroy();
    potion = this.physics.add.sprite(player.x, player.y, 'pocion');
    
    this.physics.add.overlap(player, potion, llevarinv, null, this);
    casilla1 = false;
  }

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
  player.setVelocityY(-player.speedRoll);
}

function rollLeftMovement()
{
	player.anims.play('rollLeft', true);
  player.setVelocityX(-player.speedRoll);
}

function rollRightMovement()
{
	player.anims.play('rollRight', true);
  player.setVelocityX(player.speedRoll);
}

function rollDownMovement()
{
	player.anims.play('rollDown', true);
  player.setVelocityY(player.speedRoll);
}

function atackDown()
{
  player.anims.play('atackdown', true);
}

function atackLeft()
{
  player.anims.play('atackleft', true);
}

function atackRight()
{
  player.anims.play('atackright', true);
}

function atackUp()
{
  player.anims.play('atackup', true);
}

function destroyEnemy(a, e)
{
  a.disableBody(true, true);
  e.disableBody(true, true);
  arrowList.remove(a);
  tauros.remove(e);
}

function shake(){
  const hearts = this.add.group({
  classType: Phaser.GameObjects.Image
  })
  hearts.createMultiple({
    key: 'heart',
    setXY: {
      x: 20,
      y: 10,
      stepX: 18
    },
    quantity: 2
  })
    
  player.hearts -=1;
  heartText.text = 'Hearts: ' + player.hearts;
  if(player.hearts <= 0)
  {
    playerdie();
  }

}

function playerdie()
{
   player.disableBody(true, true);
    playermuerto = true;
}

function enemyDie()
{
  tauro.disableBody(true, true);

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


function caeragujero()
{
  playerdie();
}

function cambiar()
{
  if(tauro.direccion = 1){tauro.direccion = 1}
  else{tauro.direccion = -1}
  
}

function llevarinv()
{
	potion.destroy();
	potionCasilla = this.add.image(618, 35, 'pocion').setScrollFactor(0);
	potionCasilla.setScale(2);
  casilla1 = true;
}

function acaboboost()
{
  player.speed = 175;
}

function changeCampo()
{
  this.scene.start("Campo");
  this.scene.remove("Castillo");
  this.scene.remove("Cueva");
  
  

}