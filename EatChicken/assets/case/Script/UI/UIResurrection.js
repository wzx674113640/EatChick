
cc.Class({
    extends: cc.Component,

    properties: {
        AppLayout: cc.Node,

        ResurrectionNode:cc.Node,
        GetGunNode: cc.Node,
        HitEggNode:cc.Node,
        CoinPanel:cc.Node
    },

    onLoad()
    {
       
    },  

    onEnable()
    {
       this.ResurrectionNode.active = true;
       this.GetGunNode.active = false;
       this.HitEggNode.active = false;
       this.CoinPanel.active = false;
    
       if(GameGlobal.SeverManager.UserInfo.is_status == 0)
       {
           this.AppLayout.parent.active = false;
           return;
       }
       /*
       this.UserInfo = GameGlobal.SeverManager.UserInfo;
       var AppInfoList = this.UserInfo.AppIDInfoList;
       AppInfoList.sort(function() 
       {
            return (0.5-Math.random());
       })
       for(var i = 0;i< this.AppLayout.children.length;i++)
       {
           this.AppLayout.children[i].getComponent("AppItem").setItem(AppInfoList[i]);
       }
       */
    },

    BtnSeeResurrection()
    {
        var self = this;
        var action = ()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.Resurrection);
            this.node.active = false;
        }
        if(GameGlobal.SeverManager.UserInfo.is_status == 0)
        {
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            });
        }
        else
        {
            GameGlobal.AdsManager.AddShareEvent(()=>
            {
                action();
            });
        }
    },

    BtnCoinResurrection()
    {
        var self = this;
        if(GameGlobal.SeverManager.UserInfo.Coin < 50)
        {   
            GameGlobal.HintManager.TitlePop("金币不足");
        }   
        else
        {
            GameGlobal.SeverManager.C2G_ChangeCoin(()=>
            {
                GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,-50);
                GameGlobal.MsgCenter.emit(Constant.Msg.Resurrection);
                this.node.active = false;
            },-1,50);
        }
    },

    BtnTanks()
    {
        //this.ResurrectionNode.active = false;
        //this.GetGunNode.active = true;
        this.node.active = false; 
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGameOver);
    },
    
});
