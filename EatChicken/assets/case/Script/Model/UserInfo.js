
var userInfo =  cc.Class({
 
    properties: {
        Coin : 0,//金币
        BestScore: 0,//最高分
        GunsList:[], //拥有的枪

        CurrentGun:1,//当前枪支ID
        CurrentBullet:0,//当前枪支子弹

        HasSkins:[], //拥有的皮肤
        CurrentSkin:1,//当前的皮肤
        
        screenWidth:0,
        screenHeigth:0,
        ipx:0,

        openid:0,
        id:0,
        nickName: null, //昵称
        avatar_url: null,//头像
        code: null,
        gender:null, //性别
        
        version:100, //版本号
        is_status:1,//审核状态  默认非审核状态

        views:null,// 进入游戏后跳转其他游戏的页面 数据
        AppIDInfoList:null// 导出游戏的图标数据
    },

    ctor()
    {
        this.getSystemInfo();
    },

    getSystemInfo()
    {
        if(!CC_WECHATGAME)
            return;
        var sysInfo = window.wx.getSystemInfoSync();
        this.sysInfo = sysInfo;
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeigth = sysInfo.screenHeight;
        this.ipx = 750/this.screenWidth;
    },

    AddGunsList(data)
    {
        for(var i = 0;i < this.GunsList.length;i++)
        {
            if(this.GunsList[i].id == data.id)
                return;
        }
        var alist = {};
        alist.id = data.id; 
        alist.bullet = data.bullet;
        alist.title = data.title;

        this.GunsList.push(alist);
    },

    GunListToJson()
    {
        var json  = JSON.stringify(this.GunsList);
        return json;
    },

    SaveBullet()
    {
        if(this.GunsList.length == 0)
            return;
        for(var i = 0;i < this.GunsList.length;i++)
        {
            if(this.CurrentGun == this.GunsList[i].id)
            {
                this.GunsList[i].bullet = this.CurrentBullet;
            }
        }
    },

    GetBullet(id,count)
    {
        if(this.GunsList.length == 0)
            return;
        for(var i = 0;i < this.GunsList.length;i++)
        {
            if(id == this.GunsList[i].id)
            {
                this.GunsList[i].bullet = count;
            }
        }
    },

    ChangeGun(gunID)
    {
        if(this.GunsList.length == 0)
            return;
        this.CurrentGun = gunID;
        for(var i = 0;i < this.GunsList.length;i++)
        {
            if(gunID == this.GunsList[i].id)
            {
                this.CurrentBullet = this.GunsList[i].bullet;
            }
        }
    }
});
