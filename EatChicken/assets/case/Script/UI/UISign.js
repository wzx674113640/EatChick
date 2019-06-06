

cc.Class({
    extends: cc.Component,

    properties: {
        Layout:cc.Node,
        AlreadySign:cc.Node,
        NoSign:cc.Node
    },

    onLoad()
    {
        this.SignList = this.Layout.children;
    },

    onEnable () {
        GameGlobal.SeverManager.C2G_SignList((data)=>{
            var isSign =  data.is_sign == "1"?true:false;
            for(var i = 0;i < this.SignList.length;i++)
            {
                this.SignList[i].getComponent("SignItem").setSignItem(data.list[i]);
            }
            this.SginUI(isSign);
        });
    },

    SginUI(isSign)
    {
        if(isSign)
        {
            this.AlreadySign.active = true;
            this.NoSign.active =  false;
        }
        else
        {
            this.AlreadySign.active = false;
            this.NoSign.active =  true;
        }
    
    },

    Sgin()
    {
        GameGlobal.SeverManager.C2G_Sign((data)=>{
            var index = Number(data.num_day) - 1;
            this.SignList[index].getComponent("SignItem").setSgin();
            if(data.cat == 1)//金币
            {
                GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,Number(data.gold));
            }
            this.SginUI(true);
            GameGlobal.HintManager.ShowToast("签到成功");
        });
    },

    BtnShare()
    {   
        GameGlobal.AdsManager.AddShareEvent(()=>
        {
            this.Sgin();
        });
    },
    
    BtnVideo()
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            this.Sgin();
        });
    },

    BtnClose()
    {
        this.node.active = false;
    }
});
