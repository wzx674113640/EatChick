
cc.Class({
    extends: cc.Component,

    properties: {
        LabelRank:cc.Label,
        ImgRank:cc.Sprite,
        RankSpriteFrames:
        {
            type:cc.SpriteFrame,
            default:[]
        },
        ImgHead:cc.Sprite,
        LabelNickName:cc.Label,
        LabelScore:cc.Label
    },
    
    setInfo(data)
    {
        this.LabelRank.string = data.num;
        GameGlobal.HelperManager.createImage(data.avatar_url,this.ImgHead);
        let nick = data.nick_name.length <= 8 ? data.nick_name : data.nick_name.substr(0, 8) + "...";
        this.LabelNickName.string = nick;
        this.LabelScore.string = data.score;
        if(data.num<=3)
        {
            this.ImgRank.spriteFrame = this.RankSpriteFrames[data.num-1];
            this.ImgRank.node.active = true;
        }
        else
        {
            this.ImgRank.node.active = false;
        }
        this.node.active = true;
    }
});
