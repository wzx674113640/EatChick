// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Name:cc.Label,
        Title:cc.Label,
        MySprite:cc.Sprite
    },

    
    setImgItem(data)
    {
        GameGlobal.HelperManager.LoaderImage(data.img,this.MySprite);
        this.Name.string = data.title;
        //this.Title.string = data.des.length>5? data.des.slice(0,5)+"...":data.des;
        this.Title.string = data.click + "万人在玩";
        this.node.targetOff(this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            GameGlobal.SeverManager.AssociatedProgramEvent(data.appid,data.url,data.id);
        },this);
    }


});
