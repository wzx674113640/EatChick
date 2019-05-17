
var SharePIC = [
    "https://img.qkxz.com/cj/share/11.jpg",
    "https://img.qkxz.com/cj/share/22.jpg",
    "https://img.qkxz.com/cj/share/33.jpg",
    "https://img.qkxz.com/cj/share/44.jpg",
    "https://img.qkxz.com/cj/share/55.jpg",
]

var ShareStr = [

    "吃鸡战队集合！集合！集合！",

    "哒哒哒哒~作为一名合格的LYB，捡漏才是正道",
    
    "吃鸡战场：偷听路人语音，竟无意间揭开主播开挂秘密",
    
    "开黑吗？吃鸡吗？王者大神带你飞",
    
    "左手平底锅，右手98K，头戴三级盔，身穿三级甲，来人就是干！"
];

var AdsManager =  cc.Class({
    extends: require("BaseManager"),

    onLoad()
    {
        this.videoAdID = 'adunit-b945c1eaf1e84590';
        this.bannerAdID = 'adunit-5522d5473431deb9';

        this.bottomPos = 0;//"不了谢谢"适配像素高度
        this.bannerAdHeight = 117; // 广告高度
        this.ipx = GameGlobal.SeverManager.UserInfo.ipx;
        this.screenHeight = GameGlobal.SeverManager.UserInfo.screenHeight;
        this.screenWidth =  GameGlobal.SeverManager.UserInfo.screenWidth;
        let sysInfo = GameGlobal.SeverManager.UserInfo.sysInfo;

        if(!CC_WECHATGAME)
            return;
        this.IsIPhoneX =  sysInfo.model.indexOf('iPhone X') == -1? false:true;
        this.ShareEvent = null; //分享事件
        this.action = null; //看视频事件
        this.SharePop = null //分享弹窗提示
      
        this.InitShareEvent();
        this.InitVideoEvent();
        this.ShareHideShow();
    },
   
    //初始化看视频事件
    InitVideoEvent()
    {
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this.videoAdID
        });
        var self = this;
        this.videoAd.onError(err => {
            //看视频失败回调
            //....
            //GameGlobal.HintManager.HideLoading();
            if(self.action!= null)
            {
                self.action();
                GameGlobal.HelperManager.ReductionVideoCount(GameGlobal.HelperManager.GetAllVideoCount());
                self.action == null;
            }
        })
    },

    //初始化右上角分享事件
    InitShareEvent() 
    {
        var value = Math.floor(Math.random()*ShareStr.length);
        this.ShareImg = SharePIC[value];
        this.ShareString = ShareStr[value];
        var actionImg= ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareImg = SharePIC[value];
            return this.ShareImg;
        }

        var actionTitle = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareString = ShareStr[value];
            return this.ShareString;
        }
        var self = this;
        //注册右上角转发事件
        wx.onShareAppMessage(()=>{
            return {
                title: actionTitle(),
                imageUrl: actionImg(),
                success(res){
                    
                },
                fail(res){
                   
                }
            } 
        });
        //显示右上角转发按钮
        wx.showShareMenu({
            withShareTicket: true
        });
        
    },


    //用离开和进入程序的回调判断分享
    ShareHideShow()
    {
        wx.onHide(()=>
        {
            var timeDate = new Date();
            this.hideTime = timeDate.getTime();
        })
        wx.onShow(()=>
        {
            var timeDate = new Date();
            var showTime = timeDate.getTime();
            var value = showTime - this.hideTime;
            if(value>3000)
            {
                if(this.ShareEvent!= null)
                {
                    //GameGlobal.HintManager.TitlePop("分享成功");
                    /*
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 800
                      })
                    */
                    this.ShareEvent();
                    this.ShareEvent = null;
                }
            }
            else if(value<3000)
            {
                if(this.SharePop!= null)
                {
                    this.SharePop();
                }
                //GameGlobal.HintManager.TitlePop("分享失败，请分享到不同的群");
            }
        })
    },

    //显示或者隐藏Banner 广告 会刷新广告
    ShowOrHideAdervert(Active)
    {
        if(!CC_WECHATGAME)
            return;
        if(Active) 
        {
            var self = this;
            let bannerAd = wx.createBannerAd({
                adUnitId: self.bannerAdID,
                style: {
                    left: 0,
                    top:0,
                    width:320
                }
                });
            bannerAd.onLoad(() => {
                
                //GameGlobal.UIManager.Close(Constant.UIPop.UIDownApp);

                if(this.IsIPhoneX)
                {
                    bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight - 34;
                }
                else
                {
                    bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight - 20;
                }
                
                bannerAd.style.left = (self.screenWidth - bannerAd.style.realWidth )/2;
                
                self.bannerAdHeight = bannerAd.style.realHeight;
                self.bottomPos = self.bannerAdHeight * self.ipx;
                
                bannerAd.show();
            });
            
            bannerAd.onError(err => {
                //GameGlobal.UIManager.ShowPop(Constant.UIPop.UIDownApp);
            })

            this.bannerAd = bannerAd;
        }
        else
        {
            if(this.bannerAd!=null&&this.bannerAd!=undefined)
            {
                this.bannerAd.destroy();
            }
        }
    },

    //显示或者隐藏Banner 广告 不刷新
    AdervertActive(active)
    {
        if(this.bannerAd!=undefined)
        {
            if(active)
            {
                this.bannerAd.show();
            }
            else
            {
                this.bannerAd.hide();
            }
        }
    },
    //看视频
    SeeVideoEvent(action,str = null,failAction = null)
    {
        if(!CC_WECHATGAME)
            return;
        var Count = GameGlobal.HelperManager.GetAllVideoCount();
        if(Count <= 0)
        {
            this.AddShareEvent(action);
            return;
        }
        //显示遮罩
        //GameGlobal.HintManager.ShowLoading();
        var self = this;
        this.action = action;
        this.failAction = failAction;
        this.str = str;
        this.videoAd.load().then(() => 
        {
            //GameGlobal.HintManager.HideLoading();
        });
        this.videoAd.show().then(()=>
        {
            //GameGlobal.HintManager.HideLoading();
        });
        this.videoAd.onClose(res => {
            self.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                if(self.str != null)
                {
                    wx.showToast({
                        title: self.str,
                        icon: 'success',
                        duration: 800
                    })
                }
                 if(self.action!= null)
                {
                    self.action();
                    self.action = null;
                    self.failAction = null;
                }
                GameGlobal.HelperManager.ReductionVideoCount(Count);
            } 
            else {
                if(self.failAction!= null)
                {
                    self.failAction();
                    self.failAction = null;
                    self.action = null;
                }
            }
            self.isSeeVideo = false;
        })
    },

    //注册分享事件
    AddShareEvent(action)
    {
        //分享弹窗
        this.SharePop = ()=>
        {
            GameGlobal.HintManager.ShowModel("分享失败，请重新分享试试！",()=>
            {
                this.AddShareEvent(this.ShareEvent);
                this.SharePop = null;
            },()=>
            {
                if(this.ShareEvent!= null)
                {
                    this.ShareEvent = null;
                } 
                this.SharePop = null;
            },"重新分享","#29a000","知道了","#333333");
        } 

        var actionImg= ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareImg = SharePIC[value];
            return this.ShareImg;
        }

        var actionTitle = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareString = ShareStr[value];
            return this.ShareString;
        }
        
        wx.shareAppMessage({
            title: actionTitle(),
            imageUrl: actionImg(),
        });
        this.ShareEvent = action;
    },

    AddShareEventFriend(action)
    {
        var query = "UID=" + GameGlobal.SeverManager.UserInfo.id;

        var actionImg= ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareImg = SharePIC[value];
            return this.ShareImg;
        }

        var actionTitle = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareString = ShareStr[value];
            return this.ShareString;
        }

        wx.shareAppMessage({
            title: actionTitle(),
            imageUrl: actionImg(),
            query: query,
        });

        this.ShareEvent = action;
    },

});
