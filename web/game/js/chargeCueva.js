class ChargeCueva extends Phaser.Scene{

  constructor()
  {
    super({key: "ChargeCueva", active: true});
  }

  create(){
    this.scene.add("Cueva", new Cueva);
  }
  update(){
    this.scene.start("Cueva");
  }
}