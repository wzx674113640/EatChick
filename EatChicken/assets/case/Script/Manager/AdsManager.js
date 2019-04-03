
var SharePIC = [
    "https://img.qkxz.com/cj/share/1.jpg",
    "https://img.qkxz.com/cj/share/2.jpg",
    "https://img.qkxz.com/cj/share/3.jpg",
    "https://img.qkxz.com/cj/share/4.jpg",
    "https://img.qkxz.com/cj/share/5.jpg",
]

var ShareStr = [
    "15倍手枪爆头，一枪一个准。",
    "在我鸡霸面前，没有吃不到的鸡。",
    "老表快上车，带你装逼带你飞！。",
    "说好的一起吃鸡，结果你却单飞了！",
    "吃鸡是不可能吃鸡了，吃个鸡屁股吧！",
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
        this.screenHeight = GameGlobal.SeverManager.UserInfo.screenHeigth;
        this.screenWidth =  GameGlobal.SeverManager.UserInfo.screenWidth;
        let sysInfo = GameGlobal.SeverManager.UserInfo.sysInfo;


        if(!CC_WECHATGAME)
            return;
        this.IsIPhoneX =  sysInfo.model.indexOf('iPhone X') == -1?true:false;
        this.ShareEvent = null; //分享事件
        this.action = null; //看视频事件
        
      
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
            GameGlobal.HintManager.HideLoading();
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
        var self = this;
        //注册右上角转发事件
        wx.onShareAppMessage(()=>{
            return {
                title: self.ShareString,
                imageUrl: self.ShareImg,
                success(res){
                    var value = Math.floor(Math.random()*SharePIC.length);
                    this.ShareImg = SharePIC[value];
                    this.ShareString = ShareStr[value];
                },
                fail(res){
                    var value = Math.floor(Math.random()*SharePIC.length);
                    this.ShareImg = SharePIC[value];
                    this.ShareString = ShareStr[value];
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
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 800
                      })
                    this.ShareEvent();
                    this.ShareEvent = null;
                }
            }
            else if(value<3000)
            {
                if(this.ShareEvent!= null)
                {
                    this.ShareEvent = null;
                }
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
                    top: self.screenHeight-130,
                    width: self.screenWidth,
                    height: 200,
                }
                });
            bannerAd.onLoad(() => {
                if(this.IsIPhoneX)
                {
                    bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight;
                }
                else
                {
                    bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight-20;
                }
                self.bannerAdHeight = bannerAd.style.realHeight;

                self.bottomPos = self.bannerAdHeight * self.ipx;
                
                bannerAd.show();
            });
            
            bannerAd.onError(err => {
                
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
        GameGlobal.HintManager.ShowLoading();
        var self = this;
        this.action = action;
        this.failAction = failAction;
        this.str = str;
        this.videoAd.load().then(() => 
        {
            GameGlobal.HintManager.HideLoading();
        });
        this.videoAd.show().then(()=>
        {
            GameGlobal.HintManager.HideLoading();
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
        var value = Math.floor(Math.random() * ShareStr.length);
        this.ShareImg = SharePIC[value];
        this.ShareString = ShareStr[value];
        wx.shareAppMessage({
            title: this.ShareString,
            imageUrl: this.ShareImg,
        });
        this.ShareEvent = action;
    },
});
