
cc.Class({
    extends: cc.Component,

    properties: {
       LayoutNode:cc.Node
    },

    onLoad()
    {
        GameGlobal.MsgCenter.on(Constant.Msg.CloseGameOverPanel,this.CloseGameOverPanel.bind(this));
    },

    onEnable () 
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 0)
            return;
        this.AppList = GameGlobal.SeverManager.UserInfo.AppIDInfoList;
        if(this.AppList.length == 0)
            return;
        this.BtnList = this.LayoutNode.children;
        this.AppList.sort(function() {
            return (0.5-Math.random());
       })
        for(var i = 0; i< this.BtnList.length;i++)
        {
            this.BtnList[i].getComponent("AppItem").setItem(this.AppList[i]);
        }
        GameGlobal.UIManager.Close(Constant.UIPop.UIDownApp);
        GameGlobal.AdsManager.AdervertActive(true);
    },
    
    onDisable()
    {
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIDownApp);
        GameGlobal.AdsManager.AdervertActive(false);
    },

    CloseGameOverPanel()
    {
        this.node.active = false;
    },
    
    BtnOnePage()
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 1)
        {
            GameGlobal.SeverManager.UIAppBox.active = true;
        } 
        else
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
            GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,false);
            this.node.active = false;
        }  
    },  

    BtnAgin()
    {
        this.node.active = false;
        //GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
        GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,true);
    }
});
