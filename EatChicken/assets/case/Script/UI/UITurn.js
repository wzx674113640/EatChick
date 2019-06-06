

cc.Class({
    extends: cc.Component,

    properties: {
        ImgTurn:cc.Node,
        ImgLigth:cc.Node,
        LigthList:
        {
            type:cc.SpriteFrame,
            default:[]
        },
        PopNode:cc.Node,
    },

    onLoad () {
        this.RoundTimer = 1;
        this.RoundCount = 5;
        this.isLight = false;
        this.isRound = false;

        this.coolTimer = 0.2;
        this.Timer = this.coolTimer;

        this.ImgTurnIndex = 0; 
    },

    BtnClose()
    {
        this.node.active = false;
    },

    BtnAward()
    {
        var count =  wx.getStorageSync("AwardCount");
       
        count = Number(count);
        if(count > 0)
        {
            if(count == 5)
            {
                this.oneRound();
                count--;
                wx.setStorageSync("AwardCount",count);
            }
            else
            {
                GameGlobal.AdsManager.SeeVideoEvent(()=>
                {
                    this.oneRound();
                    count--;
                    wx.setStorageSync("AwardCount",count);
                })
            }
        }
        else
        {
            GameGlobal.HintManager.ShowToast("今日次数用尽");
        }
    },

    oneRound()
    {
        if(this.IsRound)
            return;
        this.IsRound = true;
        this.isLight = true;
        var InitAngle = this.ImgTurn.rotation - Math.floor(this.ImgTurn.rotation/360)*360;
        var Initimer = (360 - InitAngle) * (this.RoundTimer/360);
        
        var data = this.GetAngle();
        var overAngle = data.Angle;
        var overtimer = overAngle * (this.RoundTimer/360);

        var timer = this.RoundCount * this.RoundTimer + Initimer + overtimer;
        var angle = 360 * this.RoundCount +  (360 - InitAngle) + overAngle;
        
        var rotate = cc.rotateBy(timer, angle);
        rotate.easing(cc.easeExponentialOut());
        var call = cc.callFunc(()=>
        {
            this.isLight = false;
            this.Timer = this.coolTimer;
            this.ImgLigth.getComponent(cc.Sprite).spriteFrame = this.LigthList[2];
            this.IsRound = false;
            this.PopNode.getComponent("UITurnPop").ShowPop(data.Coin);
            
            if(data.Coin>=100)
            {
                GameGlobal.MsgCenter.emit("ChangCoin",data.Coin);
            }
            else if(data.Coin == 20||data.Coin == 21)
            {
                GameGlobal.SeverManager.C2G_BuyGun(data.Coin);
            }
            
        });
        this.ImgTurn.runAction(cc.sequence(rotate,call));
    },

    GetAngle()
    {
        var value = Math.floor(Math.random()*100);
        var Angle = 0;
        var coin = 1;
        if(0 <= value && value < 60)
        {
            //100 
            coin = 100;
            Angle = 22.5
            console.log("100");
        }
        else if(value < 75)
        {
            //200 
            coin = 200
            Angle =  67.5
        }
        else if(value < 88)
        {
            //400 
            coin = 400;
            Angle = 157.5
        }
        else if(value < 93)
        {
            //500 
            coin = 500;
            Angle = 202.5
        }
        else if(value < 96)
        {
            //600
            coin = 600;
            Angle = 247.5
        }
        else if(value < 98)
        {
            //1000 
            coin = 1000;
            Angle = 337.5
        }
        else if(value < 99)
        {
            //绝版枪支 
            coin = 20;
            Angle = 112.5;
        }
        else if(value < 100)
        {
            //绝版枪支 
            coin = 21;
            Angle = 292.5;
        }   
        return {
            "Coin":coin,
            "Angle":Angle
        }
    },

    update(dt)
    {
        if(this.isLight == false)
            return;
        this.Timer -= dt;
        if(this.Timer <=0)
        {
            this.Timer = this.coolTimer;
            if(this.ImgTurnIndex == 0)
            {   
                this.ImgTurnIndex = 1;
            }
            else
            {
                this.ImgTurnIndex = 0;
            }
            this.ImgLigth.getComponent(cc.Sprite).spriteFrame = this.LigthList[this.ImgTurnIndex];
        }
        
    }   
});
 