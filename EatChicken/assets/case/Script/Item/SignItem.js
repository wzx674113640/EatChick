
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.CoinItem = this.node.getChildByName("CoinItem");
        this.LabelCount = this.CoinItem.getChildByName("LabelCount");
        this.SkinItem = this.node.getChildByName("SkinItem");
        this.AlreadySign = this.node.getChildByName("AlreadySign");
    },


    setSignItem(data)
    {
        if(data.status == "0") //未签到
        {
            this.AlreadySign.active = false;
        }
        else
        {
            this.AlreadySign.active = true;
        }
        if(data.cat == 1) //金币
        {
            this.CoinItem.active = true;
            this.LabelCount.getComponent(cc.Label).string = data.gold;
            this.SkinItem.active = false;
        }
        else
        {
            this.CoinItem.active = false;
            this.SkinItem.active = true;
            this.SkinItem.getComponent(cc.Sprite).spriteFrame = GameControl.Config.PlaySkins[Number(data.gold) - 1];
        }
    },
    
    setSgin()
    {
        this.AlreadySign.active = true;
    }  

});
