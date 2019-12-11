Preload = new class FileLoader{
    constructor(){
    }

    importSprite(path){
        var sprite = new Image();
        sprite.src = path;
        //console.log(sprite);
        return sprite;
    }

}
//list of sprites
var sprites = {
    background: Preload.importSprite('img/bakgrund.png'),
    gift: Preload.importSprite('img/julklapp.png'),
}
