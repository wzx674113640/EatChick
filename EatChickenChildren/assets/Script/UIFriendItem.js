

cc.Class({
    extends: cc.Component,

    properties: {
        ImgHead:cc.Sprite,
        LabelScore:cc.Label,
        Win:cc.Node,
        Fail:cc.Node
    },

    start () {
        window.UIFriendItem = this;
        
    },

    setInfo(data)
    {
        this.Fail.active = true;
        this.Win.active = false;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.LabelScore.string = grade;
        HelperManager.createImage(data.avatarUrl,this.ImgHead);
    },

    NumOne()
    {
        this.Fail.active = false;
        this.Win.active = true;
    }
});
