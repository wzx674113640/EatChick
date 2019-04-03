
var WallInfo = require("WallInfo");

cc.Class({
    extends: cc.Component,

    properties: {
        /*
        MinWidth : 0,
        MaxWidth : 300,
        MinHeight: 0,
        MaxHeight: 200,
        */
        railUI:cc.Node,
        
        ItemsUI:
        {
            type:cc.Node,
            default:[]
        },
    },

   
    onLoad () {
        this.startWidth = this.node.width;
        this.startRailUIWidth = this.railUI.width;
    },

    ShowOneCoin()
    {
        this.ImgCoin.active = true;
    },


    OneCoinAni()
    {
        var m = cc.moveTo(0.8,cc.v2(0,y));

        var call = cc.callFunc(()=>
        {
            this.ImgCoin.active = false;
            GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,2);
        },this);
        this.ImgCoin.runAction(cc.sequence(m,call));
    },
    
    Init(dir,lastPos)
    {
        WallInfo.setLevel(GameControl.player.PlayInfo.Level);

        this.MinWidth = WallInfo.wallConfig.MinWidth;
        this.MaxWidth = WallInfo.wallConfig.MaxWidth;

        this.MinHeight = WallInfo.wallConfig.MinHeight;
        this.MaxHeight = WallInfo.wallConfig.MaxHeight;

        this.railUI.width = this.startRailUIWidth;
        this.node.width = this.RandomTwo(this.MinWidth,this.MaxWidth);
        var coe = this.node.width/this.startWidth;
        this.railUI.width = this.railUI.width * coe;
        var Height = this.RandomTwo(this.MinHeight,this.MaxHeight);

        this.showItem();
        var y = lastPos.y + Height;
        this.node.scaleX = dir;
        if(dir==1)
        {
            this.node.setPosition(-375,y);
            this.PersonPos = cc.v2(-375 + this.node.width - 50,y);
        }
        else
        {
            this.node.setPosition(375,y);
            this.PersonPos =cc.v2(375 - this.node.width + 50,y);
        }
    },


    RandomTwo(min,max)
    {
        var value = min + Math.floor(Math.random()*(max-min));
        return value;
    },
    
    showItem()
    {
        var index = Math.floor(Math.random()*this.ItemsUI.length);
        for(var i = 0;i<this.ItemsUI.length;i++)
        {
            if(index == i)
            {
                this.ItemsUI[i].active = true;
            }
            else
            {
                this.ItemsUI[i].active = false;
            }
        }
    }
});
