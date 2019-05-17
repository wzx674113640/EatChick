
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad()
    {
        this.BannerList = GameGlobal.SeverManager.UserInfo.BannerList;
        this.index = -1;

        this.Sprite = this.node.getComponent(cc.Sprite);
        var ww = this.node.getComponent(cc.Widget);
        ww.target = cc.find("Canvas");
        ww.bottom = 0;
        this.setBanner();
    },

    onEnable()
    {
        this.coolTimer = 5;
        this.timer = this.coolTimer;
    },  

    update(dt)
    {
        this.timer -= dt;
        if(this.timer  <= 0)
        {
            this.timer = this.coolTimer;
            this.setBanner();
        }
    },

    setBanner()
    {
        if(GameGlobal.SeverManager.UserInfo.is_status == 1 || GameGlobal.SeverManager.UserInfo.is_status == undefined)
        {
            this.index++;
            if(this.index >= this.BannerList.length)
            {
                this.index = 0;
            }
            var appInfo = this.BannerList[this.index];
            GameGlobal.HelperManager.createImage(appInfo.img,this.Sprite) ;
            this.node.targetOff(this);
            this.node.on(cc.Node.EventType.TOUCH_END, function(event)
            {
                GameGlobal.SeverManager.AssociatedProgramEvent(appInfo.appid,appInfo.url,appInfo.id);
            },this);
        }
    }
});
