//nombre para colocar portal->Portal
var tauro;
var contadorArrow = 0;
var heartText;
var maxHearts = 3;
var x;
var y;
var KeyA;
var KeyW;
var KeyS;
var KeySpace;
var KeyD;
var KeyV;
var KeyP;
var arrowList1;
var enemyTauroList1;


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
    this.load.image("tiles", 'assets/tiles/[Base]BaseChip_pipo.png');
    //this.load.image("sombras", 'assets/tiles/map_effect4.png');
    this.load.image("sombras2", 'assets/tiles/[A]Wall-Up_Dungeon1_pipo.png');
    this.load.tilemapTiledJSON("map", "assets/mapa/cueva.json");

  //Flechas
    this.load.atlas('atlas', 'assets/arrow/arrow.png', 'assets/arrow/arrow.json');

  //Corazones
    this.load.image('heart', 'assets/health/heart.png');
    this.load.image('heartempty', 'assets/health/border.png')
}

create() {
  
  //TILEMAP
  const map = this.make.tilemap({ key:"map" });
  const tileset = map.addTilesetImage("[Base]BaseChip_pipo", "tiles");
  const sombra = map.addTilesetImage("[A]Wall-Up_Dungeon1_pipo", "sombras2");

  //const Techo = map.createStaticLayer("Techo", sombra, 0, 0);
  const Piedras = map.createLayer("Piedras", tileset, 0, 0);
  const Mundo = map.createLayer("World", tileset, 0, 0);
  const Below = map.createLayer("Suelo", tileset, 0, 0);
  
  Below.setDepth(-1);
  Mundo.setCollisionByProperty({ collides: true });
  Techo.setCollisionByProperty({ collides: true });
  Piedras.setCollisionByProperty({ collides: true });
  this.physics.world.setBounds(0, 0, 1600, 1600); 
  

  
  //SPAWNPOINT
  const spawnPoint = map.findObject("Spawn Cueva", obj => obj.name === "Spawn Cueva");

  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'hero');
	player.setSize(10,14);
  player.setScale(1.2)
  player.speed = 175;
  player.speedRoll = 400;

//Enemy
  /*tauro = this.physics.add.group({
    classType: 'enemyTauro'});*/

  //Grupos
  var arrowList1 = this.physics.add.group();
  var enemyTauroList1 = this.physics.add.group();
  
  player.setCollideWorldBounds(true);
  
  /*debugGraphics = this.add.graphics().setAlpha(0.7);
	Mundo.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
	});*/
  //Colision mundo player y enemigo
  this.physics.add.collider(enemyTauroList1, Mundo);
  this.physics.add.collider(Mundo, player)
  
  
  

  //CAMARA
	this.cameras.main.setBounds(0, 0, 1600, 1600);
  this.cameras.main.startFollow(player);


  this.physics.add.overlap(arrowList1, enemyTauroList1, destroyEnemy, null, this);

  //CORAZONES
  /*const hearts = this.add.group({
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
  })*/

  this.physics.add.collider(player, enemyTauroList1, shake, null, this);
  heartText = this.add.text(16, 16, 'Hearts: '+ maxHearts, { fontSize: '16px', fill: '#ffc0cb' });


  //MOVIMIENTO
    KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    KeyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    KeySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

update() {

  const taurospeed = 50;

  createEnemy();

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

function createEnemy()
{
  for (i = 0; i < 1; i++)
  {
    enemyTauroList1 = this.physics.add.sprite(200, 200, "enemyTauro");
    enemyTauroList1.setOrigin(0.5, 0.5);
    enemyTauroList1.setScale(0.55, 0.55);
    enemyTauroList1.direccion = 0;
    enemyTauroList1.setSize(30,40);
    enemyTauroList1.speed = 100;
  }
}

function atackUp()
{
  player.anims.play('atackup', true);
}

function destroyEnemy(a, e)
{
  a.disableBody(true, true);
  e.disableBody(true, true);
  arrowList1.remove(a);
  enemyTauroList1.remove(e);
}

function shake(p, tl){
  /*p.disableBody(false, false);
  tl.disableBody(true, true);
  enemyTauroList.remove(tl);
  player.hearts -=1;
  heartText.text = 'Hearts: ' + player.hearts;*/
  if(player.hearts <= 0)
  {
    killPlayer();
  }

}

function killPlayer()
{
  player.dead = true;
  killSprite(player, restartGame);
}

function killSprite()
{
  player.destroy();
}

function restartGame()
{
  game.state.start(game.state.current);
}