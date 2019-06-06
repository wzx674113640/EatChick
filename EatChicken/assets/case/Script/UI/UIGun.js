
cc.Class({
    extends: cc.Component,

    properties: {
      OnePageGun:cc.Node,
      TwoPageGun:cc.Node,
      ThreePageGun:cc.Node,
      pageView:cc.PageView,
      LabelCoin:cc.Label,
      Turntable:cc.Node
    },

    start()
    {
        this.GunItems1 = this.OnePageGun.children; 
        this.GunItems2 = this.TwoPageGun.children;
        this.GunItems3 = this.ThreePageGun.children;
        this.Gun250 = [];
        this.Gun500 = [];
    },
    
    onEnable()
    {
        GameGlobal.AdsManager.AdervertActive(false);
        GameGlobal.SeverManager.C2G_GunList((res)=>
        {
            var data = res.data.data;
            var threeIndex = 0;
            for(var i = 0;i<data.length;i++)
            {   
                if(data[i].gold == 250 || data[i].gold == 0)
                {
                    if(data[i].status == 0)
                    {
                        this.Gun250.push(data[i].id);
                    }
                    if(i > 9)
                    {
                        var index1 = i - 5;
                    }
                    else
                    {
                        var index1 = i;
                    }
                    this.GunItems1[index1].active = true;
                    this.GunItems1[index1].getComponent("GunItem").SetState(data[i].status,data[i].id,data[i].title,data[i].mybullet,data[i].bullet);
                }
                else if(data[i].gold == 500)
                {
                    if(data[i].status == 0)
                    {
                        this.Gun500.push(data[i].id);
                    }
                    if(i > 9)
                    {
                        var index = i- 9;
                    }
                    else
                    {
                        var index = i-5;
                    }
                    this.GunItems2[index].active = true;
                    this.GunItems2[index].getComponent("GunItem").SetState(data[i].status,data[i].id,data[i].title,data[i].mybullet,data[i].bullet);
                }
                else if(data[i].gold == 9999)
                {
                    this.GunItems3[threeIndex].active = true;
                    this.GunItems3[threeIndex].getComponent("GunItem").SetState(data[i].status,data[i].id,data[i].title,data[i].mybullet,data[i].bullet);
                    threeIndex ++;
                }
            }
        });
        GameGlobal.SeverManager.ShowHideButton(false);    
    },

    onDisable()
    {
        this.Gun250 = [];
        this.Gun500 = [];
        GameGlobal.SeverManager.ShowHideButton(true);
    },

    BtnClose()
    {
        this.node.active = false;
    },

    BtnBuy()
    {
        var totalCoin = GameGlobal.SeverManager.UserInfo.Coin;
        var index = this.pageView.getCurrentPageIndex();
        if(index == 0)
        {
            if(totalCoin >= 250)
            {
                var index = Math.floor(Math.random()*this.Gun250.length);
                var gunID = Number(this.Gun250[index]);
                this.Gun250.splice(index, 1); 
                GameGlobal.SeverManager.C2G_BuyGun(gunID,(res)=>
                {
                    GameGlobal.MsgCenter.emit(Constant.Msg.BuyGun,gunID); //监听使用枪
                    GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,-250);
                    GameGlobal.HintManager.ShowToast("解锁成功！");
                });
            }
            else
            {
                GameGlobal.HintManager.ShowModel("金币不足，是否获取金币！",
                ()=>
                {
                   GameControl.GetCoin();
                });
                return;
            }
        }
        else if(index == 1)
        {
            if(totalCoin >= 500)
            {
                var index = Math.floor(Math.random()*this.Gun500.length);
                var gunID = Number(this.Gun500[index]);
                this.Gun500.splice(index, 1); 
                GameGlobal.SeverManager.C2G_BuyGun(gunID,(res)=>
                {
                    GameGlobal.MsgCenter.emit(Constant.Msg.BuyGun,gunID); //监听使用枪
                    GameGlobal.MsgCenter.emit(Constant.Msg.ChangCoin,-500);
                    GameGlobal.HintManager.ShowToast("解锁成功！");
                });
            }
            else
            {
                GameGlobal.HintManager.ShowModel("金币不足，是否获取金币！",
                ()=>
                {
                    GameControl.GetCoin();
                });
                return;
            }
        }
        
    },

    
    PageEvent()
    {
        var index = this.pageView.getCurrentPageIndex();
        if(index == 0)
        {
            this.Turntable.active = false;
            this.LabelCoin.node.parent.active = true;
            this.LabelCoin.string = "-250"; 
        }
        else if(index == 1)
        {
            this.Turntable.active = false;
            this.LabelCoin.node.parent.active = true;
            this.LabelCoin.string = "-500"; 
        }
        if(index == 2)
        {
            this.LabelCoin.node.parent.active = false;
            this.Turntable.active = true;
        }
    },

    BtnTurn()
    {
        this.BtnClose();
        GameGlobal.UIManager.ShowPop("UITurn");
    }   
    
});
