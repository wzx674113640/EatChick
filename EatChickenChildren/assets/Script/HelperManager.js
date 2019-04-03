

var HelperManager =  cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad()
    {
        window.HelperManager = this;
        this.urlList = [];
        this.sFlist = [];
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
    }

});
