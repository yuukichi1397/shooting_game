'use strict';

const DEBUG = false;

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
let myBulleter = [];
let enemy_bulleter = [];
let character;
let coordinate =[];
let wall = new Array(5);
let ene;
let gameFlag = true;

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
    constructor(x,y,directionx,directiony){
        super(x,y,directionx,directiony);
    }
}

class EnemyBullet extends Bullet{
    constructor(x,y,vx,vy){
        super(x,y,vx,vy);
        this.speed = 2;
        this.cnt = 0;
    }

    hit(px, py) {
        if (this.x > px && this.x < px + 20 && this.y > py && this.y < py + 20) {
            if (DEBUG) {
                context.font="15px 'Impact'";
                context.fillStyle="white";
                context.fillText("Hit", 20, 40);
                
            }  
        }
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
        this.life = 1;
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
    break(){
        this.life--;
    }
}

class Enemy extends Rectagle{
    constructor(x,y){
        super(x,y,20,20);
        this.speed=1;
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
    move(chara_x,chara_y){
        if(this.x===chara_x){
        }else if(this.x<chara_x){
            this.directionx++;
        } else {
            this.directionx--;
        }
        if(this.y===chara_y){
        }else if(this.y<chara_y){
            this.directiony++;
        } else {
            this.directiony--;
        }
        this.y+=this.speed*this.directiony;
        this.x+=this.speed*this.directionx;
        if(this.x<0 || this.x+this.width>canvas.width){
            this.x=this.before_x;
        }
        if(this.y<0 || this.y+this.height>canvas.height){
            this.y=this.before_y;
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
        myBulleter[bulletcount%25] = new MyBullet(coordinate[0],coordinate[1],coordinate[2],coordinate[3]);
        character.countdecrement();
    }
}

//敵の弾
let enemy_reload = 0;
function enemy_shot() {
    if (enemy_reload == 0) {
        coordinate = ene.getcoordinate();
        enemy_bulleter.push(new EnemyBullet(coordinate[0], coordinate[1],  0,  1));
        enemy_bulleter.push(new EnemyBullet(coordinate[0], coordinate[1],  1,  0));
        enemy_bulleter.push(new EnemyBullet(coordinate[0], coordinate[1],  0, -1));
        enemy_bulleter.push(new EnemyBullet(coordinate[0], coordinate[1], -1,  0));
        enemy_reload = 10;
    } else {
        enemy_reload--;
    }
    for (let i = 0; i < enemy_bulleter.length; i++) {
        enemy_bulleter[i % 100].hit(character.before_x, character.before_y);
    }

    
    //範囲外の弾を消去

}

//乱数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function gameSet(life){
    if(life>0){
        return;
    }

    cancelAnimationFrame(loopRec);
    context.font="95px 'Impact'";
    context.fillStyle = "white";
    context.fillText("GAME OVER",5,220);
}

function gameClear(){
    cancelAnimationFrame(loopRec);
    context.font="90px 'Impact'";
    context.fillStyle = "yellow";
    context.fillText("GAME CLERE",5,220);
}

let loopRec = null;

function loop() {
    context.clearRect(0, 0, 1280, 720);
    ene.draw();
    character.draw();
    character.move();
    let coordinate = character.getcoordinate();
    ene.move(coordinate[0],coordinate[1]);
    enemy_shot();
    myBulleter.forEach(element=>{element.move();element.draw()});

    enemy_bulleter.forEach(element=>{element.move();element.draw()});

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
        myBulleter.forEach(element2=>{
            if(element.hitTest(element2)){
                myBulleter.splice(myBulleter.indexOf(element2),1);
            }
        })

        enemy_bulleter.forEach(element2=>{
            if(element.hitTest(element2)){
                enemy_bulleter.splice(enemy_bulleter.indexOf(element2),1);
            }
        })
        
        if(element.hitTest(ene)){
            let x = ene.x;
            let y = ene.y;
            if(element.hitTest_x(ene)){
                ene.y=ene.before_y;
            }
            if(element.hitTest_y(ene)){
                ene.x=ene.before_x;
            }
            if(ene.x != x){
                ene.y=y;
                if(element.hitTest_x(ene)){
                    ene.y=ene.before_y;
                }
            }
        }
    }));
    myBulleter.forEach(element=>{
        if(element.hitTest(ene)){
            myBulleter.splice(myBulleter.indexOf(element),1);
            gameFlag=false;
        }
    });

    enemy_bulleter.forEach(element=>{
        if(element.hitTest(character)){
            character.break();
        }
    })

    wall.forEach(element=>element.forEach(element2=>element2.draw()));

    character.update();
    ene.update();

    if (DEBUG) {
        context.font="15px 'Impact'";
        context.fillStyle="white";
        context.fillText("Tama:" + enemy_bulleter.length, 20, 20);
    }

    loopRec = window.requestAnimationFrame(loop);
    if(!gameFlag){
        gameClear();
    }
    gameSet(character.life);
}