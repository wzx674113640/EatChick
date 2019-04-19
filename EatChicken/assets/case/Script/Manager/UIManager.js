
var UIManager = cc.Class({

    extends: require("BaseManager"),

    properties:
    {

    },

    onLoad() {
        this.UIList = [];
        this.UIMain = cc.find("Canvas/UIMain");
        this.UIPop = cc.find("Canvas/UIPop");
        this.UIApp = cc.find("Canvas/UIApp");
        //把游戏开始页加入UI管理器
    },

    //创建UI
    CreatorUI(uiname, parentNode) {
        return new Promise((resolve, reject) => {
            var UINode = null;
            if (this.UIList[uiname] == undefined || this.UIList[uiname] == null) {
                var path = "Prefabs/UI/" + uiname;
                cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
                    UINode = cc.instantiate(prefab);
                    UINode.parent = parentNode;
                    this.UIList[uiname] = UINode;
                    resolve(UINode)
                });
            }
            else {
                UINode = this.UIList[uiname];
                resolve(UINode)
            }
        })
    },

    //关闭UI
    Close(uiname) {
        var UINode = this.GetUI(uiname);
        if (UINode != null) {
            UINode.active = false;
        }
    },

    //打开主UI 
    ShowMain(uiname) {
        return this.CreatorUI(uiname, this.UIMain).then((node)=>{
            if (node != null) {
                node.active = true;
            }
        });
    },

    //打开弹窗UI
    ShowPop(uiname) {
        return this.CreatorUI(uiname, this.UIPop).then((node)=>{
            if (node != null) {
                node.active = true;
            }
        });
    },

    ShowApp(uiname,action = null)
    {
        return this.CreatorUI(uiname, this.UIApp).then((node)=>{
            if (node != null) {
                node.active = true;
            }
            if(action!= null)
            {
                action(node);
            }
        });
    },

    //获取UI
    GetUI(uiname) {
        return this.UIList[uiname];
    }
});
