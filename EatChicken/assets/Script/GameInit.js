

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        this.UIMainNode = cc.find("Canvas/UIMain");
        if(!CC_WECHATGAME)
            return;
        wx.showLoading({
            title: '加载中',
        })
        this.LoadChildPack(); 
    },

    //加载子包
    LoadChildPack()
    {
        cc.loader.downloader.loadSubpackage("case",(err)=>
        {
            if(err)
            {
                return console.error("分包加载失败");
            }
            //加载首页预制体
            this.LoadFirstPrefabs();
        })
    },

    LoadFirstPrefabs()
    {
        cc.loader.loadRes('Prefabs/UI/UIGameing', cc.Prefab, (err, prefab) => {
            cc.find("Canvas").addComponent(require("GameGlobal"));
            var UINode = cc.instantiate(prefab);
            UINode.parent = this.UIMainNode;
            this.UIStart = UINode;
        });
    }
});
