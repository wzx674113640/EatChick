

cc.Class({
    extends: cc.Component,

    properties: {
       Title:cc.Label,
       GunSprite:cc.Sprite,
       AppLayout:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable()
    {
        this.isfirst = true;
    },

    onEnable()
    {
        var indexlist = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
        var index = GameGlobal.SeverManager.UserInfo.CurrentGun;
        indexlist.splice(index,1);
        this.key = Math.floor(Math.random()*indexlist.length);
        this.key1 = indexlist[this.key];
        this.GunValue = GameControl.Config.GunItems[this.key1].getComponent("BaseGun");
        var SpriteValue = GameControl.Config.Guns[this.key1];
        this.Title.string = "恭喜获得"+this.GunValue.Name+",子弹8发";
        this.GunSprite.spriteFrame = SpriteValue;
        GameGlobal.SeverManager.C2G_fdcount(1);
        
        /*
        this.UserInfo = GameGlobal.SeverManager.UserInfo;
        if(this.UserInfo.is_status == 0)
        {
            this.AppLayout.parent.active = false;
            return;
        }   
        var AppInfoList = this.UserInfo.AppIDInfoList;
        AppInfoList.sort(function() 
        {
                return (0.5-Math.random());
        })
        for(var i = 0;i< this.AppLayout.children.length;i++)
        {
            this.AppLayout.children[i].getComponent("AppItem").setItem(AppInfoList[i],()=>
            {
                GameGlobal.SeverManager.C2G_fdcount(2);
            });
        }
        */
    },
    
    BtnGet() 
    {
        var action = ()=>
        {
            var ID = this.key1;
            GameControl.player.ChangeGun(ID);
            GameControl.player.GunCom.setBulletCount(8);
            GameControl.player.isSelfGun = false; //临时枪
            this.node.active = false;
            GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
        }

        if(GameGlobal.SeverManager.UserInfo.is_status != 1)
        {
            //视频
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            })
        }
        else
        {
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            })
        }
    },

    //永久枪支
    BtnGetGun()
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            GameGlobal.SeverManager.C2G_BuyGun(this.key1,(res)=>
            {
                GameGlobal.SeverManager.C2G_UserGun(this.key1+1);
                //GameControl.player.ChangeGun(this.key1);
              
                GameGlobal.SeverManager.UserInfo.ChangeGun(this.key1 + 1);
               
                GameGlobal.HintManager.ShowToast("领取成功");
                this.BtnClose1();
            });
        })
    },

    BtnColse()
    {
        this.node.active = false;
        GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
    },
    
    BtnClose1()
    {
        this.node.parent.parent.active = false;
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGameOver);
        /*
        var UICom = this.node.parent.parent.getComponent("UIResurrection");
        this.node.active = false;
        UICom.HitEggNode.active = true;
        */
    }

});
