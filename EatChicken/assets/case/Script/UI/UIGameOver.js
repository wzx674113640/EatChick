
cc.Class({
    extends: cc.Component,

    properties: {
       LayoutNode:cc.Node
    },

   

    onEnable () 
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 0)
            return;
        this.AppList = GameGlobal.SeverManager.UserInfo.AppIDInfoList;
        this.BtnList = this.LayoutNode.children;
        this.AppList.sort(function() {
            return (0.5-Math.random());
       })
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
        GameGlobal.MsgCenter.on(Constant.Msg.CloseGameOverPanel,this.CloseGameOverPanel.bind(this));
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
