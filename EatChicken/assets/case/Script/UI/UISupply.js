

cc.Class({
    extends: cc.Component,

    properties: {

        SupplyItemNode:cc.Node,
        SupplyPage:cc.Node,
        PageConent:cc.Node,
        PageView:cc.PageViewm

    },

    onLoad()
    {
        this.GunList = GameGlobal.SeverManager.UserInfo.GunsList;
    },

    onEnable() 
    {
        var length = this.GunList.length;
        var PageCount = ( length - length % 3) / 3 + 1;
        var instanCount = PageCount - this.PageConent.children.length;
        if(instanCount>0)
        {
            for(var i = 0;i < instanCount;i++) 
            {
                var pageItem = cc.instantiate(this.SupplyPage);
                this.PageView.addPage(pageItem);
            }   
        }   

        for(var i = 0;i < length;i++)
        {
            var index =  ( i - i % 3) / 3 ;
            if(this.PageConent.children[index].children.length <= (i-3*index))
            {
                var item =  cc.instantiate(this.SupplyItemNode);
                item.parent = this.PageConent.children[index];
            }

            this.PageConent.children[index].children[i-3*index].getComponent("SupplyItem").setItem(this.GunList[i]);
        }
    },
    
});
