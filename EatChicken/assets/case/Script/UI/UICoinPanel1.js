
cc.Class({
    extends: cc.Component,

    properties: {
        CoinLabel : cc.Label,
    },

    ShowCoinPanel(value)
    {
        this.node.active = true;
        this.Coin = Math.ceil(value * 50);
        this.CoinLabel.string = "金币+"+this.Coin;
    },

    GetCoin(add)
    {
        var action = ()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,this.Coin*add);
            this.Close();
        }
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            action();
        });
    },

    BtnGetCoin()
    {
        this.GetCoin(1);
    },

    BtnGetThreeCoin()
    {
        this.GetCoin(3);
    },

    Close()
    {
        this.node.active = false;
        this.node.parent.active = false;
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGameOver);
    }
});
