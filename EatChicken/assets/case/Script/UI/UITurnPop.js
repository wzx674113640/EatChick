
cc.Class({
    extends: cc.Component,

    properties: {
        Gun1:cc.Node,
        Gun2:cc.Node,
        Coin:cc.Node,
        CoinStr:cc.Label
    },

   
    ShowPop(coin)
    {
        console.log("coin",coin);
        this.node.active = true;
        if(coin>=100)
        {
            this.Coin.active = true;
            this.CoinStr.string = "x" + coin;
        }
        else if(coin == 20)
        {
            this.Gun1.active = true;
        }
        else if(coin == 21)
        {
            this.Gun2.active = true;
        }
    },

    onDisable()
    {
        this.Coin.active = false;
        this.Gun1.active = false;
        this.Gun2.active = false;
    },
    
    Close()
    {
        this.node.active = false;
    }
});
