

cc.Class({
    extends: cc.Component,

    properties: {
       Title:cc.Label,
       GunSprite:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable()
    {
        var indexlist = [1,2,3,4,5,6,7,8,9];
        var index = GameGlobal.SeverManager.UserInfo.CurrentGun;
        indexlist.splice(index,1);
        this.key = Math.floor(Math.random()*indexlist.length);
        this.key1 = indexlist[this.key];
        this.GunValue = GameControl.Config.GunItems[this.key1].getComponent("BaseGun");
        var SpriteValue = GameControl.Config.Guns[this.key1];
        this.Title.string = "恭喜获得" + this.GunValue.Name + ",子弹8发";
        this.GunSprite.spriteFrame = SpriteValue;
    },

    BtnGet() 
    {
        var action = ()=>
        {
            var ID = this.key1 ;
            GameControl.player.ChangeGun(ID);
            GameControl.player.GunCom.setBulletCount(8);
            GameControl.player.isSelfGun = false; //临时枪
            this.node.active = false;
        }

        if(GameGlobal.SeverManager.UserInfo.is_status != 1)
        {
            //视频
            GameGlobal.AdsManager.SeeVideoEvent(()=>
            {
                action();
            })
        }
        else
        {
            //分享
            GameGlobal.AdsManager.AddShareEvent(()=>
            {
                action();
            });
        }
    },

    BtnColse()
    {
        this.node.active = false;
    },
    
});
