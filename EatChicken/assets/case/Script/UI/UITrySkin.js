

cc.Class({
    extends: cc.Component,

    properties: {
       Toggle:cc.Toggle,
    },

    onEnable () {
       
    },

    BtnRandom()
    {
       var index = Math.floor(Math.random()*4) + 2;
       this.UserSkin(index);
    },

    BtnClose()
    {
        this.node.active = false;
        var value = this.Toggle.isChecked ? "1":"0";
        wx.setStorageSync("SkinToggle",value);
    },
    
    UserSkin(SkinID)
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.UseSkin,SkinID); 
            this.node.active = false;
        });
    },
    User1()
    {
        this.UserSkin(2);
    },
    User2()
    {
        this.UserSkin(3);
    },
    User3()
    {
        this.UserSkin(4);
    },
    User4()
    {
        this.UserSkin(5);
    }
});
