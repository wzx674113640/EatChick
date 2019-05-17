

cc.Class({
    extends: cc.Component,

    properties: {
        GunID:0,
        Has:cc.Node,
        HasNoUse:cc.Node,
        NoHas:cc.Node,
        BtnGetBullet:cc.Node,


        Title:cc.Label,
        ImgGun:cc.Sprite,

        LabelPower: cc.Label,
        LabelCount: cc.Label,
        LabelBulletCount: cc.Label
    },

    onLoad()
    {
        this.State = "";
        this.Bullet = 0;
        GameGlobal.MsgCenter.on(Constant.Msg.BuyGun,this.BuyGun.bind(this)); //监听买枪事件
        GameGlobal.MsgCenter.on(Constant.Msg.UserGun,this.CanleUseState.bind(this)); //监听使用枪
    },

    BuyGun(gunID)
    {
        if(gunID != this.GunID)
            return;
        if( this.State = "LockState")
        {
            this.NoUseState();
        }
    },

    CanleUseState(data)
    {
        if(data.gunID == this.GunID)
            return;
        if(this.State == "Useing")
        {
            this.NoUseState();
        }
    },

    //使用枪支
    BtnUseGun()
    {
        if(this.State == "NoUes")
        {
            GameGlobal.SeverManager.C2G_UserGun(this.GunID,()=>
            {
                this.UseingState();
                var data = {};
                data.gunID = this.GunID;
                if(data.gunID == 1)
                {
                    data.bullet = 9999; 
                }
                else
                {
                    data.bullet = this.Bullet;
                }
                data.PaseAimed = true;
                GameGlobal.MsgCenter.emit(Constant.Msg.UserGun,data);
                
            });
        }
        else if(this.State == "LockState")
        {
            GameGlobal.HintManager.TitlePop("该枪支未解锁");
        }
    },

    SetState(state,ID,name,mybullet,bullet) //0 未解锁 1//未使用 //2已使用
    {
        this.TitolBullet = bullet;
        this.GunID = Number(ID);
        if(ID == 1)
        {
            this.LabelBulletCount.string = "∞";
            this.Bullet = 9999;
        }
        else
        {
            this.LabelBulletCount.string = mybullet + "/" + bullet;
            this.Bullet = Number(mybullet);
        }
        
        this.LabelCount.string = "子弹" + (GameControl.Config.GunItems[this.GunID-1].getComponent("BaseGun").Count + 1);
        this.LabelPower.string = "伤害" + GameControl.Config.GunItems[this.GunID-1].getComponent("BaseGun").Power;

        
        var index= Number(ID) - 1;
        this.ImgGun.spriteFrame = GameControl.Config.Guns[index];
        this.Title.string = name;
       

        if(state == 0)
        {
            this.LockState();
        }
        else if(state == 1)
        {
            this.NoUseState();
        }   
        else if(state == 2)
        {
           this.UseingState();
        }
    },

    BtnBulletClick()
    {
        var self = this;
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            self.Bullet = self.TitolBullet;
            self.LabelBulletCount.string = self.Bullet + "/" + self.TitolBullet;
            self.BtnGetBullet.active = false;
            GameGlobal.SeverManager.UserInfo.GetBullet(self.GunID,self.Bullet);
            var data = {};
            data.gunID = self.GunID;
            data.bullet = self.TitolBullet;
            if(self.GunID == 1)
            {
                data.bullet = 9999;
            }
            data.PaseAimed = true;
            GameGlobal.MsgCenter.emit(Constant.Msg.UserGun,data);
            GameGlobal.SeverManager.C2G_addbullet(self.GunID);
        });
    },

    //使用状态
    UseingState()
    {
        this.State = "Useing";
        this.Has.active = true;
        this.HasNoUse.active = false;
        this.NoHas.active = false;
        
        if(this.GunID != 1 && this.Bullet <= 0)
        {
            this.BtnGetBullet.active = true;
            this.LabelPower.node.active = false;
        }
        else
        {
            this.BtnGetBullet.active = false;
            this.LabelPower.node.active = true;
        }
    },
    
    //未使用状态
    NoUseState()
    {
        this.State = "NoUes";
        this.Has.active = false;
        this.HasNoUse.active = true;
        this.NoHas.active = false;
    },

    //未解锁状态
    LockState()
    {
        this.State = "LockState";
        this.Has.active = false;
        this.HasNoUse.active = false;
        this.NoHas.active = true;
    }
});
