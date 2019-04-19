

cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad () {
        this.Title = this.node.getChildByName("Title").getComponent(cc.Label);
        this.BtnStartGame = this.node.getChildByName("BtnStartGame");
        this.Title.string = "子包加载完成";
        
    },
    
    start()
    {   
        var UIStart = cc.find("Canvas").getComponent("GameInit").UIStart;
        GameGlobal.UIManager.UIList[Constant.UIMain.UIStart] = UIStart;
        this.BtnStartGame.on(cc.Node.EventType.TOUCH_START,()=>
        {
            /*
            if(this.isLoadGamePack == undefined)
            {
                this.LoadGameingPack();
            }
            else
            {
              
            }
            */
            GameGlobal.UIManager.ShowMain(Constant.UIMain.UIGameing).then((node)=>
            {
                GameGlobal.UIManager.Close(Constant.UIMain.UIStart);
            });
        },this);
    },

    LoadGameingPack()
    {
        cc.loader.downloader.loadSubpackage("case1",(err)=>
        {
            if(err)
            {
                return console.error("分包加载失败",err);
            }
            GameGlobal.UIManager.ShowMain(Constant.UIMain.UIGameing).then((node)=>
            {
                GameGlobal.UIManager.Close(Constant.UIMain.UIStart);
            });
            this.isLoadGamePack = true;
        })
      
      
    }

    
});
