

cc.Class({
    extends: require("Enemy"),

    properties: {
        
    },

    onLoad()
    {
        this._super();
        this.isStartMove = false;
        this.isShake = true;
    },

    update(dt)
    {
        if(this.isStartMove)
        {
            this.moveCoolTimer -= dt;
            if(this.moveCoolTimer<=0)
            {
                this.MoveTarget();
                this.isStartMove = false;
            }
        }
    },
    
    Init()
    {
        this.isStartMove = false;
        this.isShake = true;
        this.moveCoolTimer = 0.3;
        this.Health = 3 * this.player.PlayInfo.Level; 
        this.TotalHealth = this.Health;
        this.isDeath = false;
    },

    DropBlood(PowerCount,isHitHead = false)
    {
        if(this.isDeath)
            return;
        GameControl.HurtLabelAni(PowerCount,cc.v2(this.node.x,this.node.y + 30));
        
        this.Health -= PowerCount;
        this.player.PlayInfo.LevelProgress = this.Health/this.TotalHealth;
        GameControl.playBoom(this.node.getPosition());
        if(this.Health>0)
        {
            this.isHitHead = isHitHead;
            this.moveCoolTimer = 0.3;
            this.isStartMove = true;
            this.player.ResetShitTime();
        }
        else
        {
            this.isStartMove = false;
        }
        if(this.isShake)
        {
            this.isShake = false;
            var index = 0;
            this.DropAction(isHitHead);
            this.schedule(()=>
            {
                index++;
               
                if(index == 1)
                {
                    this.isShake = true;
                }
            },1,0);
        }
    },
    Death()
    {
        if(this.isDeath)
            return;

        //箱子
        UIGameing.setBossBoxtartPos();
        
        this.isDeath = true;
        this.GetScore();
        if(this.dir == 1)
        {
            var m =  cc.moveBy(0.2,1000,0);
        }
        else
        {
           var m =  cc.moveBy(0.2,-1000,0);
        }
        var c = cc.callFunc(()=>
        {
            this.node.active = false;
           
        },this);
        this.player.MoveToTarget(this.myPos,()=>
        {
            UIGameing.BossBoxAni();
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,4);
            this.player.node.scaleX = -this.player.node.scaleX;
            var s = cc.scaleBy(0.5,1,1);
            this.player.stopShit = true;
            var call1 =  cc.callFunc(()=>
            {
                this.player.GunCom.PaseAimed();
                this.player.GunCom.GunSkin.node.rotation = 0;
            })
           
            var mm = cc.moveBy(0.5,200*this.dir,0);
            var call = cc.callFunc(()=>
            {
                GameControl.NextLevel();
            },this);
            this.player.node.runAction(cc.sequence(s,call1,mm,call));
        });
        this.node.runAction(cc.sequence(m,c));
    },

    DropAction(isHitHead)
    {
        GameControl.ShakeNode();
        if(isHitHead)
        {   
            GameControl.AddHeadCount();
            GameGlobal.SoundManager.PlaySound("爆头");
        }
        else
        {
            GameControl.ResetHeadCount();
        }
    },

    GetScore()
    {
        if(this.isHitHead)
        {
            this.player.PlayInfo.Score += 2*this.player.PlayInfo.Level;
            //this.player.PlayInfo.Coin += 2*this.player.PlayInfo.Level;
        }
        else
        {
            this.player.PlayInfo.Score += this.player.PlayInfo.Level;
            //this.player.PlayInfo.Coin++;
        }
    },

    MoveTarget()
    {
        
        this.GetScore();
        this.player.GunCom.GunSkin.node.rotation = 0;
        this.player.GunCom.unscheduleAllCallbacks();
        this.player.MoveToTarget(this.node.getPosition());
        var Pos = this.getRealPos(GameControl.getWallPos());
        this.myPos = Pos;
        var m = cc.moveTo(0.5,Pos);
        var call = cc.callFunc(()=>
        {
            this.dir = -this.dir;
            this.node.scaleX = this.dir;
        },this);
        this.node.runAction(cc.sequence(m,call));
    },

});
