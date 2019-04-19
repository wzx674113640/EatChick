
cc.Class({
    extends: cc.Component,

    properties: {
       Layout:cc.Node,
       Item:cc.Node,
       Title:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setBoxItem(data,title)
    {
        this.Title.string = "| "+title;
        var length = data.length;
        var Height = 72.6 + (136 + 98.5)* Math.ceil(length/4);
        this.node.height = Height;
        for(var i = 0;i<length;i++)
        {
            if(this.Layout.children.length <= i)
            {
                var img_item = cc.instantiate(this.Item);
                img_item.parent = this.Layout;
            }
            else
            {
                var img_item = this.Layout.children[i];
            }
            img_item.getComponent("ImgItem").setImgItem(data[i]);
        }
        return Height;
    }
});
