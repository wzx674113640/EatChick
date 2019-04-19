
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
        
        Wall: cc.Sprite,
        Bang: cc.Sprite,
        Light:cc.Sprite
    },

   
    onLoad () {
        this.startWidth = this.node.width;
        this.startRailUIWidth = this.railUI.width;
    },

    ChangeItem(index)
    {
        this.Wall.spriteFrame = GameControl.Config.WallSpris[index];
        this.Bang.spriteFrame = GameControl.Config.BangSpris[index];
        this.Light.spriteFrame = GameControl.Config.LightSpris[index];
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
        this.Wall.node.width = this.node.width;
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
