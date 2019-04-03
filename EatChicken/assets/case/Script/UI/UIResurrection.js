
cc.Class({
    extends: cc.Component,

    properties: {
       LabelTimer : cc.Label,
       LabelLevel : cc.Label,
       Not:cc.Widget
    },

    onEnable()
    {
        this.LabelLevel.string = GameControl.player.PlayInfo.Level;
        this.timer = 9;
        this.coolTimer = this.timer;
        this.LabelTimer.string = this.coolTimer;
        this.onceTimer = 0;
        this.isStartTimer = true;
        GameGlobal.SubManager.ShowSub();
        this.Not.Target = cc.find("Canvas");
        this.Not.bottom = GameGlobal.AdsManager.bottomPos + 60;
    },

    onDisable()
    {
        GameGlobal.SubManager.HideSub();
    },

    BtnSeeResurrection()
    {
        this.isStartTimer = false;
        var self = this;
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            GameGlobal.MsgCenter.emit(Constant.Msg.Resurrection);
            self.node.active = false;
        },()=>
        {
            this.isStartTimer = true;
        },
        ()=>
        {
            this.isStartTimer = true;
        });
    },

    BtnTanks()
    {
        this.node.active = false;
        //GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
        //GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,false);
        GameGlobal.UIManager.ShowPop(Constant.UIPop.UIGameOver);
    },
    
    update(dt)
    {
        if(!this.isStartTimer)
            return;
        this.onceTimer += dt;
        if(this.onceTimer>=1)
        {
            this.onceTimer = 0;
            this.coolTimer--;
            this.LabelTimer.string = this.coolTimer;
            
            if(this.coolTimer < 0)
            {
                this.BtnTanks();
            }
        }
    }
});
