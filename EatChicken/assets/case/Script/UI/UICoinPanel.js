

cc.Class({
    extends: cc.Component,

    properties: {
        CoinLabel:cc.Label
    },

    onEnable()
    {
        var CoinList = [10,20,30];
        var index = Math.floor(Math.random()*CoinList.length);
        this.Coin =  CoinList[index];
        this.CoinLabel.string = "金币+" + this.Coin;
    },

    BtnClose()
    {
        this.node.active = false;
    },

    BtnGet()
    {
        var action = ()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,this.Coin);
            this.node.active = false;
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
            //分享
            GameGlobal.AdsManager.AddShareEvent(()=>
            {
                action();
            });
        }
    }
});
