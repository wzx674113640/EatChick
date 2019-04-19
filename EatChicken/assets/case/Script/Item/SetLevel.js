

cc.Class({
    extends: cc.Component,

    properties: {
        Center: cc.Label,
        Left:cc.Label,
        Right:cc.Label,
    },

    setLevel(level)
    {
        this.Center.string = level;
        this.Center.node.scale = 0.1;
        var s = cc.scaleTo(0.2,1.2);
        var s1 = cc.scaleTo(0.1,1);
        this.Center.node.runAction(cc.sequence(s,s1));
        if(level - 1<=0)
        {
            this.Left.node.active = false;
        }
        else
        {
            this.Left.node.active = true;
            this.Left.string = level - 1;
        }
        this.Right.string = level + 1;
    }
  
});
