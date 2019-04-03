
var HintManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
        
    },

    onLoad()
    {
        this.LoadMask = cc.find("Canvas/LoadMask");
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

    
    ShowModel(str,EnterAction = null,FailAction = null)
    {
        if(!CC_WECHATGAME)
            return;
        this.LoadMask.active = true;
        var self = this;
        wx.showModal({
            title: '提示',
            content: str,
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
    }
});
