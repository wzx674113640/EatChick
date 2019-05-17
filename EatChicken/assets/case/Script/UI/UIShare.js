

cc.Class({
    extends: cc.Component,

    properties: {
        StateList:
        {
            type:cc.SpriteFrame,
            default:[]
        },
        Layout: cc.Node
    },

    start()
    {
        this.ItemList = this.Layout.children;
    },

    onEnable () {
        GameGlobal.SeverManager.C2G_FriendList((data)=>
        {   
            for(var i = 0;i < this.ItemList.length;i++)
            {
                this.ItemList[i].getComponent("ShareItem").setState(data[i]);
            }
        })
    },  

    BtnShare()
    {
        GameGlobal.AdsManager.AddShareEventFriend(()=>
        {
            GameGlobal.HintManager.TitlePop("好友通过分享进入，才能获得金币！");
        });
    },

    BtnClose()  
    {
        this.node.active = false;
    }
});
