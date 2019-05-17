

cc.Class({
    extends: cc.Component,

    properties: {
        Egg:cc.Node,
        EggSprites:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        Progress:cc.ProgressBar,
        Hammer:cc.Animation,
        
        speed:0.5,
        BtnSpeed:0.1,
    },


    onEnable()
    {
        //GameGlobal.AdsManager.AdervertActive(false);
        this.Egg.getComponent(cc.Sprite).spriteFrame = this.EggSprites[0];
        this.ClickCount = 12;
    },

    onDisable()
    {
        //GameGlobal.AdsManager.AdervertActive(true);
    },

    BtnHit()
    {
        this.Progress.progress += this.BtnSpeed;
        this.ClickCount--;
        this.Hammer.play("Hammer");
        if(this.Progress.progress > 0.5)
        {
            this.Egg.getComponent(cc.Sprite).spriteFrame = this.EggSprites[1];
        }
        if(this.ClickCount< 0)
        {
            this.Close();
        }
    },

    update(dt)
    {
        if(this.Progress.progress>0)
        {
            this.Progress.progress -= dt * this.speed;
        }
    },

    Close()
    {
        var UICom = this.node.parent.getComponent("UIResurrection");
        this.node.active = false;
        var value = this.Progress.progress>1? 1:this.Progress.progress;
        UICom.CoinPanel.getComponent("UICoinPanel1").ShowCoinPanel(value);
    }
});
