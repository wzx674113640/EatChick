

cc.Class({
    extends: cc.Component,

    properties: {
       Layout:cc.Node,
       HintPanel:cc.Node,
       HintDes:cc.Label,
       HintProgress:cc.ProgressBar,
       HintProgressStr :cc.Label
    },

    onLoad()
    {
        GameGlobal.MsgCenter.on(Constant.Msg.SkinHint,this.ShowHint.bind(this));
    },
    
    onDisable()
    {
        
    },

    onEnable()
    {
        GameGlobal.SeverManager.C2G_skinlist((data)=>
        {
            var SkinItemList = this.Layout.children;
            for(var i = 0; i < SkinItemList.length; i++)
            {
                SkinItemList[i].active = true;
                SkinItemList[i].getComponent("SkinItem").setState(data[i]);
            }
        });
    },

    ShowHint(data)
    {
        this.HintDes.string = data.des;
        this.HintProgressStr.string = data.progress + "/" + data.total_progress;
        this.HintProgress.progress = Number(data.progress )/Number(data.total_progress);
        
        this.HintPanel.active = true;
        this.HintPanel.stopAllActions();
        this.HintPanel.setScale(0.1);
        var s1 = cc.scaleTo(0.2,1.2);
        var s2 = cc.scaleTo(0.1,1);
        var s3 = cc.scaleTo(1,1);
        var call = cc.callFunc(()=>
        {
            this.HintPanel.active = false;
        });
        
        this.HintPanel.runAction(cc.sequence(s1,s2,s3,call));
    },  

    CloseClick()
    {
        this.node.active = false;
    }

});
