
var SubManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
        
    },

    onLoad()
    {
        this.isShowSub = false;
        this.SubView = cc.find("Canvas/SubView").getComponent(cc.Sprite);
        if(!CC_WECHATGAME)
            return;
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 750;
        window.sharedCanvas.height = 1334;
    },
    
    // 显示好友排行
    ShowFrindRank(IsRequ = true)
    {
        if(!CC_WECHATGAME)
            return;
        this.ShowSub();
        if(IsRequ) //防止重复请求数据
        {
            window.wx.postMessage({
                messageType: 0,
            });
        }
    },

    //超越好友
    BeyondFriend(curscore)
    {
        if(!CC_WECHATGAME)
            return;
        //this.ShowSub();
        window.wx.postMessage({
            messageType: 3,
            score: curscore,
        });
    },
    
    //提交分数
    SubScore(curscore)
    {
        if(!CC_WECHATGAME)
            return;
        window.wx.postMessage({
            messageType: 2,
            score: curscore,
        });
    },

    //打开子域 
    ShowSub(isAlwaysShow = true) 
    {   
        if(isAlwaysShow == false)
        {
            this.isShowSub = false;
            this.updateChild();
        }
        else
        {
            this.isShowSub = true;
        }
    },

    //关闭子域
    HideSub()
    {
        this.isShowSub = false;
        this.SubView.node.active = false;
    },
    
    update(dt)
    {
        if(this.isShowSub == false)
            return;
        this.updateChild();
    },

    updateChild()
    {
        if (window.sharedCanvas != undefined&& window.sharedCanvas!=null) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.SubView.spriteFrame = new cc.SpriteFrame(this.tex);
            this.SubView.node.active = true;
        }
    },
});
