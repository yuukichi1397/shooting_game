'use strict';

let context;
let image = new Image();
image.src = 'main.png';
let image2 = new Image();
image2.src = 'tama.png';
let image3 = new Image();
image3.src = 'wall.png';
let image4 = new Image();
image4.src = 'enemy1.png';

let flag = [];
let bulletcount = 0;
let bulleter = [];
let character;
let coordinate =[];
let wall = new Array(5);
let ene;

class Rectagle{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    hitTest(other) {
        const horizontal = (other.x < this.x + this.width) &&
            (this.x < other.x + other.width);
        const vertical = (other.y < this.y + this.height) &&
            (this.y < other.y + other.height);
        return (horizontal && vertical);
    }
    hitTest_x(other){
        const horizontal = (other.x < this.x + this.width) &&
            (this.x < other.x + other.width);
        return horizontal;
    }
    hitTest_y(other){
        const vertical = (other.y < this.y + this.height) &&
            (this.y < other.y + other.height);
        return vertical;
    }
}

class Wall extends Rectagle{
    constructor(x,y){
        super(x,y,40,40);
    }
    draw(){
        context.drawImage(image3, this.x, this.y);
    }
}

class Bullet extends Rectagle{
    constructor(x, y,directionx,directiony) {
        super(x,y+10,5,5);
        this.directionx = directionx;
        this.directiony = directiony;
        this.speed = 6;
    }

    move(){
        this.x+=this.speed*this.directionx;
        this.y+=this.speed*this.directiony;
    }
    
    draw() {
        context.drawImage(image2, this.x + 5, this.y - 4);
    }
}

class MyBullet extends Bullet{

}

class EnemyBullet extends Bullet{
    constructor(x,y,directionx,directiony){
        super(x,y,directionx,directiony);
    }
    attack(){

    }
}

class Character extends Rectagle{
    constructor(){
        super(2,220,20,20);
        this.speed=4;
        this.count = 25;
        this.directionx=0;
        this.directiony=0;
        this.currentdirectionx=-1;
        this.currentdirectiony=1;
        this.before_x=this.x;
        this.before_y=this.y;
    }
    move(){
        if(flag['w']===true){
            this.directiony--;
        }
        if(flag['s']===true){
            this.directiony++;
        }
        if(flag['a']===true){
            this.directionx--;
        }
        if(flag['d']===true){
            this.directionx++;
        }
        this.y+=this.speed*this.directiony;
        this.x+=this.speed*this.directionx;
        if(character.x<0 || character.x+character.width>canvas.width){
            character.x=character.before_x;
        }
        if(character.y<0 || character.y+character.height>canvas.height){
            character.y=character.before_y;
        }
    }
    update(){
        if(this.directiony || this.directionx){
            this.currentdirectionx=this.directionx;
            this.currentdirectiony=this.directiony;
        }
        this.directiony=0;
        this.directionx=0;
        this.before_x=this.x;
        this.before_y=this.y;
    }
    draw(){
        context.drawImage(image, this.x, this.y);
    }
    getcoordinate(){
        return [this.x,this.y,this.currentdirectionx,this.currentdirectiony];
    }
    getcount(){
        return this.count;
    }
    countdecrement(){
        this.count-=1;
    }
}

class Enemy extends Rectagle{
    constructor(x,y){
        super(x,y,20,20);
        this.speed=4;
        this.directionx=0;
        this.directiony=0;
        this.currentdirectionx=-1;
        this.currentdirectiony=1;
        this.before_x=this.x;
        this.before_y=this.y;
    }
    draw(){
        context.drawImage(image4, this.x, this.y);
    }
    move(){
        if(flag['w']===true){
            this.directiony--;
        }
        if(flag['s']===true){
            this.directiony++;
        }
        if(flag['a']===true){
            this.directionx--;
        }
        if(flag['d']===true){
            this.directionx++;
        }
        this.y+=this.speed*this.directiony;
        this.x+=this.speed*this.directionx;
        if(character.x<0 || character.x+character.width>canvas.width){
            character.x=character.before_x;
        }
        if(character.y<0 || character.y+character.height>canvas.height){
            character.y=character.before_y;
        }
    }
    update(){
        if(this.directiony || this.directionx){
            this.currentdirectionx=this.directionx;
            this.currentdirectiony=this.directiony;
        }
        this.directiony=0;
        this.directionx=0;
        this.before_x=this.x;
        this.before_y=this.y;
    }
    getcoordinate(){
        return [this.x,this.y,this.currentdirectionx,this.currentdirectiony];
    }
    destroy(){
        
    }
}

function shot(bulletcount) {
    if(character.count>0){
        coordinate = character.getcoordinate();
        bulleter[bulletcount%25] = new Bullet(coordinate[0],coordinate[1],coordinate[2],coordinate[3]);
        character.countdecrement();
    }
}

function enemy_shot(bulletcount){

}

function start() {
    let canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    character  = new Character();
    for(let i=0;i<wall.length;i++){
        wall[i]=new Array(5);
    }
    for(let i=0;i<wall.length;i++){
        for(let j=0;j<5;j++){
            wall[i][j] = new Wall(i*80+40,j*80+40);
        }
    }
    
    ene = new Enemy(2,2);

    loop();
}

document.addEventListener('keydown', (e) => {
    flag[e.key]=true;
});
document.addEventListener('keyup', (e) => {
    flag[e.key]=false;
});
document.addEventListener('keypress', (e) => {
    if (e.key == ' ') {
        shot(bulletcount++);
    }
});

function loop() {
    context.clearRect(0, 0, 1280, 720);
    ene.draw();
    character.draw();
    character.move();
    ene.move();
    bulleter.forEach(element=>{element.move();element.draw()});
    wall.forEach(e=>e.forEach(element=>{
        if(element.hitTest(character)){
            let x = character.x;
            let y = character.y;
            if(element.hitTest_x(character)){
                character.y=character.before_y;
            }
            if(element.hitTest_y(character)){
                character.x=character.before_x;
            }
            if(character.x != x){
                character.y=y;
                if(element.hitTest_x(character)){
                    character.y=character.before_y;
                }
            }
        }
        bulleter.forEach(element2=>{
            if(element.hitTest(element2)){
                bulleter.splice(bulleter.indexOf(element2),1);
            }
        })
    }))
    wall.forEach(element=>element.forEach(element2=>element2.draw()));

    character.update();
    ene.update();

    window.requestAnimationFrame(loop);
}