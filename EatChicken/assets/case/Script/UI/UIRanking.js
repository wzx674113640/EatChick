
cc.Class({
    extends: cc.Component,

    extends: cc.Component,

    properties: {
        //主域的Items节点
        ItemsNode:
        {
            type: cc.Node,
            default:null,
        },
        
        MyItem:
        {
            type:cc.Node,
            default:null,
        },

        FTol:
        {
            type:cc.Toggle,
            default:null,
        },

        LablePage:cc.Label
    },

    onLoad()
    {
        this.currentPage = 0;
        this.isLoadJson = false;
    },

    onEnable()
    {
        if(!this.FTol.ischecked)
        {
            this.FTol.check();
        }
        this.ShowFrienRank();
        GameGlobal.SeverManager.ShowHideButton(false);
        GameGlobal.AdsManager.AdervertActive(false);
    },

    onDisable()
    {
        this.isLoadJson = false;
        this.currentPage = 0;
        GameGlobal.SeverManager.ShowHideButton(true);
        GameGlobal.AdsManager.AdervertActive(true);
    },
    
    ShowFrienRank()
    {
        this.OpenAndCloseRank(false);
        //通知子域 打开排行榜
        GameGlobal.SubManager.ShowFrindRank(!this.isLoadJson);
    },

    OpenAndCloseRank(active)
    {
        this.ItemsNode.active = active;
        this.LablePage.node.active = active;
        this.MyItem.active = active;
    },

    ShowWorldRank()
    {
        var self = this;
        this.OpenAndCloseRank(true);
        GameGlobal.SubManager.HideSub();
        if(this.isLoadJson == false)
        {
            GameGlobal.SeverManager.C2G_Rank((res)=>{
                var obj = res.data.data.list;
                var view = res.data.data.view;
                self.data = obj;
                self.loadOnePageInfo(self.currentPage);
                self.MyItem.getComponent("UIRankItem").setInfo(view);
                this.isLoadJson = true;
            });
        }
        else
        {
            self.loadOnePageInfo(self.currentPage)
        }
    },
    
    loadOnePageInfo(page)
    {
        if(this.data == undefined)
            return;
        if(page<0)
            return;
        var starDateIndex = page*5;
        if(starDateIndex >= this.data.length)
            return;
        this.currentPage = page;
        for(var i = 0;i<5;i++)
        {
            var DateIndex = starDateIndex + i;
            if(DateIndex < this.data.length)
            {   
                var item = this.ItemsNode.children[i];
                item.active = true;
                var obj = this.data[DateIndex];
                this.ItemsNode.children[i].active = true;
                item.getComponent("UIRankItem").setInfo(obj);
            }       
            else
            {
                this.ItemsNode.children[i].active = false;
            }
        }
        this.LablePage.string = (this.currentPage+1) +"/10";
    },

    BtnUp()
    {
        var page = this.currentPage - 1;
        this.loadOnePageInfo(page);
    },

    BtnDown()
    {
        var page = this.currentPage + 1;
        this.loadOnePageInfo(page);
    },

    
    FlockRank()
    {   
        //分享
        GameGlobal.AdsManager.AddShareEvent();
    },

    BtnClose()
    {
        this.node.active = false;
        GameGlobal.SubManager.HideSub();
    }
});
