
cc.Class({
    extends: cc.Component,

    properties: {
        //枪的预制体
        GunPrefabs:
        {
            type:cc.Prefab,
            default:[]
        },

        //玩家皮肤预制体
        PlaySkins:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        EnemySkins:
        {
            type:cc.SpriteFrame,
            default:[]
        }, 

        EnemyNames:
        {
            type:cc.String,
            default:[]
        },

        Wall:cc.Node,
        WallParent:cc.Node,
        player:cc.Component,
        Enemy:cc.Component,
        Enemy1:cc.Component,
        Boss:cc.Component,
        Shake:cc.Node,

        BoomDragon:cc.Node,
        Config:cc.Component,
        HurtLabel:cc.Label,
        HurtLabelParent:cc.Node,
        BossUI:cc.Node,
        CoinAni: cc.Component,
    },
    
    onLoad()
    {
        window.GameControl = this;
        this.currentEnemy = null;
        this.levelEnemyCount = 5;
        this.HurtLabelList = [];
        this.HurtLabelList.push(this.HurtLabel);
        
        this.PlaySkins = this.Config.PlaySkins;
        this.EnemySkins = this.Config.EnemySkins;
        this.EnemyNames = this.Config.EnemyNames;
        this.BossSkins = this.Config.BossSkins;
        this.BossNames = this.Config.BossNames;
    },

    playBoom(pos)
    {
        this.BoomDragon.parent.active = true;
        this.BoomDragon.parent.setPosition(pos);
        this._armatureDisPlay = this.BoomDragon.getComponent(dragonBones.ArmatureDisplay);
        this._armature = this._armatureDisPlay.playAnimation("Sprite",1);
        this.scheduleOnce(()=>
        {
            this.BoomDragon.parent.active = false;
        },0.7);
    },

    randomSkin(IsBoss)
    {
        if(IsBoss)
        {
            var index = Math.floor(Math.random() * this.BossSkins.length);
            var data  = {};
            data.skin = this.BossSkins[index];
            data.name = this.BossNames[index];
        }
        else
        {
            var index = Math.floor(Math.random() * this.EnemySkins.length);
            var data  = {};
            data.skin = this.EnemySkins[index];
            data.name = this.EnemyNames[index];
        }
        return data;
    },

    ShakeNode()
    {
        var action = cc.shake(0.2,15,15);  
        this.Shake.runAction(action);
    },

    ResetHeadCount()
    {   
        this.player.PlayInfo.RiflemanCount = 0;
    },

    AddHeadCount()
    {
        this.player.PlayInfo.RiflemanCount ++;
    },

   

    start () {
        
        this.wallList = [];
        
        this.KillNumber = 0;
        
        this.UserInfo = GameGlobal.SeverManager.UserInfo;

        this.GameStart();

        GameGlobal.MsgCenter.on(Constant.Msg.AginGame,this.AginGame.bind(this));

        
    },
    
    HurtLabelAni(Power,HurtLabelPos)
    {
        var Hurt = this.HurtLabelList.length>0?this.HurtLabelList.pop():cc.instantiate(this.HurtLabel.node).getComponent(cc.Label);
        Hurt.node.parent = this.HurtLabelParent;
        Hurt.string = "-" + Power;
        Hurt.node.opacity = 255;
        Hurt.node.setPosition(cc.v2(HurtLabelPos.x,HurtLabelPos.y + 50));
        var m = cc.moveBy(0.5,0,120);
        var f = cc.fadeOut(0.5);
        var call = cc.callFunc(()=>
        {
            this.HurtLabelList.push(Hurt);
        },this);
        Hurt.node.runAction(cc.sequence(cc.spawn(m,f),call));
    },

    PlayBossUI()
    {
        this.BossUI.x = -650;
        var m =  cc.moveBy(0.3,650,0);
        var b = cc.blink(1,3);
        var m1 =  cc.moveBy(0.3,650,0);
        this.BossUI.runAction(cc.sequence(m,b,m1));
    },  

    setNextEnemy()
    {
        
        this.player.PlayInfo.LevelProgress += 1/this.levelEnemyCount;

        var pos = this.getWallPos();
        

        if(this.KillNumber == this.levelEnemyCount)
        {
            this.Boss.setPos(pos,this.player.node.scaleX);
            this.PlayBossUI();
        }
        else
        {
            if(this.KillNumber%2 == 0)
            {
                this.Enemy.setPos(pos);
            }
            else
            {
                this.Enemy1.setPos(pos);
            }
        }
    },

    getCurrentWall()
    {
        return this.wallList[this.KillNumber].getComponent("Wall");
    },

    getWallPos()
    {
        this.KillNumber++;
        var length = this.wallList.length;
        if(this.KillNumber >= (length-5))
        {
            var dir = this.wallList[length-1].scaleX;
            var lastPos = this.wallList[length-1].getPosition();
            for(var i = 0;i<10;i++)
            {  
                dir  = -dir;
                var wall = cc.instantiate(this.Wall);
                wall.parent = this.WallParent;
                wall.active = true;
                wall.getComponent("Wall").Init(dir,lastPos);
                lastPos = wall.getPosition();
                this.wallList.push(wall);
            }
        }
        return this.wallList[this.KillNumber].getComponent("Wall").PersonPos;
    },

    creatorGun(ID)
    {
        var Gun =  cc.instantiate(this.Config.GunItems[ID]);
        Gun.active = true;
        return Gun;
    },

    //开始游戏
    GameStart()
    {
        this.player.NewPlayInfo();
        this.player.PlayInfo.Init();
      
        //玩家
        var skinID = this.UserInfo.CurrentSkin-1;
        var gunID = this.UserInfo.CurrentGun-1;
        var bulletCount = this.UserInfo.CurrentBullet;
        if(gunID == 0)
        {
            bulletCount = 9999;
        }
        this.player.InitInfo(gunID,bulletCount,this.PlaySkins[skinID],1);
        var lastPos = this.player.node.getPosition();
        this.startPlayerPos = lastPos;
        //场景
        var dir = -1;
       
        for(var i = 0;i<5;i++)
        {
            dir  = -dir;
            var wall = cc.instantiate(this.Wall);
            wall.parent = this.WallParent;
            wall.active = true;
            wall.getComponent("Wall").Init(dir,lastPos);
            lastPos = wall.getPosition();
            this.wallList.push(wall);
        }
        //第一个敌人
        this.Enemy.InitInfo(1,0,this.PlaySkins[0],-1,true);
        this.Enemy.setPos(this.wallList[0].getComponent("Wall").PersonPos);

        //第二个敌人
        this.Enemy1.InitInfo(1,1,this.PlaySkins[0],1);
        this.Enemy1.node.active = false;
        
        this.Boss.InitInfo(3,1,this.PlaySkins[0],1);
        this.Boss.node.active = false;
        
    },

    
    NextLevel()
    {
        this.player.PlayInfo.NextLevel();

        this.ResetScene();
        
    },
    
    AginGame(active = true)
    {
        var data = {};
        data.bullet = GameGlobal.SeverManager.UserInfo.CurrentBullet;
        data.gunID = GameGlobal.SeverManager.UserInfo.CurrentGun;
        GameGlobal.MsgCenter.emit(Constant.Msg.UserGun,data);

        this.player.PlayInfo.Init();
        this.ResetScene(true);
        this.player.GunCom.AgainAimed();
        
        if(active == false)
        {
            this.player.GunCom.PaseAimed();
        }   
    },

    ResetScene(active = false)
    {
        this.KillNumber = 0;
        this.player.Init(active);
        this.Boss.Init();
        UIGameing.changeScene();
        var dir = -1;
        var lastPos = this.startPlayerPos;
        for(var i = 0;i<this.wallList.length;i++)
        {
            dir  = -dir;
            this.wallList[i].getComponent("Wall").Init(dir,lastPos);
            lastPos = this.wallList[i].getPosition();
        }
    
          //第一个敌人 
        //this.Enemy.InitInfo(1,0,this.PlaySkins[0],-1,true);
        this.Enemy.setPos(this.wallList[0].getComponent("Wall").PersonPos);
    
        //第二个敌人
        //this.Enemy1.InitInfo(1,1,this.PlaySkins[0],1,true);
        this.Enemy1.node.active = false;
        this.Boss.node.active = false;
    },

    GetCoin()
    {
        var Count = GameGlobal.HelperManager.GetDimondVideoCount();
        if(Count > 0)
        {
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                GameGlobal.SeverManager.C2G_ChangeCoin(()=>
                {
                    //GameGlobal.HelperManager.ReductionDimondCount(Count);
                    
                    this.CoinAni.play(cc.v2(0,0),()=>
                    {
                        GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,6);
                    });

                },1,60);
                
            });
        }
        else
        {
            GameGlobal.HintManager.ShowToast("今日次数用尽,明日再来!")
        }
    }

});
