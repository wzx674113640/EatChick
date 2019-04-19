
var UserInfo = require("UserInfo");

var SeverManager =  cc.Class({

    extends: require("BaseManager"),

    properties: {
        
    },  

    onLoad () 
    {
        this.Domain = "https://cj.qkxz.com/?";
        this.UserInfo = new UserInfo(); //用户信息
        
        if (!CC_WECHATGAME)
            return;
        
        var self = this;
        var Init = cc.find("Canvas").getComponent("GameInit")
        var Data = Init.Data;
        var infodata = Init.UserData;
        if(Data)
        {
            this.UserInfo.openid = Data.openid,
            this.UserInfo.id = Data.id;
            this.UserInfo.nickName = Data.nick_name;
            this.UserInfo.avatar_url = Data.avatar_url;
            this.UserInfo.BestScore = Data.score;
            
            if(Data.nick_name == null||Data.nick_name == "null")
            {
                //授权
                self.Authorization();
            }
            self.UserInfo.is_status = infodata.is_status;
            self.UserInfo.CurrentGun = infodata.aid;
            self.UserInfo.CurrentSkin = infodata.skin_id;
            self.UserInfo.Coin = Number(infodata.gold);
            self.UserInfo.CurrentBullet = infodata.bullet;
            self.UserInfo.Score = infodata.score;
            self.UserInfo.AppIDInfoList = Init.gamelist;
            
            //this.C2G_AppID(true);
            this.C2G_hzlist();
        }
        else
        {
            console.error("获取不到服务器数据！！！！！！！！！！");
        }
        var obj = wx.getLaunchOptionsSync();
        var Sence = obj.query.scene == undefined ? null : obj.query.scene;
        this._Sence = decodeURIComponent(Sence); //渠道过来的场景值
        this._AppID = obj.referrerInfo&&obj.referrerInfo.appId?obj.referrerInfo:"";
        this.gameID = 0;//当局游戏ID
       
    },  

    start()
    {
        if (!CC_WECHATGAME)
            return;
        //UIGameing.HomePageUI(self.UserInfo);
    },

    Login()
    {
        return new Promise((resolve, reject) =>
        {
            var self = this;
            wx.login({
                success (res) {
                    if (res.code) {
                        self.UserInfo.code = res.code
                        wx.request({
                            url: self.Domain + 'act=userinfo',
                            data: {
                                code: self.UserInfo.code,
                                nickName:self.UserInfo.nickName,
                                avatarUrl: self.UserInfo.avatar_url,
                                gender:self.UserInfo.gender,
                                scene:self._Sence,
                                version:self.UserInfo.version,
                                uid:0,
                                appid:self._AppID
                            },
                            success (res) {
                                var Data =  res.data.data;
                                self.UserInfo.openid = Data.openid,
                                self.UserInfo.id = Data.id;
                                self.UserInfo.nickName = Data.nick_name;
                                self.UserInfo.avatar_url = Data.avatar_url;
                                self.UserInfo.BestScore = Data.score;
                                if(Data.nick_name == null||Data.nick_name == "null")
                                {
                                    //授权
                                    self.Authorization();
                                }
                                resolve(true);
                            },
                            fail()
                            {
                                wx.showToast({
                                    title: "网络数据请求失败",
                                    icon: 'success',
                                    duration: 800
                                });
                                resolve(false);
                            }
                        });
                    } 
                }
            })
        });
        
    },

    //授权
    Authorization()
    {
        let width = this.UserInfo.screenWidth;
        let height = this.UserInfo.screenHeight;
        var ipx = this.UserInfo.ipx;

        var RankLogo_Y =  200; //y坐标
        var RankLogo_X =  -292; //x坐标
        var RankLogo_Width = 106; //宽
        var RankLogo_Height = 135; //高 

        var _top = (height * ipx/2 + RankLogo_Y - RankLogo_Width/2)/ipx; //553 y，48 宽除以2
        var _left = (width * ipx/2 + RankLogo_X - RankLogo_Width/2)/ipx; //216.2 x

        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: _left,
                top: _top,
                width: RankLogo_Width/ipx,
                height: RankLogo_Height/ipx,
                textAlign: 'center'
            }
        });

        this.button = button;
        var self = this;
        button.onTap((res) => {
            if(res.userInfo)
            {
                var Data = res.userInfo;
                self.UserInfo.nickName = Data.nickName;
                self.UserInfo.avatar_url = Data.avatarUrl;
                self.UserInfo.gender = Data.gender;
                button.destroy();
                self.button = null;

                wx.login({
                    success (res) {
                        if (res.code) {
                            self.UserInfo.code = res.code
                        }
                        wx.request({
                            url: self.Domain + 'act=userinfo',
                            data: {
                                code: self.UserInfo.code,
                                nickName:self.UserInfo.nickName,
                                avatarUrl: self.UserInfo.avatar_url,
                                gender:self.UserInfo.gender,
                                scene:self._Sence,
                                uid:0,
                                version:self.UserInfo.version,
                            },
                        });
                    }
                    });
            }
        })
    },

    ShowHideButton(active)
    {
        if(this.button != null && this.button!=undefined)
        {
            if(active)
            {
                this.button.show();
            }
            else
            {
                this.button.hide();
            }
        }
    },

    C2G_User()
    {
       
        var self = this;
        wx.request({
            url: self.Domain + "act=user",
            data:
            {
                openid:self.UserInfo.openid,
                version:self.UserInfo.version,
                scene:self._Sence,
                uid:0,
            },
            success (res) 
            {
                var infodata = res.data.data;
                self.UserInfo.is_status = infodata.is_status;
                self.UserInfo.CurrentGun = infodata.aid;
                self.UserInfo.CurrentSkin = infodata.skin_id;
                self.UserInfo.Coin = Number(infodata.gold);
                self.UserInfo.CurrentBullet = infodata.bullet;
                self.UserInfo.Score = infodata.score;
                //GameGlobal.MsgCenter.emit(Constant.Msg.HomePage,self.UserInfo);
                UIGameing.HomePageUI(self.UserInfo);
            },
            fail()
            {
                wx.showToast({
                    title: "网络数据请求失败",
                    icon: 'success',
                    duration: 800
                })
            }
        });
    },

    

    //游戏开始
    C2G_GameStart()
    {
        if (!CC_WECHATGAME)
            return;
        var self =this; 
        wx.request({
            url:  this.Domain + "act=index",
            data:
            {
                openid: self.UserInfo.openid,
                version: self.UserInfo.version
            },
            success (res) {
                var data = res.data.data;
                self.gameID = data.id;
                for(var i = 0;i < data.alist.length;i++)
                {   
                    self.UserInfo.AddGunsList(data.alist[i]);
                }
            }
          })
    },

    //C2G游戏结束
    C2G_GameOver(Score,level,Coin)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        var gunlistJosn = this.UserInfo.GunListToJson();
        wx.request({
            url:  this.Domain + "act=end&openid=" + self.UserInfo.openid + "&score="+Score+"&id="+self.gameID+"&gold="+Coin+"&version="+self.UserInfo.version +"&level="
            +level,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data:
            {
                //openid:self.UserInfo.openid,
                //score: Score,
                //id : self.gameID,
                //gold: Coin,
                //version:self.UserInfo.version,
                //level:level,
                details:gunlistJosn
            },
            
            success (res)
            {
                
            }
          });
        //向子域提交信息
        GameGlobal.SubManager.SubScore(Score);
    },

    C2G_Rank(action)
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=paihang',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
            },
            success (res) {
                action(res);
            }
        });
    },
    
    //跳转其他游戏
    AssociatedProgramEvent(AppID,url,ID)
    {
        var self = this;
        wx.navigateToMiniProgram({
            appId: AppID,
            path: url,
            envVersion: 'release',
            success(res) {
                wx.request({
                    url: self.Domain +"act=cgame",
                    data: {
                      openid: self.UserInfo.openid,
                      version: self.UserInfo.version,
                      id: ID,
                      appid:AppID
                    },
                  });
            }
          })
        wx.request({
            url:this.Domain +'act=game',
            data:
            {
                openid:self.UserInfo.openid,
                version:self.UserInfo.version,
                id:ID,
            },
        });
    }, 

    C2G_UserGun(gunID,action = null)
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=armourybut',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                id:gunID
            },
            success (res) {
                if(!!action)
                {
                    action();
                }
            }
        });
    },

    C2G_BuyGun(gunID,action)
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=armourybuy',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                id:gunID
            },
            success (res) {
                action(res);
            }
        });
    },

    C2G_GunList(action)
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=armourylist',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version
            },
            success (res) {
                action(res);
            }
        });
    },

    C2G_ChangeCoin(action,type,coin) //1加 -1减
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=gold',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                type:type,
                gold:coin
            },
            success (res) {
                action();
            }
        });
    },

    C2G_hzlist()
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=hzlist',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
            },
            success (res) {
                self.UserInfo.hzlist = res.data.data;
                GameGlobal.UIManager.ShowApp(Constant.UIPop.UIAppBox,(node)=>
                {
                    //node.getComponent("UIAppBox").ShowBox(res.data.data);
                    //node.active = false;
                    self.UIAppBox = node;
                });
            }
        });
    },
    
    C2G_fdcount(type = 0)
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=fdcount',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                type: type
            },
            success (res) {

            }
        });
    },
    
    //皮肤列表
    C2G_skinlist(action)
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=skinlist',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
            },
            success (res) {
                action(res.data.data);
            }
        });
    },

    //使用皮肤
    C2G_skinbut(id)
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=skinbut',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                id:id
            },
            success (res) {
                
            }
        });
    },

    C2G_addbullet(id)
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=addbullet',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
                id:id
            },
            success (res) {
                
            }
        });
    },

});
