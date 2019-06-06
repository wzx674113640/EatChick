
cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad () {
        var mean =  wx.getMenuButtonBoundingClientRect();
        this.GameClub = wx.createGameClubButton({
            icon:"light",
            style:
            {
                left:135,
                top: mean.top - 5,
                width:40,
                height:40
            }
        });
    },

    onEnable()
    {
        this.GameClub.show();
    },

    onDisable()
    {
        this.GameClub.hide();
    }
});
