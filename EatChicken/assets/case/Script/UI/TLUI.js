

cc.Class({
    extends: cc.Component,

    properties: {
        CloseUI:cc.Node,
        isJump:false
    },

    onLoad()
    {
        this.EndPos = this.CloseUI.getPosition();
    },

    onEnable()
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 1)
        {
            this.unscheduleAllCallbacks();
            GameGlobal.AdsManager.AdervertActive(false);
            this.CloseUI.setPosition(cc.v2(0,GameGlobal.SeverManager.UserInfo.StartPos))
            this.scheduleOnce(()=>
            {
                GameGlobal.AdsManager.AdervertActive(true);
                this.CloseUI.setPosition(cc.v2(0,this.EndPos.y));
            },1);
        }
        if(this.isJump)
        {
            var min = -200;
            var max = 200;
            parseInt(Math.random()*(max-min+1) + min,10);
            var value = Math.floor(Math.random()*(max-min+1)+min);
            this.CloseUI.x = value;
        }
    },
    
    onDisable()
    {
        GameGlobal.AdsManager.AdervertActive(false);
    }
    
});
