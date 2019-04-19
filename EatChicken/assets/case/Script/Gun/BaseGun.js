

var BaseGun = cc.Class({
    extends: cc.Component,

    properties: {
        ShitSound:"",
        Name:"",
        Power : 1, //枪的威力
        Count : 1, //每次射击的子弹数,
        Rotate : 45, //旋转的最大值
        //RotateSpeed : 10,//旋转的速率
        Distance : 2000,//瞄准距离 
        //Direction : 0 ,//方向 0左 1右
        Rcoil : 20, //后座力

        _toalCount: 10,//当前子弹数量
        TotalCount: 10,//子弹数量，
        
        GunSkin:cc.Sprite, //皮肤
        ImgRound:cc.Sprite,
        graphics:cc.Graphics,
        BulletNode:cc.Node, //子弹节点生成位置
        Bullet:cc.Node, //子弹,

        FireTx:cc.Node,
    },

    onLoad() {
        this.RotateSpeed = 60;
        this.BulletPreba = null; //子弹预制体
        this.MoveState = "上";
        this.drawLine();
        this.ImgRound.node.width = 2 * this.Distance;
        this.ImgRound.node.height = 2 * this.Distance;
        this.width2 =  this.BulletNode.width/2;
        this.isRotation = true;
    },

    drawLine()
    {
        this.graphics.moveTo(0,0);
        this.graphics.lineTo(-this.Distance,0);
        this.graphics.stroke();
    },
    //暂停瞄准
    PaseAimed()
    {
        this.isRotation = false;
        this.ImgRound.fillRange = 0;
        this.graphics.clear();
    },
    //继续瞄准
    AgainAimed()
    {
        this.isRotation = true;
        //this.GunSkin.node.rotation = 0;
        this.drawLine();
        this.MoveState == "上"
    },

    PlayFireTx()
    {
       
        if(this.FireTx!=null)
        {
            this.FireTx.getComponent(cc.Animation).play("Fire2");
        }
    },

    Shit(isEnemy = false)
    {   
        if(this._toalCount>0)
        {
            var targetpos = this.BulletNode.getPosition();
            var rotation = this.GunSkin.node.rotation;
            var index = 0;
            this.schedule(()=>
            {
                index++;
                rotation = this.GunSkin.node.rotation;
                var bullet = cc.instantiate(this.Bullet);
                bullet.parent = this.node;
                bullet.setPosition(targetpos);
                bullet.getComponent("Bullet").ShitBullets(this.Power,rotation);
                if(this.ShitSound != "")
                {   
                    GameGlobal.SoundManager.PlaySound(this.ShitSound);
                }
                this.PlayFireTx();
                if(index >= this.Count)
                {
                    this.PaseAimed();
                    var x = this.Rcoil; 
                    var y = Math.tanh(rotation) * x;
                    var m =  cc.moveBy(0.05,x,-y);
                    var m1 =  cc.moveBy(0.05,-x,y);
                    var r = cc.rotateBy(0.1,0);
                    var r1 = cc.rotateTo(0.2,0);
                    var callfun = cc.callFunc(()=>
                    {
                        
                        this.AgainAimed();
                    });
                    this.GunSkin.node.runAction(cc.sequence(m,m1,r,r1));
                }
            }, 0.05,this.Count);
            if(!isEnemy)
            {
                if(this._toalCount!= 9999)
                {
                    this._toalCount--;
                    if(GameControl.player.isSelfGun)
                    {
                        GameGlobal.SeverManager.UserInfo.CurrentBullet = this._toalCount;
                    }
                    
                }
                else
                {
                    if(GameControl.player.isSelfGun)
                    {
                        GameGlobal.SeverManager.UserInfo.CurrentBullet = 9999;
                    }
                }
                
                this.scheduleOnce(()=>
                {
                    if(GameControl.player.isDeath)
                        return;
                    this.AgainAimed();
                }, 1.0);
                
            }
            
        }
    },

    setBulletCount(Count) 
    {
        if(Count == 9999)
        {
            this._toalCount = Count;
            UIGameing.setBulletCount("∞");
        }
        else
        {
            if(Count == 1000||Count > this.TotalCount)
            {
                Count = this.TotalCount;
            }
            this._toalCount = Count;
            UIGameing.setBulletCount(Count);
        }
    },

    update(dt)
    {
        if(!this.isRotation)
            return;
        if(this.MoveState == "上")
        {
            this.GunSkin.node.rotation += dt*this.RotateSpeed;
            this.ImgRound.fillRange += dt*this.RotateSpeed/360;
        }
        else if(this.MoveState == "下")
        {
            this.GunSkin.node.rotation -= dt*this.RotateSpeed;
            this.ImgRound.fillRange -= dt*this.RotateSpeed/360;
        }
        if(this.GunSkin.node.rotation > this.Rotate)
        {
            this.MoveState = "下";
        }
        else if(this.GunSkin.node.rotation < 0)
        {
            this.MoveState = "上";
        }
    },

    
});
