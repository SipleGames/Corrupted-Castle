//nombre para colocar portal->Portal
var player;
var tauro;
var vol;
var portal;
var contadorArrow = 0;
var vidas;
var maxHearts;
var x;
var y;
var i;
var eventoBola;
var playermuerto = false;
var bossmuerto = false;
var KeyA, KeyO, KeyW, KeyS, KeySpace, KeyD, KeyV, KeyP, KeyV;
var KeyL, Key1, Key2, Key3, Key4, Key5;
var circuloBoss, circuloEnemigo;
var arrowList;
var bolasList, bolasEnergia;
var emyMovLi, enemyTauroList;
var text;
var casilla1 = false;
var casilla2 = false;
var casilla3 = false;
var casilla4 = false;
var casilla5 = false;
var inventory;
var volHealth = 40;
var potionsList, potionCasilla, collectArrowList;
var numPotions = 0;
var numApples = 0;
var numArrows = 0;
var randomX, randomY;
var appleList;
var Portal;
var tauros;


class Cueva extends Phaser.Scene{

  
constructor()
{
  super({key: "Cueva"})
}


preload() {

  //Personaje
    this.load.spritesheet('hero', 'game/assets/character/animMov.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('roll', 'game/assets/character/Character_Roll.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('atack', 'game/assets/character/swordt.png', { frameWidth: 32, frameHeight: 32 });

  //Enemigo
    this.load.spritesheet('enemyTauro', 'game/assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});
    this.load.image('boss', 'game/assets/enemies/boss1.png');
    this.load.spritesheet('deathParticlesBlue', 'game/assets/particulas/deathParticlesBlue.png', {frameWidth: 128, frameHeight: 128});


  //Disparoboss
    this.load.image('bolaenergia', 'game/assets/enemies/bola.png');

  //Mapa
    this.load.tilemapTiledJSON('map', 'game/assets/mapa/cueva.json');
    this.load.image('tiles', 'game/assets/tiles/[Base]BaseChip_pipo16x16.png');
    this.load.image('sombras', 'game/assets/tiles/[A]Wall-Up_Dungeon1_pipo.png');
    this.load.image('portal', 'game/assets/portal/portal.png');

  //Flechas
    this.load.atlas('atlas', 'game/assets/arrow/arrow.png', 'game/assets/arrow/arrow.json');

  //Inventario
    this.load.image('pocion', 'game/assets/inventario/pocion.png');
    this.load.image('manzana', 'game/assets/inventario/manzana.png');
    this.load.image('arrow', 'game/assets/inventario/left.png');
    this.load.image('inventory', 'game/assets/inventario/inventario.png');

  //Corazones
    this.load.image('heart', 'game/assets/health/heart.png');
    this.load.image('heartempty', 'game/assets/health/border.png')
}

create() {
  //TILEMAP
  const map = this.make.tilemap({ key:"map" });
  const tileset = map.addTilesetImage("[Base]BaseChip_pipo16x16", "tiles");
  const sombra = map.addTilesetImage("[A]Wall-Up_Dungeon1_pipo", "sombras");

  const Techo = map.createLayer("Techo", tileset, 0, 0);
  const Agujero = map.createLayer("Agujero", tileset, 0, 0);
  const Piedras = map.createLayer("Piedras", tileset, 0, 0);
  const Mundo = map.createLayer("World", tileset, 0, 0);
  const Below = map.createLayer("Suelo", tileset, 0, 0);
  Below.setDepth(-1);
  Techo.setDepth(1);
  Mundo.setCollisionByProperty({ collides: true });
  Techo.setCollisionByProperty({ collides: true });
  Agujero.setCollisionByProperty({ collides: true });
  Piedras.setCollisionByProperty({ collides: true });
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
  enemyTauroList = this.physics.add.group()
  for (var i = 0; i < 15; i++)
    {
      randomX = Phaser.Math.Between(0, 3128);
      randomY = Phaser.Math.Between(0, 3157);
      tauro = enemyTauroList.create(randomX, randomY, 'Tauro2');
      tauro.setScale(0.6);
      tauro.velocidad = 100;  
      circuloEnemigo = new Phaser.Geom.Circle(tauro.x, tauro.y, 256);
      tauro.direccion = -1;
    }
  //Boss
  vol = this.physics.add.sprite(900, 1500, 'boss').setScale(0.15).setSize(600,600)
  circuloBoss = new Phaser.Geom.Circle(vol.x, vol.y, 400);

  //Grupos
  arrowList = this.physics.add.group(); 
  bolasList = this.physics.add.group();
  potionsList = this.physics.add.group();
  appleList = this.physics.add.group();
  collectArrowList = this.physics.add.group();
  player.setCollideWorldBounds(true);
  
  /*debugGraphics = this.add.graphics().setAlpha(0.7);
	Mundo.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
	});*/

  //Inventario 
  inventory = this.add.image(690, 30, 'inventory').setScrollFactor(0);

  //Colision mundo
  this.physics.add.collider(enemyTauroList, Mundo, cambiar, null, this);
  this.physics.add.collider(arrowList, Mundo);
  this.physics.add.collider(arrowList, Techo);
  this.physics.add.collider(arrowList, Piedras);
  this.physics.add.collider(Mundo, player);
  this.physics.add.collider(Techo, player);
  this.physics.add.collider(Piedras, player);
  this.physics.add.collider(Agujero, player, playerdie, null, this);
  this.physics.add.collider(Techo, enemyTauroList);
  this.physics.add.collider(Piedras, enemyTauroList);
  this.physics.add.collider(Mundo, vol);
  this.physics.add.collider(Techo, vol);
  this.physics.add.overlap(portalCampo, player, changeCampo, null, this);

//colision
  this.physics.add.overlap(arrowList, vol, destroyBoss, null, this);
  this.physics.add.overlap(player, enemyTauroList, shake, null, this);
  this.physics.add.overlap(player, bolasList, playerdie, null, this);
  this.physics.add.overlap(arrowList, enemyTauroList, destroyEnemy, null, this);
  this.physics.add.overlap(player, potionsList, takePotion, null, this);
  this.physics.add.overlap(player, appleList, takeApple, null, this);
  this.physics.add.overlap(player, collectArrowList, takeArrow, null, this);

  //CAMARA
	this.cameras.main.setBounds(0, 0, 3200, 3200);
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
  this.text = this.add.text(32, 32).setScrollFactor(0).setFontSize(16).setColor('#ffffff');
    text = this.add.text(750, 32);
    maxHearts = 3;
    volHealth = 40;
    randomX;
    randomY;

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
    KeyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);

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

    //Animaciones idle
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

  //particulas
  this.anims.create({
    key: "enemyParticlesBlue",
    frames: this.anims.generateFrameNumbers('deathParticlesBlue', {start: 0, end: 14}),
  });
  
   

}

update(time, delta) {


for (i = 0; i < enemyTauroList.getChildren().length; i++)
  {
    emyMovLi = enemyTauroList.getChildren()[i];

    if(circuloEnemigo.contains(player.x, player.y)){
      this.physics.moveTo(emyMovLi, player.x, player.y, tauro.velocidad, 10);
    
      if (player.x < tauro.x && tauro.body.setVelocityX >= 0) 
        tauro.body.setVelocityX = -150;
        
    }
    else if (player.x > tauro.x && tauro.body.setVelocityX <= 0) {
        tauro.body.setvelocityX = 150;
    }
  
  }

  /*for(var i = 0; i < 9; i++)
  { 
    tauro.body.setVelocityX(tauro.direccion * tauro.velocidad); 

    if(circuloEnemigo.contains(player.x, player.y)){
      this.physics.moveTo(tauro, player.x, player.y);
    
      if (player.x < tauro.x && tauro.body.setVelocityX >= 0) 
        tauro.body.setVelocityX = -150;
        
    }
    else if (player.x > tauro.x && tauro.body.setVelocityX <= 0) {
        tauro.body.setvelocityX = 150;
    }
  }*/

  if(circuloBoss.contains(player.x, player.y) && !bossmuerto)
  {
      this.physics.moveTo(vol, player.x, player.y);
      bossDispara();
      this.physics.moveTo(bolasEnergia, player.x, player.y);
      
  }


  //Pasar datos a la BBDD
  if (KeyV.isDown)
    {
      savedatabase();
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
  if (casilla2)
    {
      if (Phaser.Input.Keyboard.JustDown(Key2))
      {
        if (maxHearts != 3 && numApples > 0)
        {
          maxHearts = maxHearts + 1;

          numApples = numApples - 1;
        }
        
        if (numApples == 0)
        {
          casilla2 = false;
          appleCasilla.destroy();
        }
      }
    }

    this.text.setText([
      'vidas: ' + maxHearts,
      'VidaBoss: ' + volHealth,
      'playerX: ' + player.x,
      'playerY: ' + player.y,
      'pociones: ' + numPotions,
      'apples: ' + numApples
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
  enemyTauroList.remove(e);

  randomNum = Math.floor(Math.random() * 6) + 1;

  if (randomNum == 1)
  {
    potions = potionsList.create(e.x, e.y, 'pocion');
  }
  else if (randomNum == 3)
  {
    apple = appleList.create(e.x, e.y, 'manzana');
  }
  else if (randomNum == 5)
  {
    collectArrow = collectArrowList.create(e.x, e.y, 'arrow');
    collectArrow.setScale(0.10, 0.10);
  }

  particlesDeath = this.add.sprite(e.x, e.y, 'deathParticlesBlue');
  particlesDeath.play('enemyParticlesBlue');
}

function destroyBoss(a, v)
{
  
  a.disableBody(true, true);
  arrowList.remove(a);
  volHealth = volHealth - 1;
   if(volHealth = 0)
   {
    vol.destroy(v)
    particlesDeath = this.add.sprite(v.x, v.y, 'deathParticlesBlue');
    particlesDeath.play('enemyParticlesBlue');
    bossmuerto = true;
   }


  
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

  maxHearts = maxHearts - 1;
    
}

function playerdie()
{
  player.disableBody(true, true);
  playermuerto = true;
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
function cambiar()
{
  if(tauro.direccion = 1){tauro.direccion = 1}
  else{tauro.direccion = -1}
  
}
function spawn(t){
  if (this.physics.add.collider(enemyTauroList, Techo) || this.physics.add.collider(enemyTauroList, Mundo)) 
  {
    enemyTauroList.remove(t);
    enemyTauroList.create(randomX, randomY, 'Tauro2');
  }

}

function acaboboost(){player.speed = 175;}

function bossDispara(){
   for (i = 0; i < 1; i++)
  {
    bolasEnergia = bolasList.create(vol.x, vol.y, 'bolaenergia').setScale(0.05).setSize(100,100);
    bolasEnergia.setVelocity(bolasEnergia.speed);
    bolasEnergia.speed = 200;
  }
  
    

    
}

function boladesaparece(b){
  b.disableBody(true, true);
  bolasList.remove(b);

  
}

function takePotion(pl, po)
{
  po.disableBody(true, true);
  potionsList.remove(po);

  numPotions = numPotions + 1;

  if (numPotions == 1)
  {
    potionCasilla = this.add.image(618, 35, 'pocion').setScrollFactor(0);
    potionCasilla.setScale(2);
  }
  
  casilla1 = true;
}

function takeApple(pl, ap)
{
  ap.disableBody(true, true);
  appleList.remove(ap);

  numApples = numApples + 1;

  if (numApples == 1)
  {
    appleCasilla = this.add.image(654, 35, 'manzana').setScrollFactor(0);
    appleCasilla.setScale(2);
  }
  
  casilla2 = true;
}

function takeArrow(pl, ar)
{
  ar.disableBody(true, true);
  collectArrowList.remove(ar);

  numArrows = numArrows + 1;

  if (numArrows)
  {
    arrowCasilla = this.add.image(689, 35, 'arrow').setScrollFactor(0);
    arrowCasilla.setScale(0.20, 0.20);
    arrowCasilla.setSize(10, 14);
  }

  casilla3 = true;
}
function changeCampo()
{
  window.location.assign("http://localhost/CorruptedCastle/web/game.html");
  this.scene.remove("Campo");
  this.scene.remove("Castillo");
}

function savedatabase()
{
  var directions = player.direccion;
  var vida = maxHearts;
  var positionx = player.x;
  var positiony = player.y
  var manzanas = numApples;
  var pociones = numPotions;
  var flechas = numArrows;

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
  datos = 'directions=' + directions + '&vida=' + vida + '&positionx=' + positionx + '&positiony=' + positiony + '&manzanas=' + manzanas + '&pociones=' + pociones + '&flechas=' + flechas;
  // Debug
  console.log(datos);
  xhr.send(datos); 
}