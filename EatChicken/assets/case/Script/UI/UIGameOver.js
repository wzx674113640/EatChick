
cc.Class({
    extends: cc.Component,

    properties: {
       LayoutNode:cc.Node
    },

    onEnable()
    {   
        
    },  

    onLoad () 
    {
        this.AppList = GameGlobal.SeverManager.UserInfo.AppIDInfoList;
        this.BtnList = this.LayoutNode.children;
        for(var i = 0; i< this.AppList.length;i++)
        {
            if(this.BtnList.length >i)
            {
                this.BtnList[i].getComponent("AppItem").setItem(this.AppList[i]);
            }
            else
            {
                break;
            }
        }
    },

    BtnOnePage()
    {
       this.node.active = false;
       GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
       GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,false);
    },  

    BtnAgin()
    {
        this.node.active = false;
        //GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
        GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,true);
    }
});
