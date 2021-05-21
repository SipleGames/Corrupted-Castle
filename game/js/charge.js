class Charge extends Phaser.Scene{

  constructor()
  {
    super({key: "Charge", active: true});
  }

  create(){
    this.scene.add("Castillo", new Castillo);
  }
  update(){
    this.scene.start("Castillo");
  }
}