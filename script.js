let canvas = document.getElementById("canvas");
let gameover= document.getElementById("lose");
let scorenumber= document.getElementById("scorenumber");
let context = canvas.getContext("2d");
let yspeed=5; 
let height=50;
let scrollcounter, cameraY, current, mode, speed;
function resize(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    center=(canvas.height-600)
}
window.addEventListener('resize', resize)
resize()
let boxes= [];
boxes[0]={
    x:(canvas.width/2)-100,
    y:300,
    width:200,
};
let remains = {
    x:0,
    width:0
};
function box(){
    boxes[current]={
        x:0,  
        y:(current+10)*height,
        width:boxes[current-1].width,
    }
};
function gameOver(){
    document.getElementById("text").style.display="block"
    document.getElementById('finalscore').innerHTML=scorenumber.innerHTML;
    gameover.style.display='flex';
    mode='gameOver'
};
function move(){
    if(mode!='gameOver'){
        context.clearRect(0,0, canvas.width, canvas.height);
        scorenumber.innerHTML= current -1;
        for(let n=0; n<boxes.length;n++){
            let box= boxes[n];
            context.fillStyle = 'rgb('+ n*16+','+n*16+','+n*16+')';
            context.fillRect(box.x,600-box.y+cameraY +center,box.width, height)
        }
        context.fillStyle='yellow'
        context.fillRect(remains.x,600-remains.y+cameraY+center, remains.width,height)
        if(mode=='bounce'){
            boxes[current].x = boxes[current].x + speed;
            if(speed>0 && boxes[current].x +boxes[current].width > canvas.width){
                speed=-speed;
            }
            else if(speed<0 && boxes[current].x <0){
                speed=-speed;
            }
        }
        if(mode=='fall'){
            boxes[current].y = boxes[current].y - yspeed;
            if(boxes[current].y == boxes[current-1].y+height){
                mode='bounce';   
                let excess= boxes[current].x -boxes[current-1].x;
                if(Math.abs(excess)>=boxes[current].width){
                  gameOver();
                }
                remains={
                    y: boxes[current].y,
                    width: excess,
                }
                if(boxes[current].x>boxes[current-1].x){ //--.dropped rught
                    boxes[current].width=boxes[current].width-excess
                    remains.x=boxes[current].x+boxes[current].width
                }
                else{
                    remains.x=boxes[current].x - excess;
                    boxes[current].width=boxes[current].width +excess;
                    boxes[current].x=boxes[current-1].x;
                }

                if(speed>0){
                    speed+=0.7;
                }
                else{
                    speed-=0.7 ;
                }
                current++;
                scrollcounter= height;
                box()
            }
        }
        remains.y=remains.y-yspeed;
        if (scrollcounter){
            cameraY++;
            scrollcounter--;
        }
    }
    window.requestAnimationFrame(move)
};
function restart(){
    gameover.style.display='none';
    boxes.splice(1, boxes.length-1);
    mode='bounce';
    cameraY=0;
    scrollcounter=0;
    speed=2;
    current=1
    box();
    remains.y=0
}
canvas.onpointerdown = function(e){
    if(mode=='gameOver'){
        restart()
    }
    else{
        if(mode == 'bounce'){
            mode='fall'
        }
    }
}

restart()
move()