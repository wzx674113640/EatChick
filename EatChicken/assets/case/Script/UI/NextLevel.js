

cc.Class({
    extends: cc.Component,

    properties: {
        LayoutNode:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad()
    {
        this.AppList = GameGlobal.SeverManager.UserInfo.AppIDInfoList;
        this.BtnList = this.LayoutNode.children;
        this.AppList.sort(function() {
            return (0.5-Math.random());
        })
        for(var i = 0; i< this.BtnList.length;i++)
        {
            this.BtnList[i].getComponent("AppItem").setItem(this.AppList[i]);
        }
    },

    BtnNextLevel()
    {
        GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
        GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,30);
        this.node.active = false;
    },

    BtnFiveNextLevel()
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.NextLevel);
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,150);
            this.node.active = false;
        });
    }
});
