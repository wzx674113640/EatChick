
var BasePerson = cc.Class({
    extends: cc.Component,

    properties: {
        _health:0,
        Health: {
            get()
            {
                return this._health;
            },
            set(value)
            {
                this._health = value;
                if(this._health<=0)
                {
                    this.Death();
                }
            },
            visible:false
        },
        Skin:cc.Sprite,
    },
    onLoad()
    {
        this.GunCom = null; //人物的枪
        this.GunComList = [];
        this.GunIDList = [];
        this.dir = 1;
        this.isDeath = false;
    },

    //初始化人物数据
    InitInfo(health,gunID,skin,dir) 
    {
        this.TotalHealth = health;
        this.Health = health;
        this.ChangeGun(gunID);
        this.Skin.spriteFrame = skin;
        this.node.scaleX = dir;
        this.dir = dir;
        this.GunCom.PaseAimed();
    },

   

    //跟换枪只
    ChangeGun(gunID)
    {
        var Gun = null;
       for(var i = 0;i<this.GunIDList.lenght;i++)
       {
            if(gunID == this.GunComList[i])
            {   
                Gun = this.GunComList["Gun"+gunID];
                break;
            }
       }

       if(Gun == null)
       {
           if(this.GunCom!=null)
           {
               this.GunCom.node.active = false;
           }
            var gunNode = GameControl.creatorGun(gunID);
            gunNode.parent = this.node;
            this.GunCom = gunNode.getComponent("BaseGun");
            this.GunComList["Gun" + gunID] = gunNode;
            this.GunIDList.push(gunID);
       }
       else
       {
            this.GunCom.node.active = false;
            Gun.active = true;
            this.GunCom = Gun.getComponent("BaseGun");
       }
    },

    //掉血
    DropBlood(PowerCount,isHitHead = false)
    {
        if(this.isDeath)
            return;
        if(isHitHead)
        {
          
        }
        else
        {
           
        }
        this.Health -= PowerCount;
    },
    
    //挂了
    Death()
    {
    },

    //射击
    Shit()
    {
        this.GunCom.Shit();
    },


});
