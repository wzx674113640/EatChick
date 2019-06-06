

var HelperManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
       
    },

    onLoad()
    {
        this.urlList = [];
        this.sFlist = [];
        this.VideoCount = 7;
        this.DimondCount = 5;
        //this.IsPassDay();
    },
    
    createImage(avatarUrl,ImgHead) {
        var index = -1;
        for(var i = 0;i<this.urlList.length;i++)
        {
            if(avatarUrl == this.urlList[i])
            {
                index = i;
                break;
            }
        }
        if(index==-1)
        {
            let image = window.wx.createImage();
            image.onload = function()
            {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                ImgHead.spriteFrame = new cc.SpriteFrame(texture);
            };
            image.src = avatarUrl;
        }
        else
        {
            ImgHead.spriteFrame = this.sFlist[index];
        }
    } ,

    LoaderImage(url,_sprite) {

        var index = -1;
        
        for(var i = 0;i<this.urlList.length;i++)
        {
            if(url == this.urlList[i])
            {
                index = i;
                break;
            }
        }
        
        if(index==-1)
        {
            var self = this;
            cc.loader.load(url, function (err, texture) {
                var spriteFrame  = new cc.SpriteFrame(texture);
                _sprite.spriteFrame = spriteFrame;
                self.urlList.push(url);
                self.sFlist.push(spriteFrame);
            });
        }
        else
        {
            _sprite.spriteFrame = this.sFlist[index];
        }
    },

    //是否过了一天
    IsPassDay()
    {
        var turnCount = wx.getStorageSync("AwardCount");
        if(turnCount == "" || turnCount == null)
        {
            wx.setStorageSync("AwardCount",5);
        }
        var ItemDay = wx.getStorageSync("Day");
        var ItemMonth = wx.getStorageSync("Month");
        var data = new Date();
        var day = data.getUTCDate();
        var month = data.getUTCMonth();
        if(ItemDay === ""||ItemDay === null)
        {
            this.ReSetCount();
            wx.setStorageSync("Day",day);
            wx.setStorageSync("Month",month);
            return "FirstGame";
        }
        else
        {
         
            if(month-ItemMonth>0)
            {
                this.ReSetCount();
                wx.setStorageSync("Day",day);
                wx.setStorageSync("Month",month);
                return true ;//重置道具
            }
            else
            {
                if(day - ItemDay>0)
                {
                    this.ReSetCount();
                    wx.setStorageSync("Day",day);
                    wx.setStorageSync("Month",month);
                    return true; 
                }
                else
                {
                    return false;
                }
            }
        }
    },

//更新每天的次数
    ReSetCount()
    {
        wx.setStorageSync("DimondCount",this.DimondCount);
        wx.setStorageSync("VideoCount",this.VideoCount);
        wx.setStorageSync("AwardCount",5);
    },


//限制看得砖石的次数
    GetDimondVideoCount()
    {
        var ItemDimondCount = wx.getStorageSync("DimondCount");
        if(ItemDimondCount === ""||ItemDimondCount === null)
        {
            wx.setStorageSync("DimondCount",this.DimondCount);
            ItemDimondCount = this.DimondCount;
            return ItemDimondCount;
        }
        else
        {
            return ItemDimondCount;
        }
    },
    
    ReductionDimondCount(Count)
    {
        //var dimonCount = this.GetDimondVideoCount();
        Count--;
        wx.setStorageSync("DimondCount",Count);
    },

//限制今天看视频的次数
    GetAllVideoCount()
    {
        var Vcount = this.VideoCount;
        
        var ItemVideoCount = wx.getStorageSync("VideoCount");
        if(ItemVideoCount === ""|| ItemVideoCount === null)
        {
            wx.setStorageSync("VideoCount",Vcount);
            return Vcount;
        }
        else
        {
            return ItemVideoCount;
        }
    },

    ReductionVideoCount(Count)
    {
        //var videoCount = this.GetAllVideoCount();
        Count--;
        wx.setStorageSync("VideoCount",Count);
    }

});
