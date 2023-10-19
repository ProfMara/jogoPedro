var personagem, personagemImg, morteImg
var fantasma, fantasmaImg
var esqueleto, esqueletoImg
var boss, bossImg
var flecha, flechaImg, flechas
var pocao, pocaoImg, pocoes
var chaoImg
var proj, projImg, projs
var bossproj, bossprojImg, bossprojs
var fantasmas=[]
var esqueletos=[]
var paredeE, paredeD, paredeC, paredeB, paredes
var vidas, zc, uc, dc, tc
var vidaBoss=10
var cd=0
var inv=0
var potionSpawned=true
var onda1fim=false
var onda2fim=false

var onda1 = 10
var onda2 = 0
var onda3 = 0

var countdown=5
var countdown2=5
var countdown3=5


var vida=3
var esq=false
var dir=false
var cim=false
var bai=false
var pos = [
    {x:420,y:300},
    {x:780,y:300},
    {x:420,y:1050},
    {x:780,y:1050},
    {x:150,y:600},
    {x:150,y:840},
    {x:1050,y:600},
    {x:1050,y:840},
]

console.log(vida)

function preload(){
    personagemImg=loadAnimation("wizard1.png","wizard2.png")
    morteImg=loadAnimation("deadwizard.png")
    fantasmaImg=loadAnimation("ghost1.png","ghost2.png")
    esqueletoImg=loadAnimation("skeleton1.png","skeleton2.png")
    bossImg=loadAnimation("boss1.png","boss2.png")
    flechaImg=loadImage("arrow.png")
    chaoImg=loadImage("floor.png")
    projImg=loadImage("proj.png")
    bossprojImg=loadImage("bossproj.png")
    pocaoImg=loadImage("potion.png")
    zc=loadImage("0c.png")
    uc=loadImage("1c.png")
    dc=loadImage("2c.png")
    tc=loadImage("3c.png")
}
function setup() {
    createCanvas(1200,1200);
    personagem = createSprite(600,700)
    personagem.addAnimation("correndo",personagemImg)
    personagem.addAnimation("morte",morteImg)
    paredeC = createSprite(600,220,1200,140)
    paredeB = createSprite(600,1150,1200,140)
    paredeE = createSprite(60,600,120,1200)
    paredeD = createSprite(1140,600,120,1200)
    paredeC.visible=false
    paredeB.visible=false
    paredeE.visible=false
    paredeD.visible=false

    projs=new Group ()
    flechas=new Group()
    pocoes=new Group()
    bossprojs= new Group()

}

function draw() {
    background(chaoImg);
    //códigos que serão executados ao longo de todo o jogo
    controlar()

    if (vida>0){
        mostrarCooldown()
        atirar()
        spawnInimigos()
        moverFantasma()
        esqAtirar()
        handleBoss()
        endWave()
        handlePotion()
    }

    if(cd>0){
        cd--
    }
    if (inv>0){
        inv--
    }

    if(personagem.isTouching(pocoes)){
        if(vida<3){
            pocoes.destroyEach()
            vida++   
        }
    }



    drawSprites();

    personagem.collide(paredeC)
    personagem.collide(paredeB)
    personagem.collide(paredeE)
    personagem.collide(paredeD)



    textAlign("center")
    stroke("black")
    strokeWeight(5)
    fill ("white")
    textSize(30)
    text ("setas para se mover, Espaço para atirar",600,50)
    textSize(20)
    text (onda2+" x: "+mouseX + " y: "+mouseY, mouseX, mouseY-30)
    if(vida==3){
        vidas=image(tc,50,-90,300,300)
    }
    if(vida==2){
        vidas=image(dc,50,-90,300,300)
    }
    if(vida==1){
        vidas=image(uc,50,-90,300,300)
    }
    if(vida==0){
        vidas=image(zc,50,-90,300,300)
        personagem.changeAnimation("morte")
    }


}

function controlar(){
    if(vida>0){
        if(keyDown(UP_ARROW)){
            personagem.y-=10
            cim=true
            bai=false
            esq=false
            dir=false
        }
        if(keyDown(DOWN_ARROW)){
            personagem.y+=10 
            cim=false
            bai=true
            esq=false
            dir=false
        }
        if(keyDown(LEFT_ARROW)){
            personagem.x-=10 
            cim=false
            bai=false
            esq=true
            dir=false
        }
        if(keyDown(RIGHT_ARROW)){
            personagem.x+=10
            cim=false
            bai=false
            esq=false
            dir=true
        }
    }

}

function handlePotion(){
    if(potionSpawned==false){
        pocao=createSprite(random(170,1030),random(370,1060))
        pocao.addImage(pocaoImg)
        pocoes.add(pocao)
        potionSpawned=true
    }
}

function spawnInimigos(){
    if(onda1>0&&frameCount%100==0){
        spawnFantasma()
    }
    if(onda2>0){
        if(frameCount%75==0){
            spawnFantasma()
        }
        if(frameCount%200==0){
            spawnEsqueleto()
        }
        
    }
    if(onda3>0){
        spawnBoss()
    }
}

function spawnFantasma(){
    var i = Math.round(random(0,7))
    var x = pos[i].x
    var y = pos[i].y
    fantasma=createSprite(x,y)
    fantasma.addAnimation("correndo",fantasmaImg)
    fantasmas.push(fantasma)

    onda1--
    onda2--
}



