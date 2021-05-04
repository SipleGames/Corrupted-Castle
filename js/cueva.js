const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {

  //Personaje
    this.load.spritesheet('hero', 'assets/images/character/animMov.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('roll', 'assets/images/character/Character_Roll.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('atack', 'assets/images/character/swordt.png', { frameWidth: 32, frameHeight: 32 });

  //Enemigo
    this.load.spritesheet('enemyTauro', 'assets/images/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});

  //Mapa
    this.load.image("tiles", 'assets/tiles/[Base]BaseChip_pipo.png');
    this.load.image("sombras", 'assets/tiles/map_effect4.png');
    this.load.tilemapTiledJSON("map", "assets/mapa/cueva.json");

  //Corazones
    this.load.image('heart', 'assets/images/Health/heart.png');
    this.load.image('heartempty', 'assets/images/Health/border.png')
}

function create() {
  
  player = this.physics.add.sprite(config.width / 2, config.height / 2, 'hero');
	player.setSize(10,14);
  player.speed = 175;
  player.speedRoll = 400;

//Enemy
  tauro = this.physics.add.group({
    classType: 'enemyTauro'});

  

  
  //TILEMAP
  map = this.make.tilemap({ key:"map" });
  tileset = map.addTilesetImage("[Base]BaseChip_pipo", "tiles");
  sombra = map.addTilesetImage("map_effect4", "sombras");

  Techo = map.createStaticLayer("Techo", sombra, 0, 0);
  Mundo = map.createStaticLayer("World", tileset, 0, 0);
  Below = map.createStaticLayer("Suelo", tileset, 0, 0);
  Below.setDepth(-1);
  Mundo.setCollisionByProperty({ collides: true });this.physics.world.setBounds(0, 0, 1600, 1600); 
  player.setCollideWorldBounds(true);

  
  debugGraphics = this.add.graphics().setAlpha(0.7);
	Mundo.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
	});

  this.physics.add.collider(tauro, Mundo);
  this.physics.add.collider(Mundo, player)
  
 /* scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, tauro);*/
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


  //SPAWNPOINT

  //MOVIMIENTO
    KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    KeyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

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
var UP;
var DOWN;
var LEFT;
var RIGHT;

/*var handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
{
  if(go !== this)
  {
    return
  }

  const newDirection = Phaser.Math.Between(0, 3);
  tauro.direction = newDirection
}*/


function update() {

  const Direction = {
    UP,
    DOWN,
    LEFT,
    RIGHT
  };
  const taurospeed = 50;

  switch(tauro.direction)
  {
    case Direction.UP:
      tauro.setVelocity(0,-taurospeed);
      break
    
    case Direction.DOWN:
      tauro.setVelocity(0,taurospeed);
      break
    
    case Direction.LEFT:
      tauro.setVelocity(-taurospeed,0);
      break

    case Direction.RIGHT:
      tauro.setVelocity(taurospeed,0);
      break
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