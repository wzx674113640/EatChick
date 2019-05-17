

cc.Class({
    extends: cc.Component,

    properties: {
        CloseUI:cc.Node
    },

    onEnable()
    {
        return;
        if(GameGlobal.SeverManager.UserInfo.is_status == 1)
        {
            this.unscheduleAllCallbacks();
            GameGlobal.AdsManager.AdervertActive(false);
            this.CloseUI.setPosition(cc.v2(0,GameGlobal.SeverManager.UserInfo.StartPos))
            this.scheduleOnce(()=>
            {
                GameGlobal.AdsManager.AdervertActive(true);
                this.CloseUI.setPosition(cc.v2(0,GameGlobal.SeverManager.UserInfo.EndPos));
            },1);
        }
       
    },
    
    onDisable()
    {
        return;
        GameGlobal.AdsManager.AdervertActive(true);
    }
    
});
