var config={
    type:Phaser.AUTO,
    width:800,
    height:600,
    backgroundColor: '#000000',
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},
            debug:true
        }
    },
    scene:[Charge]
};

var game=new Phaser.Game(config);