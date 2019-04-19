
var TitleList = [
    "每周推荐",
    "最新上架",
    "必玩精品"];

cc.Class({
    extends: cc.Component,

    properties: {
       Content: cc.Node,
       Item:cc.Node,
       TopImg:cc.Node,
       LeftBtns: cc.Node,
       View:cc.Node
    },
    
    onLoad()
    {
        var UserInfo = GameGlobal.SeverManager.UserInfo
        this.node.y = UserInfo.screenHeight * UserInfo.ipx /2;
        //var startH = this.TopImg.height;
        //this.TopImg.height = startH * UserInfo.ipx;
        // this.titlePoor = this.TopImg.height - startH;
        this.titlePoor = 0;
        if(UserInfo.MeansButtonInfo != null)
        {
            this.LeftBtns.y =  -UserInfo.ipx * (UserInfo.MeansButtonInfo.top + UserInfo.MeansButtonInfo.height/2) ;
            var TopWidth = UserInfo.screenHeight * UserInfo.ipx /2 - UserInfo.MeansY + 64;
            this.widthOffs = TopWidth - this.TopImg.height ;
            this.TopImg.height = TopWidth;
            this.View.y -= this.widthOffs;
        }
        this.ShowBox(UserInfo.hzlist);
    },

    onEnable()
    {
       GameGlobal.SeverManager.C2G_fdcount();
       GameGlobal.AdsManager.AdervertActive(false);
       GameGlobal.SeverManager.ShowHideButton(false);
    },

    onDisable()
    {
        GameGlobal.AdsManager.AdervertActive(true);
        GameGlobal.SeverManager.ShowHideButton(true);
    },

    //展示盒子内容
    ShowBox(dataList)
    {
        var ItemTotalHeight = 0;
        var index = 0;
        for(var key in dataList)
        {
            var data = dataList[key];
            if(this.Content.children.length <= index)
            {
                var ins_Item = cc.instantiate(this.Item);
                ins_Item.parent = this.Content; 
            }
            else
            {
                var ins_Item = this.Content.children[index];
            }
            var ins_ItemHeight =  ins_Item.getComponent("BoxItem").setBoxItem(data,TitleList[index]);
            ItemTotalHeight += ins_ItemHeight;
            index++;
        }
        this.Content.height = 35*10 + ItemTotalHeight + index * 30;
        this.node.active = false;
    },

    BtnClose()
    {
        this.node.active = false;
    },

    BtnHome()
    {  
        this.node.active = false;
        GameGlobal.MsgCenter.emit(Constant.Msg.ReturnHomePage);
        GameGlobal.MsgCenter.emit(Constant.Msg.AginGame,false);
        GameGlobal.MsgCenter.emit(Constant.Msg.CloseGameOverPanel);
    }
});