function moverFantasma(){

 if(frameCount%5){
     for(var i = 0; i<fantasmas.length; i++){
            if(personagem.x > fantasmas[i].x){
                fantasmas[i].velocityX = 3
            }else{
                fantasmas[i].velocityX=-3
            }
            if(personagem.y>fantasmas[i].y){
                fantasmas[i].velocityY=3
            }else{
                fantasmas[i].velocityY=-3
             }
        }
    }
    personagem.overlap(fantasmas,(p,ghost)=>{
        if (vida>0){
            ghost.remove()
            if(inv==0){
            vida-- 
            inv=20
            }
            
        }

    }  
    )

}

function spawnEsqueleto(){
    var i = Math.round(random(0,7))
    var x = pos[i].x
    var y = pos[i].y
    esqueleto=createSprite(x,y)
    esqueleto.addAnimation("correndo",esqueletoImg)
    esqueletos.push(esqueleto)

    onda1--
    onda2--
}

function esqAtirar(){

    for(var i=0; i<esqueletos.length;i++){
        if(esqueletos[i]!=false){
            if (frameCount%150==0){
                flecha=createSprite(esqueletos[i].x,esqueletos[i].y)
                flecha.addImage(flechaImg)
        
                if(esqueletos[i].x==150){
                    flecha.velocityX=3
                    flecha.rotation=180
                }
                 if(esqueletos[i].x==1050){
                    flecha.velocityX=-3

                 }
                if(esqueletos[i].y==300){
                      flecha.velocityY=3
                      flecha.rotation=270
                }
                if(esqueletos[i].y==1050){
                    flecha.velocityY=-3
                    flecha.rotation=90
                }
                flechas.add(flecha)
            }

        }
    }

    personagem.overlap(flechas,(p,flecha)=>{
        flecha.destroy()
        vida--
    })
    
}

function spawnBoss(){
    if(!boss){
        boss=createSprite(780,360)
        boss.addAnimation("correndo",bossImg)
        boss.scale=1.2
    }

}

function handleBoss(){
if(boss){
    if(vida<=0){
        boss.velocityX=0
        boss.velocityY=0
    }
    if(frameCount%5==0){
        if(personagem.x>boss.x){
            boss.velocityX=2
        }else{
            boss.velocityX=-2
        }
        if(personagem.y>boss.y){
            boss.velocityY=2
        }else{
            boss.velocityY=-2
        }         
        
    }
    if(frameCount%50==0){
        bossproj=createSprite(boss.x,boss.y)
        bossproj.addImage(bossprojImg)
        if(boss.x<personagem.x){
            bossproj.velocityX=10
            bossproj.rotation=180
        }
        if(boss.x>personagem.x){
            bossproj.velocityX=-10
        }
        if(boss.y<personagem.y){
            bossproj.velocityY=10
        }
        if(boss.y>personagem.y){
            bossproj.velocityY=-10
        }
        bossprojs.add(bossproj)
    }

    personagem.overlap(bossprojs,(p,proj)=>{
        proj.destroy()
        vida--
    })
    if(personagem.x==boss.x&&personagem.y==boss.y){
        vida--
    }

    boss.overlap(projs,(boss,proj)=>{
        proj.destroy()
        vidaBoss--
    })
    if(vidaBoss>0){
        fill("red")
        rect(boss.x-50,boss.y-90,vidaBoss*10,10)  
    }
    if(vidaBoss==0){
        boss.destroy()
        swal ({
            title: "PARABÉNS!",
            imageUrl:"FIM.png",
            text:"Você conseguiu escapar!"
        })
    }

}
}

function atirar(){
    if(keyDown("space")&&cd==0){
        cd=10
        proj=createSprite(personagem.x,personagem.y)
        proj.addImage(projImg)
        if(dir){
            proj.velocityX=15
        }
        if(esq){
            proj.velocityX=-15
        }
        if(bai){
            proj.velocityY=15
        }
        if(cim){
            proj.velocityY=-15
        }
        if(!cim && !bai && !dir && !esq){
            proj.velocityX=15
        }
        projs.add(proj)
        projs.setLifetimeEach(100)
        
    }

    projs.overlap(fantasmas,(proj,ghost)=>{
        proj.remove()
        ghost.remove()
    })

    for(var i=0; i<esqueletos.length; i++){
        if(esqueletos[i]!=false && projs.isTouching(esqueletos[i])){
            esqueletos[i].destroy()
            esqueletos[i]=false
            projs.destroyEach()
        }
    }


}

function mostrarCooldown(){
    if(cd>0){
        fill("cyan")
        rect(personagem.x-50,personagem.y-80,cd,10)
    }

}

function endWave(){
    fill("red")
    textSize(50)
    strokeWeight(5)

    if (onda1<=0&&countdown>0){
        if(frameCount%50==0){
            countdown-- 
        }
        text("Onda 2 em: "+countdown,450,200)   
    }
    if (countdown==0){
        onda2=15
        countdown2=5 
        if(onda1fim==false){
            potionSpawned=false
        }
        onda1fim=true
        countdown=-1
    }
    if (onda2<=0&&countdown2>0&&onda1fim==true){
        if(frameCount%50==0){
            countdown2-- 
        }
        text("Boss em: "+countdown2,450,200)
    }
    if (countdown2==0){
        onda3=1
        if(onda2fim==false){
            potionSpawned=false
            onda2fim=true
        }
    }
}

function mouseClicked(){

}