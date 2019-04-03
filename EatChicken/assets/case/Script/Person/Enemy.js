
var Enemy =  cc.Class({
    extends: require("BasePerson"),

    properties: {
        player:cc.Component,
        UIGameing:cc.Node,
    },

    onLoad () {
        this._super();
        this.targetPos = this.node.getPosition();
    },

    DropBlood(PowerCount,isHitHead = false)
    {
        if(this.isDeath)
            return;
        GameControl.HurtLabelAni(PowerCount,cc.v2(this.node.x,this.node.y + 30));
        GameControl.playBoom(this.node.getPosition());
        if(isHitHead)
        {
            this.player.PlayInfo.Score += 2;
        }
        else
        {
            this.player.PlayInfo.Score++;
        }
        this.Health -= PowerCount;
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

    //彩蛋
    colorEgg()
    {
        var value = Math.floor(Math.random()*10);
        var player = GameControl.player;
        if(value<4)
        {
            UIGameing.setCoinStartPos();
            return "金币";
        }
        else if(player.PlayInfo.Health<3)
        {
            var vv = 0.2 - parseInt(player.PlayInfo.Level/5)*0.05;
            if(vv <= 0)
            {
                vv = 0.05;
            }
            var random = Math.random();
            if(random<vv)
            {
                UIGameing.setHealthStartPos();
                return "血量";
            }

        }
        return "";
    },

   
    Death()
    {
        if(this.isDeath)
            return;
        this.isDeath = true;

        var result =  this.colorEgg();

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
            this.player.MoveToTarget(this.myPos,()=>
            {
                if(result == "金币")
                {
                    UIGameing.CoinAni(()=>
                    {
                        GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,1);
                    })
                }
                else if(result == "血量")
                {
                    UIGameing.HealthAni(()=>
                    {
                        GameControl.player.UIBlood(1);
                    });
                }
            },this);
            GameControl.setNextEnemy();
        },this);
        
        
        this.node.runAction(cc.sequence(m,c));
    },


    //重置敌人
    setPos(pos,dir = null)
    {
        this.unscheduleAllCallbacks();
        //this.Health = Health;
        var gunID = Math.floor(Math.random()*10);
        this.ChangeGun(gunID);
       
        if(dir != null)
        {
            this.node.scaleX = dir;
            this.dir = dir;
        }
        var _data = GameControl.randomSkin();
        this.Skin.spriteFrame = _data.skin;
        GameControl.currentEnemy = this;
        this.isDeath = false;
        this.node.setPosition(this.getRealPos(pos));
        this.myPos = this.node.getPosition();
        this.node.active = true;
        UIGameing.setEenmyName(_data.name);
        this.GunCom.PaseAimed();
    },
    
    getRealPos(pos)
    {
        var vy = this.Skin.node.height*0.5+pos.y ;
        return cc.v2(pos.x,vy);
    },

    checkShitPlayer()
    {
        var startHeadlth = this.Health;
        this.scheduleOnce(()=>
        {
            if(this.Health == startHeadlth)
            {
                if(this.player.PlayInfo == 0)
                {
                    var randomRotation = 45 - Math.floor(Math.random()*90);
                    
                }
                else
                {
                    var x = this.node.x - this.player.node.x;
                    var y = this.node.y - this.player.node.y;
                    var randomRotation =  -Math.atan(Math.abs(y/x)) * 180 / Math.PI;
                }
                var r =  cc.rotateTo(0.25,randomRotation);
                var c = cc.callFunc(()=>
                {
                    this.Shit();
                },this);
                this.GunCom.GunSkin.node.runAction(cc.sequence(r,c));
            }
        },0.5);
    },
    Shit()
    {
        this.GunCom.Shit(true); //是敌人
    },
});
