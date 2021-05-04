var config={
    type:Phaser.AUTO,
    width:800,
    height:600,
    backgroundColor: '#000000',
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},
            //wdebug:true
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

var game=new Phaser.Game(config);

/*var timerArrow;
var text;*/
var contadorArrow = 0;
var contadorTauro = 0;
var numTauro = 2;
var contarTauro = numTauro
var finOleada = contarTauro;


function preload()
{
	this.load.tilemapTiledJSON('map', 'assets/mapa/campo.json');
	this.load.image('tileBase', 'assets/tiles/[Base]BaseChip_pipo.png');
  this.load.image('tileAgua', 'assets/tiles/[A]Water_pipo.png');
  this.load.image('tileHierba', 'assets/tiles/[A]Grass_pipo.png');

  this.load.atlas('atlas', 'assets/arrow/arrow.png', 'assets/arrow/arrow.json');

	this.load.spritesheet('hero', 'assets/character/animMov.png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('roll', 'assets/character/Character_Roll.png', {frameWidth: 32, frameHeight: 32});
  this.load.spritesheet('enemyTauro', 'assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});
  this.load.spritesheet('enemyVolador', 'assets/enemies/volador.png', {frameWidth: 36, frameHeight: 50});
}

function create()
{

  text = this.add.text(750, 32);
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
  /*const debugGraphics = this.add.graphics().setAlpha(0.75);
	Medio.renderDebug(debugGraphics, {
	tileColor: null, // Color of non-colliding tiles
	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
	faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
	});*/

	//Personaje principal
	player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "hero");
	player.setOrigin(0.5, 0.5);
	player.setScale(1.5, 1.5);
  player.direccion = 0;
  player.setSize(10,14);
  player.speed = 175;
  player.speedRoll = 400;
  player.setDepth(-1);

  //Grupos
  //Flechas
  arrowList = this.physics.add.group();
  enemyTauroList = this.physics.add.group();

  //Enemigo prueba
  /*enemyTauro1 = this.physics.add.sprite(spawnPoint.x, spawnPoint.y + 100, "enemyTauro");
	enemyTauro1.setOrigin(0.5, 0.5);
	enemyTauro1.setScale(0.55, 0.55);
  enemyTauro1.direccion = 0;
  enemyTauro1.setSize(36,36);
  enemyTauro1.speed = 100;*/
  

  //Colision flecha enemigo
 this.physics.add.overlap(arrowList, enemyTauroList, destroyEnemy, null, this);

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

  //Teclas pruabas enemigos
  KeyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

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


    //Animacion enemigos a mele
    this.anims.create({
      key: "enemyDown",
      frames: this.anims.generateFrameNumbers('enemyTauro', {start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });

    //Timers
    /*timerArrow =new Phaser.Time.TimerEvent({ delay: 2000});
    this.time.addEvent(timerArrow);*/
}

function update()
{
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

  if (KeyL.isDown)
  {
    if (finOleada != 0)
    {
      numTauro = numTauro + 1;
      enemyDownCreation();
    }
  }

  /*//Obtener progreso de timers
  var progress = timerArrow.getProgress();
  text.setText([
        'Click to restart the Timer',
        'Event.progress: ' + progress.toString().substr(0, 2)
    ]);*/

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
  angulos = 360/numTauro;

  for (i = 0; i < numTauro; i++)
  {
    enemyTauro = enemyTauroList.create(player.x + 100, player.y + 100, "enemyTauro");
    enemyTauro.setOrigin(0.5, 0.5);
    enemyTauro.setScale(0.55, 0.55);
    enemyTauro.direccion = 0;
    enemyTauro.setSize(36,36);
    enemyTauro.speed = 100;

    enemyTauro.collocation =new Phaser.Math.Vector2(Math.cos(angulos*i*Math.PI/180), Math.sin(angulos*i*Math.PI/180));
    enemyTauro.collocation.normalize();

    //enemyTauro.setVelocityY(enemyTauro.speed);
  }
}

function destroyEnemy(a, e)
{
  a.disableBody(true, true);
  e.disableBody(true, true);
  arrowList.remove(a);
  enemyTauroList.remove(e);

  finOleada = contarTauro - 1;
}