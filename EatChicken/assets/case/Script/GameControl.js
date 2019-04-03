
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
        HurtLabelParent:cc.Node
    },
    
    playBoom(pos)
    {
        this.BoomDragon.parent.setPosition(pos);
        this._armatureDisPlay = this.BoomDragon.getComponent(dragonBones.ArmatureDisplay);

        this._armature = this._armatureDisPlay.playAnimation("Sprite",1);
    },

    randomSkin()
    {
        var index = Math.floor(Math.random()*this.EnemySkins.length);
        var data  = {};
        data.skin = this.EnemySkins[index];
        data.name = this.EnemyNames[index];
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

    onLoad()
    {
        window.GameControl = this;
        this.currentEnemy = null;
        this.levelEnemyCount = 5;
        this.HurtLabelList = [];
        this.HurtLabelList.push(this.HurtLabel);
    },

    start () {
        
        this.wallList = [];
        
        this.KillNumber = 0;
        
        this.UserInfo = GameGlobal.SeverManager.UserInfo;

        //this.GameStart();

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

    setNextEnemy()
    {
        
        this.player.PlayInfo.LevelProgress += 1/this.levelEnemyCount;

        var pos = this.getWallPos();
        

        if(this.KillNumber == this.levelEnemyCount)
        {
            this.Boss.setPos(pos,this.player.node.scaleX);
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
                    GameGlobal.HelperManager.ReductionDimondCount(Count);
                    GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,60);
                },1,60);
            },"获得金币x60");
        }
        else
        {
            GameGlobal.HintManager.ShowToast("今日次数用尽,明日再来!")
        }
    }

});
