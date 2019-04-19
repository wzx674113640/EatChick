
cc.Class({
    extends: cc.Component,

    properties: {
       Check:cc.Node, //选中
       ClickUse:cc.Node, //点击使用
       NoHas:cc.Node, //未解锁

       Progress: cc.ProgressBar,

       PersonImg:cc.Sprite,
       
       Name: cc.Label,
       ProgressStr:cc.Label
    },

    onLoad () {
        this.SkinID = 0;
        this.State = ""; //状态  未解锁 未使用 使用中
        //this.des = ""; //描述
        GameGlobal.MsgCenter.on(Constant.Msg.UseSkin,this.UseSkinEvent.bind(this));
    },
    
    setState(data) //0未解锁 1 解锁未使用 2解锁使用中
    {
        this.data = data;
        var state = data.status;
        this.SkinID = data.id;
        this.Name.string =  data.title;
        this.PersonImg.spriteFrame = GameControl.Config.PlaySkins[this.SkinID - 1];

        switch(state)
        {
            case 0: 
                this.NoHasState();
                this.Progress.progress = Number(data.progress )/Number(data.total_progress);
                this.ProgressStr.string = data.progress + "/" + data.total_progress;
                break;
            case 1:
                this.ClickUseState();
                break;
            case 2:
                this.CheckState();
                break;
        }
    },

    UseSkinEvent(ID)
    {
        if(this.ID == this.SkinID)
        {
            if(this.State == "未使用")
            {
                this.CheckState();
            }
        }
        else
        {
            if(this.State == "使用中")
            {
                this.ClickUseState();
            }
        }
        
        
    },
    //使用状态
    CheckState()
    {
        this.Check.active = true;
        this.ClickUse.active = false;
        this.NoHas.active = false;
        this.State = "使用中";
    },

    ClickUseState()
    {
        this.Check.active = false;
        this.ClickUse.active = true;
        this.NoHas.active = false;
        this.State = "未使用";
    },

    NoHasState()
    {
        this.Check.active = false;
        this.ClickUse.active = false;
        this.NoHas.active = true;
        this.State = "未解锁";
    },

    BtnUseSkin()
    {
        if(this.State == "未使用")
        {
            //更换皮肤
            GameGlobal.MsgCenter.emit(Constant.Msg.UseSkin,this.SkinID);
            GameGlobal.SeverManager.C2G_skinbut(this.SkinID);
            this.CheckState();
        }
        else if(this.State == "未解锁")
        {
            //显示弹框 进度
            GameGlobal.MsgCenter.emit(Constant.Msg.SkinHint,this.data);
        }
    }
});
