

cc.Class({
    extends: cc.Component,

    properties: {
        CoinLabel:cc.Label,
        AppLayout:cc.Node,
    },

    onload()
    {
        this.isfirst = true;
    },


    onEnable()
    {
        var CoinList = [10,20,30];
        var index = Math.floor(Math.random()*CoinList.length);
        this.Coin =  CoinList[index];
        this.CoinLabel.string = "金币+" + this.Coin;
        
        if(GameGlobal.SeverManager.UserInfo.is_status == 0)
        {
            this.AppLayout.parent.active = false;
            return;
        }
        GameGlobal.SeverManager.C2G_fdcount(1);
        
        /*
        this.UserInfo = GameGlobal.SeverManager.UserInfo;
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

    BtnClose()
    {
        this.node.active = false;
        GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
    },

    BtnGet()
    {
        var action = ()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,this.Coin);
            this.node.active = false;
            GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
        }
        if(GameGlobal.SeverManager.UserInfo.is_status != 1)
        {
            //视频
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            });
        }
        else
        {
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            });
        
        }
    }
});
