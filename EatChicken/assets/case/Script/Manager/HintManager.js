
var HintManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
        
    },

    onLoad()
    {
        this.LoadMask = cc.find("Canvas/LoadMask");
        this.PopNode = cc.find("Canvas/UIHint/PopNode");
        this.PopStr = this.PopNode.children[0].getComponent(cc.Label);
    },

    //提示框
    ShowToast(str)
    {
        if(!CC_WECHATGAME)
            return;
        wx.showToast({
            title: str,
            icon: 'success',
            duration: 2000
            })
    },

    
    ShowModel(str,EnterAction = null,FailAction = null,confirmText = "确定", confirmColor = "#576B95",cancelText = "取消",cancelColor = "#000000")
    {
        if(!CC_WECHATGAME)
            return;
        this.LoadMask.active = true;
        var self = this;
        wx.showModal({
            title: '提示',
            content: str,
            confirmText: confirmText,
            confirmColor:confirmColor,
            cancelText : cancelText,
            cancelColor:cancelColor,
            success(res) {
              if (res.confirm) 
              {
                if(EnterAction!= null)
                {
                    EnterAction();
                }
                self.LoadMask.active = false;
              } 
              else if (res.cancel) 
              {
                if(FailAction != null)
                {
                    FailAction();
                }
                self.LoadMask.active = false;
              }
            }
          })
    },

    ShowLoading()
    {
        if(!CC_WECHATGAME)
            return;
        this.LoadMask.active = true;
        wx.showLoading({
            title: '加载中',
        })
    },

    HideLoading()
    {
        if(!CC_WECHATGAME)
            return;
        this.LoadMask.active = false;
        wx.hideLoading();
    },

    TitlePop(str)
    {
        this.PopNode.active = true;
        this.PopNode.stopAllActions();
        this.PopStr.string = str;
        this.PopNode.setScale(0.1);
        var s1 = cc.scaleTo(0.2,1.3);
        var s2 = cc.scaleTo(0.1,1);
        var s3 = cc.scaleTo(1,1);
        var call = cc.callFunc(()=>
        {
            this.PopNode.active = false;
        },this);
        this.PopNode.runAction(cc.sequence(s1,s2,s3,call));
    }
});
