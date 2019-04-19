
cc.Class({
    extends: cc.Component,

    properties: 
    {
        AppNodeList:cc.Node
    },

    onLoad () 
    {
        var ww = this.node.getComponent(cc.Widget);
        ww.target = cc.find("Canvas");
        ww.bottom = 0;
        
        this.spacing = 60;
        this.moveSpeed = 50;
        this.ShowDownItem();
        this.moveSate = "left";
    },

    ShowDownItem()
    {
        //设置底部
        if(GameGlobal.SeverManager.UserInfo.is_status == 1 || GameGlobal.SeverManager.UserInfo.is_status == undefined)
        {
            var AppIDInfoList = GameGlobal.SeverManager.UserInfo.AppIDInfoList;
            var Applength = AppIDInfoList.length;
            var wid = (Applength + 1) * (this.AppNodeList.children[0].width + this.spacing);
            this.AppNodeList.width = wid;
            var AppNodeLength = this.AppNodeList.children.length;
            for(var i = 0;i <= Applength;i++)
            {
                if(Applength == i)
                {
                    if(AppNodeLength > i)
                    {
                        var lastItem = this.AppNodeList.children[i];
                    }
                    else
                    {
                        var lastItem = cc.instantiate(this.AppNodeList.children[0]);
                        lastItem.parent = this.AppNodeList;
                    }
                    lastItem.active = true;
                    lastItem.getComponent("AppItem").set222Touch();
                    break;
                }
                if(AppNodeLength>i)
                {
                    this.AppNodeList.children[i].active = true;
                    this.AppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
                else
                {
                    var newitem = cc.instantiate(this.AppNodeList.children[0]);
                    newitem.parent = this.AppNodeList;
                    newitem.active = true;
                    newitem.getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
            }
            this.maxX = -375;
            this.minX = -(wid-375); 
        }
        else
        {
            this.node.active = false;
        }
    },
    
    update(dt)
    {
        if(this.AppNodeList.x >= this.maxX)
        {
            this.moveSate = "left";//-
        } 
        else if(this.AppNodeList.x <= this.minX)
        {
            this.moveSate = "right";//+
        }
        if(this.moveSate == "left")
        {
           this.AppNodeList.x -= dt*this.moveSpeed;
        }
        else if( this.moveSate == "right")
        {
            this.AppNodeList.x += dt*this.moveSpeed;
        }
    }
});
