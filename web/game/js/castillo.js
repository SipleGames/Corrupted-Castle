//Teclas
var KeyA;
var KeyW;
var KeyS;
var KeySpace;
var KeyD;
var KeyV;
var KeyP;
var KeyO;
var Key1, Key2, Key3, Key3, Key4, Key5;
//variables "humanas"
var player;
var vidas;
var npc1, npc2, npc3
var emyMovLi;
//Listas
var arrowList;
var enemyTauroList;
var potionsList;
var appleList;
var llavesList;
var collectArrowList;
var text;
//contadores o nums
var contadorArrow = 0;
var contadorTauro = 0;
var numTauro = 0;
var contarTauro = numTauro;
var finOleada = 0;
var numPotions = 0;
var numApples = 0;
var numLlaves = 0;
var numArrows = 8;
var randomX;
var randomY;
var Casilla1 = false;
var Casilla2 = false;
var Casilla3 = false;
var Casilla4 = false;
//otros
var exit;
var chestsObj;


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
      this.load.spritesheet('atack', 'game/assets/character/swordt.png', { frameWidth: 32, frameHeight: 32 });

      //Enemigo
      this.load.spritesheet('enemyTauro', 'game/assets/enemies/tauro.png', {frameWidth: 50, frameHeight: 72});
      this.load.spritesheet('deathParticlesBlue', 'game/assets/particulas/deathParticlesBlue.png', {frameWidth: 128, frameHeight: 128});
      
      //NPCs
      this.load.spritesheet("caballero1", "game/assets/npcs/tiles/Soldier/Soldier_01-1.png", {frameWidth: 32, frameHeight: 32});
      this.load.spritesheet("caballero2", "game/assets/npcs/tiles/Soldier/Soldier_02-1.png", {frameWidth: 32, frameHeight: 32});
      this.load.spritesheet("caballero3", "game/assets/npcs/tiles/Soldier/Soldier_03-1.png", {frameWidth: 32, frameHeight: 32});

      //Portal
      this.load.image("portal", "game/assets/portal/portal.png");


      //Inventario
      this.load.image('inventory', 'game/assets/inventario/inventario.png');
      this.load.image('pocion', 'game/assets/inventario/pocion.png');
      this.load.image('manzana', 'game/assets/inventario/manzana.png');
      this.load.image('arrow', 'game/assets/inventario/left.png');
      this.load.image("llave", "game/assets/inventario/keyFragment.png");
  }


  create()
  {
    //Inventario
    inventory = this.add.image(690, 30, 'inventory').setScrollFactor(0)
    inventory.setDepth(2);
   
    //Tiled
      const map = this.make.tilemap({ key: "mapa" });
      const tileset = map.addTilesetImage("[Base]BaseChip_pipo", "tiles");

      const belowLayer = map.createLayer("Bot", tileset);
      const worldLayer = map.createLayer("top", tileset);
      const aboveLayer = map.createLayer("superficie", tileset);

      belowLayer.setDepth(-3);
      worldLayer.setCollisionByProperty({collides:true});
      aboveLayer.setDepth(0);

      //chests
    /*const chests = this.physics.add.staticGroup();
    const chestsLayer = map.getObjectLayer("Chests");
    chestsLayer.objects.forEach(chestObj => {
     
    });*/

   
    //Player
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "hero");
    player.setOrigin(0.5);
    player.setScale(1.5);
    player.setDepth(-1);
    player.direccion = 0;
    player.setSize(10,14);
    player.speed = 175;
    player.speedRoll = 400;

    //NPCs
    const NPC1 = map.findObject("NPC1", obj => obj.name === "NPC1");
    npc1 = this.physics.add.sprite(NPC1.x, NPC1.y, "caballero1");

    this.anims.create({
        key: 'idleDownNPC1',
        frames: [{ key: 'caballero1', frame: 1 }],
        frameRate: 10
      });

    const NPC2 = map.findObject("NPC2", obj => obj.name === "NPC2");
    npc2 = this.physics.add.sprite(NPC2.x, NPC2.y, "caballero2");

    this.anims.create({
        key: 'idleDownNPC2',
        frames: [{ key: 'caballero2', frame: 1 }],
        frameRate: 10
      });

    const NPC3 = map.findObject("NPC3", obj => obj.name === "NPC3");
    npc3 = this.physics.add.sprite(NPC3.x, NPC3.y, "caballero3");

    this.anims.create({
        key: 'idleDownNPC3',
        frames: [{ key: 'caballero3', frame: 1 }],
        frameRate: 10
      });

    //Portal
    const exit = map.findObject("Objects", obj => obj.name === "Exit");
    var portal = this.physics.add.sprite(exit.x, exit.y, "portal");
    portal.setOrigin(0.5);
    portal.setScale(0.2);
    portal.setDepth(-1);

    this.physics.add.collider(worldLayer, player);

    //Grupos
    arrowList = this.physics.add.group();
    enemyTauroList = this.physics.add.group();
    potionsList = this.physics.add.group();
    appleList = this.physics.add.group();
    collectArrowList = this.physics.add.group();
    llavesList = this.physics.add.group();


    //Colides
    this.physics.add.overlap(arrowList, enemyTauroList, destroyEnemys, null, this);
    this.physics.add.overlap(player, enemyTauroList, enemyDies, null, this);
    this.physics.add.overlap(player, potionsList, takePotion, null, this);
    this.physics.add.overlap(player, appleList, takeApple, null, this);
    this.physics.add.overlap(player, collectArrowList, takeArrow, null, this);
    this.physics.add.overlap(player, llavesList, takeKey, null, this);

    this.physics.add.collider(belowLayer, enemyTauroList);
    this.physics.add.collider(worldLayer, enemyTauroList);
    this.physics.add.collider(aboveLayer, enemyTauroList);

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


    ///TECLAS

      KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
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

     //Animacion particulas muerte
      this.anims.create({
        key: "enemyParticlesBlue",
        frames: this.anims.generateFrameNumbers('deathParticlesBlue', {start: 0, end: 14}),
      });

      //Animacion enemigos a mele
      this.anims.create({
        key: "enemyDown",
        frames: this.anims.generateFrameNumbers('enemyTauro', {start: 0, end: 3}),
        frameRate: 5,
        repeat: -1
      });


      //texto
      this.text = this.add.text(32, 32).setScrollFactor(0).setFontSize(16).setColor('#ffffff');
      text = this.add.text(750, 32);
      text.setDepth(3);

      //CAMPO
      this.scene.add("Campo", new Campo); 

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


  update()
  {   

    if (KeyV.isDown)
    {
      saveDB();
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



    //Interaciones con inventario
    if (Casilla1)
    {
      if (Phaser.Input.Keyboard.JustDown(Key1))
      {
        this.time.addEvent({delay: 6000, callback: potionEnds})
        player.speed = 400;

        if (numPotions > 0)
        {
          numPotions = numPotions - 1;
        }

        if (numPotions == 0)
        {
          Casilla1 = false;
          potionsCasilla.destroy();
        }
      }
    }
    if (Casilla2)
    {
      if (Phaser.Input.Keyboard.JustDown(Key2))
      {
        if (vidas != 3 && numApples > 0)
        {
          vidas = vidas + 1;

          numApples = numApples - 1;
        }
        
        if (numPotions == 0)
        {
          
          Casilla2 = false;
          appleCasilla.destroy();
        }
      }
    }

    if (Casilla3)
    {
      if (numArrows == 0)
      {
          Casilla3 = false;
          //arrowCasilla.destroy();
      }
      else
      {
        arrowCasilla= this.add.image(689, 35, 'arrow').setScrollFactor(0);
        arrowCasilla.setScale(0.20, 0.20);
        arrowCasilla.setSize(10, 14);
        arrowCasilla.setDepth(7);
      }
    }

    if (Casilla4)
    {
      if(numLlaves == 0)
      {
        Casilla4 = false;
        llavesCasilla.destroy();
      }

      if(Phaser.Input.Keyboard.JustDown(Key4))
      {
         player.x = 100;
         player.y = 100;
      }
    }


    this.text.setText([
      'vidas: ' + vidas,
      'numTauro: ' + numTauro,
      'finOleada: ' + finOleada,
     //'randomX: ' + enemyTauro.x,
     //'randomY: ' + enemyTauro.y,
      'playerX: ' + player.x,
      'playerY: ' + player.y,

    ]);

  
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

function enemyDownCreation()
{
  finOleada = numTauro;

  for (i = 0; i < numTauro; i++)
  {
    randomX = Phaser.Math.Between(0, 3128);
    randomY = Phaser.Math.Between(0, 3157);
    enemyTauro = enemyTauroList.create(randomX, randomY, "enemyTauro");
    enemyTauro.setOrigin(0.5);
    enemyTauro.setScale(0.55);
    enemyTauro.direccion = 0;
    enemyTauro.setSize(40);
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

function destroyEnemys(a, e)
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

  else if (randomNum == 2)
  {
    llaves = llavesList.create(e.x, e.y, 'llave');
    llaves.setScale(0.075);
  }
  
  else if (randomNum == 3)
  {
    apple = appleList.create(e.x, e.y, 'manzana');
  }
  else if (randomNum == 5 || 6)
  {
    collectArrow = collectArrowList.create(e.x, e.y, 'arrow');
    collectArrow.setScale(0.10, 0.10);
  }

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



function changeToCampo()
{
this.scene.start("Campo");
//this.scene.launch("Campo");
this.scene.remove("Castillo");
}


function takePotion(pl, po)
{
  po.disableBody(true, true);
  potionsList.remove(po);

  numPotions = numPotions + 1;

  if (numPotions == 1)
  {
    potionsCasilla = this.add.image(618, 35, 'pocion').setScrollFactor(0);
    potionsCasilla.setScale(2);
  }
  
  Casilla1 = true;
}

function takeKey(pl, ll)
{
  ll.disableBody(true, true);
  llavesList.remove(ll);

  numLlaves = numLlaves + 1;

  if (numLlaves == 1)
  {
    llavesCasilla = this.add.image(725, 35, 'llave').setScrollFactor(0);
    llavesCasilla.setScale(0.13);
    llavesCasilla.setDepth(7);
  }
  
  Casilla4 = true;
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
  
  Casilla2 = true;
}

function takeArrow(pl, ar)
{
  ar.disableBody(true, true);
  collectArrowList.remove(ar);

  numArrows = numArrows + 1;

  Casilla3 = true;
}

function potionEnds()
{
  player.speed = 200;
}

function saveDB()
{
   //Tabla jugador
  var directions = player.direccion;
  var vida = vidas;
  var positionx = player.x;
  var positiony = player.y

  //Tabla inventario
  var pociones = numPotions;
  var manzanas = numApples;
  var flechas = numArrows;
  var llaves = numLlaves;

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
  datos = 'directions=' + directions + '&vida=' + vida + '&positionx=' + positionx + '&positiony=' + positiony + '&pociones=' + numPotions + '&manzanas=' + numApples + '&flechas=' + numArrows + '&llaves=' + numLlaves;
  // Debug
  console.log(datos);
  xhr.send(datos); 
}