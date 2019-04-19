

cc.Class({
    extends: cc.Component,

    properties: {
       
        Guns:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        GunItems:
        {
            type:cc.Node,
            default:[]
        },

        PlaySkins:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        PlayNames:
        {
            type:cc.String,
            default:[]
        },

        EnemySkins:
        {
            type:cc.SpriteFrame,
            default:[]
        }, 

        EnemyNames:
        {
            type:cc.String,
            default:[]
        },

        BossSkins:
        {
            type:cc.SpriteFrame,
            default:[]
        }, 

        BossNames:
        {
            type:cc.String,
            default:[]
        },

        //场景配置

        BgSpris: 
        {
            type:cc.SpriteFrame,
            default:[]
        },

        WallSpris: 
        {
            type:cc.SpriteFrame,
            default:[]
        },
        
        BangSpris:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        LightSpris:
        {
            type:cc.SpriteFrame,
            default:[]
        }
    },

   

    start () {
      
        
    },

    
});
