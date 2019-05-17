
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    start () 
    {
        this.ImgHead = this.node.getChildByName("ImgHead").getComponent(cc.Sprite);
        this.LabelCoin = this.node.getChildByName("LabelCoin").getComponent(cc.Label);
        this.BtnState = this.node.getChildByName("BtnState").getComponent(cc.Sprite);
        this.status = 0;
    },

    setState(data)
    {
        
        this.status = Number(data.status);
        this.LabelCoin.string = data.gold;
        this.BtnState.spriteFrame = this.node.parent.parent.getComponent("UIShare").StateList[this.status];
    },
    
    BtnShare()
    {
        GameGlobal.AdsManager.AddShareEventFriend(()=>
        {
            GameGlobal.HintManager.TitlePop("好友通过分享进入，才能获得金币！");
        });
    },

    BtnGetCoin()
    {
        GameGlobal.SeverManager.C2G_Friendbut(()=>
        {   
            this.status = 2;
            this.BtnState.spriteFrame = this.node.parent.parent.getComponent("UIShare").StateList[Number(this.status)];
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,500);
        });
    },
    
    BtnClick()
    {   
        switch(this.status)
        {
            case 0: 
                this.BtnShare();
                break;
            case 1:
                this.BtnGetCoin();
                break;
            case 2:
                
                break;
        }
    }
});
