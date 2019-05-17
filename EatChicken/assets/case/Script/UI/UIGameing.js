var SceneList = [0,1,2,3,4];

cc.Class({
    extends: cc.Component,

    properties: {
        LableCoin: cc.Label,
        LableScore: cc.Label,
        LevelComponet: cc.Component,
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
        Black_BG:cc.Node,
        Black_BG1:cc.Node,
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
        UIGunPanel:cc.Node,

        BtnGame:cc.Node,

        Bg1:cc.Sprite,
        Bg2:cc.Sprite,

        startWall:cc.Sprite,
        startBang:cc.Sprite,

        CH_coinPos:cc.Node,
        HealthVideoAni:cc.Animation,

        GetDayGunPanel:cc.Node
    },

    PlayHealthAni(active)
    {
        if(active)
        {
            this.HealthVideoAni.play("Scale");
        }
        else
        {
            this.HealthVideoAni.stop("Scale");
        }
    },

    BtnClose()
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 1)
        {
            GameGlobal.SeverManager.UIAppBox.active = true;
        }
        else
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
            GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,false);
        }   
    },
    
    changeScene()
    {
        var index = Math.floor(Math.random() * SceneList.length);

        if(index == this.CurrentScene)
        {
            if(index  < SceneList.length - 1)
            {
                index ++;   
            }
            else if(index > 0)
            {
                index --;
            }
        }
        
        this.CurrentScene = index;
        this.Bg1.spriteFrame = GameControl.Config.BgSpris[index];
        this.Bg2.spriteFrame = GameControl.Config.BgSpris[index];

        this.startWall.spriteFrame = GameControl.Config.WallSpris[index];
        this.startBang.spriteFrame = GameControl.Config.BangSpris[index];

        for(var i = 0;i < GameControl.wallList.length;i++)
        {
            GameControl.wallList[i].getComponent("Wall").ChangeItem(index);
        }
    },


    OpenGameClick()
    {
        GameGlobal.SeverManager.UIAppBox.active = true;
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
       var pos = this.LableCoin.node.parent.parent.getPosition();
      
       this.UIAni(action,this.ImgCoin,pos);
    },

    HealthAni(action)
    {
        var pos = this.LableCoin.node.parent.parent.getPosition();  
        var pos1 = cc.v2(pos.x,pos.y - 40);
        this.UIAni(action,this.ImgHealth,pos1);
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
            if(GameControl.player.PlayInfo.Health < 3)
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
        this.CurrentScene = 0;
        window.UIGameing = this; 
        GameGlobal.UIManager.ShowApp(Constant.UIPop.BtnAppList);
        UIGameing.ShowMoreGame();
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.HeadPos = this.HeadCountUI.getPosition();
        this.SoundUI();
        //适配UI
        var UserInfo = GameGlobal.SeverManager.UserInfo;
        this.HomeCoin.node.parent.y =UserInfo.MeansY;
        this.CH_coinPos.y = UserInfo.MeansY;
        this.Black_BG.width = UserInfo.screenWidth * UserInfo.ipx;
        this.Black_BG.height = UserInfo.screenHeight * UserInfo.ipx  + 20;
        this.Black_BG1.width = UserInfo.screenWidth * UserInfo.ipx;
        this.Black_BG1.height = UserInfo.screenHeight * UserInfo.ipx + 20;


        GameGlobal.MsgCenter.on(Constant.Msg.HomePage,this.HomePageUI.bind(this)); //数据更新改变UI
        GameGlobal.MsgCenter.on(Constant.Msg.ReturnHomePage,this.returnHomePage.bind(this)); //返回首页
        GameGlobal.MsgCenter.on(Constant.Msg.ChangCoin,this.ChangCoin.bind(this));
        GameGlobal.MsgCenter.on(Constant.Msg.PlayHealthAni,this.PlayHealthAni.bind(this));
        this.HomePageUI();
        //GameGlobal.AdsManager.ShowOrHideAdervert(true);
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIDownApp);
        //GameGlobal.UIManager.ShowPop("Banner");

        if(GameGlobal.HelperManager.IsPassDay())
        {
            
            this.GetDayGunPanel.active = true;
        }
        else
        {
            this.GetDayGunPanel.active = false;
        }
    },
    
    CustomerServicesBtn()
    {
        if(!CC_WECHATGAME)
            return;
        window.wx.openCustomerServiceConversation({
            success: (res) => {
            }
        });
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

    HomePageUI()
    {
        this.HomeCoin.string = GameGlobal.SeverManager.UserInfo.Coin;
        this.HomeScore.string = GameGlobal.SeverManager.UserInfo.Score;
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
        this.LevelComponet.setLevel(count);
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
        GameGlobal.SeverManager.ShowHideButton(false);
        GameGlobal.SeverManager.C2G_GameStart();
        //GameGlobal.UIManager.Close(Constant.UIPop.UIDownApp);
        //GameGlobal.AdsManager.ShowOrHideAdervert(true);
        GameGlobal.SeverManager.UserInfo.isHomePage = false;
   },

   ShowMoreGame()
   {
        if(GameGlobal.SeverManager.UserInfo.is_status == 1)
        {
            this.BtnGame.active = true;
        }
   },

   returnHomePage()
   {
        this.StartUI.active  = true;
        this.UI.active = false;
        this.BtnHealthNode.active = true;
        GameGlobal.AdsManager.AdervertActive(false);
        //GameGlobal.UIManager.ShowPop(Constant.UIPop.UIDownApp);
        //GameGlobal.UIManager.ShowPop("Banner");
        GameGlobal.SeverManager.ShowHideButton(true);
        GameGlobal.SeverManager.UserInfo.isHomePage = true;
   },

   BtnUIRanking()
   {
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIRanking);
   },

   BtnSkining()
   {
        //GameGlobal.HintManager.ShowToast("开发中");
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UISkin);
   },

   BtnGun()
   {
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGun);
   },

    BtnSign()
    {
        GameGlobal.UIManager.ShowPop("UISign");
    },

    BtnShare()
    {
        GameGlobal.UIManager.ShowPop("UIShare");
    }
});
