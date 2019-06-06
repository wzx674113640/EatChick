

cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar:cc.ProgressBar,
        BulletUI:cc.Node,
        NumBar:cc.Label,
        BG:cc.Node
    },

    onLoad () {
        this.version = 114;
        this.speed = 0.4;
        this.UIMainNode = cc.find("Canvas/UIMain");
        this.Domain = "https://cj.qkxz.com/?";
        if(!CC_WECHATGAME)
            return;
        var obj = wx.getLaunchOptionsSync();
        this.OtherUID = obj.query.UID == undefined? null:obj.query.UID;
        var Sence = obj.query.scene == undefined ? null : obj.query.scene;
        this._Sence = decodeURIComponent(Sence); //渠道过来的场景值
        this._AppID = obj.referrerInfo&&obj.referrerInfo.appId?obj.referrerInfo:"";
        this.gameID = 0;//当局游戏ID
        this.SEVER_COUNT = 0 ; //重复请求网络的次数
        /*
        wx.showLoading({
            title: '加载中',
        });
        */
        this.isupdate = true;
        this.LoadChildPack(); 
        this.Login();
        this.cooltime = 8;
        this.timer = this.cooltime;
    },

    

    Login()
    {
        var self = this;
        wx.login({
            success (res) {
                if (res.code) {
                    wx.request({
                        url: self.Domain + 'act=userinfo',
                        data: {
                            code: res.code,
                            nickName:"",
                            avatarUrl: "",
                            gender:"",
                            scene:self._Sence,
                            version: self.version,
                            uid:self.OtherUID,
                            appid:self._AppID
                        },
                        success (res) {
                            var Data =  res.data.data;
                            self.GetUser(Data);
                            self.C2G_AppID();
                            self.C2G_Banner();
                        },
                        fail()
                        {
                            if(self.SEVER_COUNT >= 2)
                            {
                                self.login();
                                self.SEVER_COUNT ++;
                            }
                            else
                            {
                                wx.showToast({
                                    title: "请检查网络!",
                                    icon: 'success',
                                    duration: 1500
                                });
                            }
                           
                          
                        }
                    });
                } 
            }
        })
       
    },

    GetUser(Data)
    {
        var self = this;
        self.Data = Data;
        wx.request({
            url: self.Domain + "act=user",
            data:
            {
                openid:self.Data.openid,
                version:self.version,
                scene:self._Sence,
                uid:0,
            },
            success (res) 
            {
                self.UserData = res.data.data;
                self.LoaderUIstart();
            },
            fail()
            {
                if(self.SEVER_COUNT >= 2)
                {
                    self.GetUser(Data);
                    self.SEVER_COUNT ++;
                }
                else
                {
                    wx.showToast({
                        title: "请检查网络!",
                        icon: 'success',
                        duration: 1500
                    })
                }
               
            }
        });
    },

    C2G_AppID()
    {
        var self =this; 
        wx.request({ 
            url:  self.Domain + "act=gamelist",
            data:
            {
                openid:self.Data.openid,
                version:self.version,
            },
            success (res) 
            {
                var data = res.data.data;
                self.gamelist = data.gamelist;
                self.LoaderUIstart();
            }
        })
    },
    
    C2G_Banner()
    {
        var self =this; 
        wx.request({ 
            url:  self.Domain + "act=banner",
            data:
            {
                openid:self.Data.openid,
                version:self.version,
            },
            success (res) 
            {
                var data = res.data.data;
                self.bannerlist = data;
            }
        })
    },


    
    //加载子包
    LoadChildPack()
    {
        cc.loader.downloader.loadSubpackage("case",(err)=>
        {
            if(err)
            {
                return console.error("分包加载失败");
            }
            //加载首页预制体
            this.LoadFirstPrefabs();
        })
    },

    Finish()
    {
        this.BG.active = false;
        this.isupdate = false;
    },

    LoaderUIstart(prefab = null)
    {
        if(this.bannerlist != undefined && this.gamelist != undefined && this.UIStart != undefined && this.UserData != undefined)
        {
            GameGlobal.MsgCenter.emit("InitSeverInfo");
        }
        /*
        if(prefab != null)
        {
            this.UIStartPre = prefab;
            this.isloder  = true;
        }
        else
        {
            this.isSever = true;
            if(this.UIStartPre == undefined)
                return;
        }
        if(this.isSever == true && this.isloder == true && this.bannerlist != undefined && this.gamelist != undefined)
        {   
            cc.find("Canvas").addComponent(require("GameGlobal"))
            var UINode = cc.instantiate(this.UIStartPre);
            this.UIStart = UINode;
            UINode.parent = this.UIMainNode;
            this.Finish();
        }
        */

    },

    LoaderUIstart1(prefab)
    {
        cc.find("Canvas").addComponent(require("GameGlobal"))
        var UINode = cc.instantiate(prefab);
        this.UIStart = UINode;
        UINode.parent = this.UIMainNode;
        this.Finish();
    },

    LoadFirstPrefabs()
    {
        cc.loader.loadRes('Prefabs/UIGameing', cc.Prefab, this._progressCallback.bind(this),(err, prefab) => {
            //this.Finish();
            //GameGlobal.MsgCenter.on("Finish",this.Finish.bind(this));
            //this.LoaderUIstart(prefab);
            this.LoaderUIstart1(prefab);
        });

        cc.loader.loadResDir("Sound",cc.assets,function(completeCount, totalCount, res)
        {
            
        });

        cc.loader.loadResDir("Prefabs/UI",cc.assets,function(completeCount, totalCount, res)
        {

        });
    },

    _progressCallback(completeCount, totalCount, res)
    {
        var value = completeCount / totalCount ;
        if(value<0.1)
        {
            this.ProgressBar.progress = 0.1;
        }
        else
        {
            this.ProgressBar.progress = completeCount / totalCount;
        }
        var BulletUIValue = this.ProgressBar.progress * this.ProgressBar.node.width;
        if(BulletUIValue <= 480)
        {
            this.BulletUI.x = BulletUIValue;
        }
        else
        {
            this.BulletUI.x = 480;
        }
        this.NumBar.string = Math.ceil(value*100)+"%";
    },
    
    update(dt)
    {
        return;
        if(!this.isupdate)
            return
        this.timer -= dt;
        if(this.timer <= 0)
        {
            var self = this;
            wx.showModal({
                title: '提示',
                content: "网络不稳定，点击确定重连！",
                success(res) {
                   self.Login();
                   self.isupdate = true;
                } 
            }),
            this.timer = this.cooltime;
            this.isupdate = false;
        }
    }
});
