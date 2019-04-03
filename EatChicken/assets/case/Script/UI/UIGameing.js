

cc.Class({
    extends: cc.Component,

    properties: {
        LableCoin: cc.Label,
        LableScore: cc.Label,
        LableLevel: cc.Label,
        LableEenmyName: cc.Label,
        LableBulletCount: cc.Label,
        ImgsHealth:
        {
            type:cc.Node,
            default:[]
        },
        PrograssLevel:cc.ProgressBar,
        HeadCountUI:cc.Node,
        LabelHeadCount:cc.Label,

        UI:cc.Node,
        StartUI: cc.Node,

        HomeCoin:cc.Label,
        HomeScore:cc.Label,
        HomeSoundSprite:
        {
            type:cc.SpriteFrame,
            default:[]
        },
        HomeSound:cc.Sprite,

        ImgCoin:cc.Node,
        ImgHealth:cc.Node,
        ImgBossBox:cc.Node,

        BtnHealthNode:cc.Node,
        UISupply:cc.Node,
        UICoinPanel:cc.Node,
        UIGunPanel:cc.Node

    },

    setCoinStartPos()
    {
        var Wall = GameControl.getCurrentWall();
        var startPos = Wall.PersonPos;
        this.ImgCoin.setPosition(cc.v2(startPos.x,startPos.y + 50));
        this.ImgCoin.active = true;
    },

    setHealthStartPos()
    {
        var Wall = GameControl.getCurrentWall();
        var startPos = Wall.PersonPos;
        this.ImgHealth.setPosition(cc.v2(startPos.x,startPos.y + 50));
        this.ImgHealth.active = true;
    },

    setBossBoxtartPos()
    {
        var Wall = GameControl.getCurrentWall();
        var startPos = Wall.PersonPos;
        this.ImgBossBox.setPosition(cc.v2(startPos.x,startPos.y + 50));
        this.ImgBossBox.active = true;
    },

    BossBoxAni()
    {
        this.ImgBossBox.active = false;
        var value = Math.floor(Math.random()*10);
        if(value < 7)
        {
            this.UIGunPanel.active = true;
        }
        else
        {
            this.UICoinPanel.active = true;
        }
    },
    
    CoinAni(action)
    {
       var pos = cc.v2(this.LableCoin.node.parent.getPosition());
       this.UIAni(action,this.ImgCoin,pos);
    },

    HealthAni(action)
    {
        var pos = cc.v2(this.ImgsHealth[0].parent.getPosition());  
        this.UIAni(action,this.ImgHealth,pos);
    },

    UIAni(action,mnode,pos)
    {
        var m = cc.moveTo(0.5,cc.v2(pos.x,pos.y + GameControl.player.realTotalDis));
        var call = cc.callFunc(()=>
        {
            mnode.active =false;
            action();
        });
        mnode.runAction(cc.sequence(m,call));
    },

    BtnHealth()
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            if(GameControl.player.PlayInfo.Health<3)
            {
                GameControl.player.UIBlood(1);
            }
            this.BtnHealthNode.active = true;
        });
    },

    BtnGetCoin()
    {
        GameControl.GetCoin();
    },

    onLoad() {

        window.UIGameing = this; 
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.HeadPos = this.HeadCountUI.getPosition();
        this.SoundUI();
        GameGlobal.MsgCenter.on(Constant.Msg.HomePage,this.HomePageUI.bind(this)); //数据更新改变UI
        GameGlobal.MsgCenter.on(Constant.Msg.ReturnHomePage,this.returnHomePage.bind(this)); //返回首页
        GameGlobal.MsgCenter.on(Constant.Msg.ChangCoin,this.ChangCoin.bind(this));
    },
    
    SoundUI()
    {
        var active = cc.sys.localStorage.getItem("Sound");
        if(active == 0)
        {
            this.HomeSound.spriteFrame = this.HomeSoundSprite[0]; //关
            GameGlobal.SoundManager.SoundToggle = false;
        }
    },

    BtnControlSound()
    {
        var active = cc.sys.localStorage.getItem("Sound");
        if(active == undefined)
        {
            cc.sys.localStorage.setItem("Sound",0);
            GameGlobal.SoundManager.SoundToggle = false;
            this.HomeSound.spriteFrame= this.HomeSoundSprite[0]; //关
        }
        else
        {
            if(active == 1)
            {
                cc.sys.localStorage.setItem("Sound",0);
                GameGlobal.SoundManager.SoundToggle = false;
                this.HomeSound.spriteFrame= this.HomeSoundSprite[0]; //关
            }
            else if(active == 0)
            {
                cc.sys.localStorage.setItem("Sound",1);
                GameGlobal.SoundManager.SoundToggle = true;
                this.HomeSound.spriteFrame = this.HomeSoundSprite[1]; //开
            }
        }
        GameGlobal.SoundManager.PlayMusic("Bg");
    },

    HomePageUI(data)
    {
        GameControl.GameStart();
        this.HomeCoin.string = data.Coin;
        this.HomeScore.string = data.Score;
    },

    ChangCoin(Coin)
    {
        var UserInfo = GameGlobal.SeverManager.UserInfo;
        UserInfo.Coin += Coin;
        this.setCoin(UserInfo.Coin);
    },
    
    setCoin(count)
    {
        this.LableCoin.string = count;
        this.HomeCoin.string = count;
    },

    setScore(count)                 
    {
        this.LableScore.string = count;
    },

    setLevel(count)
    {
        this.LableLevel.string = count;
    },

    setEenmyName(name)
    {
        this.LableEenmyName.string = name;
    },

    setBulletCount(name)
    {
        if(name == "∞")
        {
            this.LableBulletCount.string = name;
        }
        else
        {
            this.LableBulletCount.string = "x"+name;
        }
        
    },

    setImgHealth(count)
    {
        if(count>3)
        {
            count = 3;
        }
        for(var i = 0;i < this.ImgsHealth.length;i++)
        {
            if(i>=count)
            {
                this.ImgsHealth[i].active = false;
            }
            else
            {
                this.ImgsHealth[i].active = true;
            }
        }
    },

   
   setLevelPross(value)
   {
        this.PrograssLevel.progress = value;
   },


   BtnAginGame()
   {
       GameControl.AginGame();
   },

   setHeadCount(count)
   {
        this.LabelHeadCount.string = "爆头x"+count;
        this.HeadCountUI.setPosition(this.HeadPos);
        this.HeadCountUI.opacity = 255;
        var m = cc.moveBy(0.2,cc.v2(0,100));
        var f = cc.fadeTo(1,0);
        this.HeadCountUI.runAction(cc.sequence(m,f));
   },
   
   BtnStart()
   {
        this.StartUI.active  = false;
        this.UI.active = true;
        GameControl.player.GunCom.AgainAimed();
        GameGlobal.AdsManager.ShowOrHideAdervert(true);
        GameGlobal.SeverManager.ShowHideButton(false);
        GameGlobal.SeverManager.C2G_GameStart();
   },

   returnHomePage()
   {
        this.StartUI.active  = true;
        this.UI.active = false;
        this.BtnHealthNode.active = true;
        GameGlobal.AdsManager.ShowOrHideAdervert(false);
        GameGlobal.SeverManager.ShowHideButton(true);
   },

   BtnUIRanking()
   {
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIRanking);
   },

   BtnGun()
   {
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGun);
   }
});
