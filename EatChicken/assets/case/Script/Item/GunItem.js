

cc.Class({
    extends: cc.Component,

    properties: {
        GunID:0,
        BtnUse:cc.Node,
        Useing:cc.Node,
        Use: cc.Node,
        BtnLoack: cc.Node,
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
    },

    SetState(state,ID,name,mybullet,bullet) //0 未解锁 1//未使用 //2已使用
    {
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
        
        this.LabelCount.string = "子弹" + GameControl.Config.GunItems[this.GunID-1].getComponent("BaseGun").Count;
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

    //使用状态
    UseingState()
    {
        this.State = "Useing";
        this.Use.active = false;
        this.Useing.active = true;
        this.BtnLoack.active = false;
        this.BtnUse.active = false;

        this.LabelBulletCount.node.parent.active = true;
        this.LabelCount.node.active = true;
        this.LabelPower.node.active = true;
    },

    //未使用状态
    NoUseState()
    {
        this.State = "NoUes";
        this.Use.active = true;
        this.Useing.active = false;
        this.BtnLoack.active = false;
        this.BtnUse.active = true;
        
        this.LabelBulletCount.node.parent.active = true;
        this.LabelCount.node.active = true;
        this.LabelPower.node.active = true;
    },

    //未解锁状态
    LockState()
    {
        this.State = "LockState";
        this.Use.active = false;
        this.Useing.active = false;
        this.BtnLoack.active = true;
        this.BtnUse.active = false;
        
        this.LabelBulletCount.node.parent.active = false;
        this.LabelCount.node.active = false;
        this.LabelPower.node.active = false;
    }
});
