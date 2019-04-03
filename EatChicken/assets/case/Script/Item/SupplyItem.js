

cc.Class({
    extends: cc.Component,

    properties: {
        GunName:cc.Label,
        BulletCount:cc.Label,
        ImgGun:cc.Sprite,
        Bullet:cc.Label, 
        Power:cc.Label,
        BtnEqui:cc.Node,
        BtnSupply:cc.Node,
        TotalCount:cc.Label,
        UISupply:cc.Node
    },

    setItem(data)
    {
        this.data = data;
        var id = Number(data.id)-1;
        if(id == 0)
        {
            this.BulletCount.string = "∞";
        }
        else
        {
            this.BulletCount.string = data.bullet;
        }
        
        this.GunName.string =  data.title;
        this.ImgGun.spriteFrame = GameControl.Config.Guns[id];

        this.baseGun = GameControl.Config.GunItems[id].getComponent("BaseGun");
        this.TotalCount.string = this.baseGun.TotalCount;
        var bu = Number(this.baseGun.Count) + 1;
        this.Bullet.string = "子弹"+ bu;
        this.Power.string = "伤害"+ this.baseGun.Power;
        if(data.bullet > 0||data.id == 1)
        {   
            this.BtnEqui.active = true;
            this.BtnSupply.active = false; 
        }
        else
        {
            this.BtnEqui.active = false;
            this.BtnSupply.active = true; 
        }
    },


    //装备按钮
    BtnEquiClick()
    {
        if(this.data == undefined)
            return;
        var self = this;
        GameGlobal.SeverManager.C2G_UserGun(self.data.id,()=>
        {
            var data = {};
            data.gunID = self.data.id;
            data.bullet = self.data.bullet;
            if(data.gunID == 1)
            {
                data.bullet = 9999;
            }
            data.PaseAimed = false;
            GameGlobal.MsgCenter.emit(Constant.Msg.UserGun,data);
            this.UISupply.active = false;
        });
    },

    BtnSupplyClick()
    {
        GameGlobal.AdsManager.SeeVideoEvent(()=>
        {
            this.data.bullet = this.baseGun.TotalCount;
            GameGlobal.SeverManager.UserInfo.GetBullet(this.data.id,this.data.bullet);
            this.BulletCount.string = this.baseGun.TotalCount;
            this.BtnEqui.active = true;
            this.BtnSupply.active = false;
            
            //打开获取物品UI;
        });
    }


});
