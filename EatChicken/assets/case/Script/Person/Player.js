var PlayInfo = require("PlayInfo");

cc.Class({
    extends: require("BasePerson"),

    properties: {
       ContrlShitNode:cc.Node,//控制射击的节点
       GameSceneNode:cc.Node, //游戏场景节点
       coolTime:1,
       UIGameing:cc.Node,
       Bg1: cc.Node,
       Bg2: cc.Node,
    },

    NewPlayInfo()
    {
        this.PlayInfo = new PlayInfo();
    },

    onLoad()
    {
        this._super();
        this.stopShit = false;
        this.realTotalDis = 0;
        this.isSelfGun = true;
    },

    start () {

        GameGlobal.MsgCenter.on(Constant.Msg.Resurrection,this.Resurrection.bind(this));
        GameGlobal.MsgCenter.on(Constant.Msg.UserGun,this.ChangeGun1.bind(this));
        this.StartPos = this.node.getPosition();
        this.gameControl = this.UIGameing.getComponent("GameControl");
        this.resetUpdate();
        this.BgMoveCount = 0;
        this.BgDisConstant = this.Bg2.y;
        this.TotalBgDis = 0;

        this.starCoin = GameGlobal.SeverManager.UserInfo.Coin;

        this.ContrlShitNode.on(cc.Node.EventType.TOUCH_START,()=>
        {
            if(this.isShit&&this.stopShit==false)
            {
                if(this.GunCom._toalCount <=0 )
                {   
                    if(this.isSelfGun)
                    {
                        GameGlobal.SeverManager.UserInfo.CurrentBullet = this.GunCom._toalCount;
                        GameGlobal.SeverManager.UserInfo.SaveBullet();
                        UIGameing.UISupply.active = true;
                    }
                    else
                    {
                        var data = {};
                        data.bullet = GameGlobal.SeverManager.UserInfo.CurrentBullet;
                        data.gunID = GameGlobal.SeverManager.UserInfo.CurrentGun;
                        this.ChangeGun1(data);
                    }
                    //GameGlobal.UIManager.ShowPop(Constant.UIPop.UISupply);
                }
                else
                {
                    this.Shit();
                    this.GunCom.setBulletCount(this.GunCom._toalCount);
                    this.gameControl.currentEnemy.checkShitPlayer();
                    this.isShit = false;
                    if(this.GunCom._toalCount <= 0 && !this.isSelfGun)
                    {
                        this.scheduleOnce(()=>
                        {
                            var data = {};
                            data.bullet = GameGlobal.SeverManager.UserInfo.CurrentBullet;
                            data.gunID = GameGlobal.SeverManager.UserInfo.CurrentGun;
                            this.ChangeGun1(data);
                        }, 1.0);
                    }
                }
            }
        },this);
        
    },

    Shit()
    {
        this.GunCom.Shit();
        
        //this.gameControl.UserInfo.CurrentBullet -= this.GunCom.Count;
    },

    ChangeGun1(data)
    {
        this.gameControl.UserInfo.SaveBullet();
        this.ChangeGun(data.gunID-1);
        this.isSelfGun = true;
        if(data.PaseAimed)
        {
            this.GunCom.PaseAimed();
        }
        this.GunCom.setBulletCount(data.bullet);
    
        this.gameControl.UserInfo.ChangeGun(data.gunID);
    },
    
    //首次游戏进入游戏初始化
    InitInfo(gunID,bulletCount,skin,dir) 
    {
        this.ChangeGun(gunID);
        this.GunCom.setBulletCount(bulletCount);
        this.Skin.spriteFrame = skin;
        this.node.scaleX = dir;
        this.dir = dir;
        this.GunCom.PaseAimed();
        this.starCoin = GameGlobal.SeverManager.UserInfo.Coin;
    },

    resetUpdate()
    {
        this.timer = this.coolTime;
        this.isShit = true;
        this.droptimer = 1;
        this.isDrop = true;
    },

    //换场景视和复活时
    Init(isOnePage = false)
    {
        
         this.node.stopAllActions();
         this.unscheduleAllCallbacks();
         this.GameSceneNode.setPosition(cc.v2(0,0));
         if(isOnePage)
         {
            this.node.setPosition(this.StartPos);
         }
         else
         {
            this.node.setPosition(cc.v2(this.StartPos.x+200,this.StartPos.y));
            this.GunCom.PaseAimed();
            var mm = cc.moveBy(0.5,-200,0);
            var call = cc.callFunc(()=>
            {
                this.GunCom.AgainAimed();
                this.stopShit = false;
            })
            this.node.runAction(cc.sequence(mm,call));
         }

         this.resetUpdate();
         this.node.scaleX = 1;
         this.dir = 1;
         this.isDeath = false;
         this.Bg1.y = 0;
         this.Bg2.y = this.BgDisConstant;
         this.BgMoveCount = 0;
         this.TotalBgDis = 0;
         this.realTotalDis = 0;
    },
    
    Death()
    {
        if(this.isDeath)
            return;
        this.isDeath = true;
        if(this.PlayInfo.ResurrectionCount>0)
        {
            GameGlobal.UIManager.ShowPop(Constant.UIPop.UIResurrection);
        }
        else
        {
            GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGameOver);
        }
        
        this.GunCom.PaseAimed();
        this.GunCom.GunSkin.node.rotation = 0;
        var m = cc.moveBy(0.1,100*this.dir,0);
        this.node.runAction(m);
        var coin = GameGlobal.SeverManager.UserInfo.Coin - this.starCoin;
        this.starCoin = GameGlobal.SeverManager.UserInfo.Coin;
        if(this.isSelfGun)
        {
            this.gameControl.UserInfo.SaveBullet();
        }
        GameGlobal.SeverManager.C2G_GameOver(this.PlayInfo.Score,this.PlayInfo.Level,coin);
        GameGlobal.SubManager.BeyondFriend();
    },
    
    Resurrection()
    {
        this.isDeath = false;
        this.GunCom.AgainAimed();
        this.PlayInfo.Resurrection();
        var m = cc.moveBy(0.1,-100*this.dir,0);
        this.node.runAction(m);
    },

    MoveToTarget(targetPos,action = null)
    {
        this.ResetShitTime();
        var myPos = this.node.getPosition();
        var valueY = Math.abs(Math.abs(targetPos.y) - Math.abs(myPos.y));
        this.HandleBG(valueY);
        this.GunCom.PaseAimed();
        var scenem = cc.moveBy(0.5,0,-valueY); 
        this.GameSceneNode.runAction(scenem);
        var m = cc.jumpTo(0.5,targetPos,valueY/2,2);
        var call = cc.callFunc(()=>
        {
            this.dir = -this.dir;
            this.node.scaleX = this.dir;
            this.timer = this.coolTime;
            this.isShit = true;
            if(action == null) 
            {
                this.GunCom.AgainAimed();
            }
            else
            {
                action();
            }
        },this);
        this.node.runAction(cc.sequence(m,call));
    },

    HandleBG(valueY)
    {
        this.TotalBgDis += valueY;
        this.realTotalDis += valueY;
        if(this.TotalBgDis > this.BgDisConstant)
        {
            this.BgMoveCount++;
            if(this.BgMoveCount%2 != 0)
            {
                this.Bg1.y += this.BgDisConstant*2;
            }
            else
            {
                this.Bg2.y += this.BgDisConstant*2;
            }
            this.TotalBgDis =  this.TotalBgDis - this.BgDisConstant;
        }
    },

    DropBlood(PowerCount,isHitHead = false)
    {
        if(this.isDrop)
        {
            GameControl.playBoom(this.node.getPosition());
            this.UIBlood(-1);
            this.isDrop = false;
        }
    },

    UIBlood(value)
    {
        this.Health += value;
        this.PlayInfo.Health = this.Health;
    },

    ResetShitTime()
    {
        this.isShit = false;
        this.timer = this.coolTime;
    },
    
    update(dt)
    {
        if(!this.isDrop)
        {
            this.droptimer -= dt;
            if(this.droptimer<=0)
            {
                this.isDrop = true;
                this.droptimer = 1;
            }   
        }
        if(this.stopShit)
            return;
        if(!this.isShit)
        {
            this.timer-=dt;
            if(this.timer <= 0)
            {
                this.isShit = true
                this.timer = this.coolTime;
            }
        }
    }
});
