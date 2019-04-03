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
    
    setInfo(rank,data)
    {
        rank++;
        this.LabelRank.string = rank;
        HelperManager.createImage(data.avatarUrl,this.ImgHead);
        let nick = data.nickname.length <= 8 ? data.nickname : data.nickname.substr(0, 8) + "...";
        this.LabelNickName.string = nick;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.LabelScore.string = grade;
        if(rank<=3)
        {
            this.ImgRank.spriteFrame = this.RankSpriteFrames[rank-1];
            this.ImgRank.node.active = true;
        }
        else
        {
            this.ImgRank.node.active = false;
        }
        this.node.active = true;
    }
});
