

var PlayInfo =  cc.Class({
    extends: cc.Component,

    properties: {
        _coin:0,
        Coin:{
            get()
            {
                return this._coin;
            },
            set(value)
            {
                this._coin = value;
                if(UIGameing)
                {
                    UIGameing.setCoin(this._coin);
                }
            }
        },
        _score:0,
        Score:{
            get()
            {
                return this._score;
            },
            set(value)
            {   
                this._score = value;
                if(UIGameing)
                {
                    UIGameing.setScore(this._score);
                }
            }
        },
        _level:0,
        Level:{
            get()
            {   
                return this._level;
            },
            set(value)
            {   
                this._level  = value;
                if(UIGameing)
                {
                    UIGameing.setLevel(this._level);
                }
            }
        },
        _health:0,
        Health:
        {
            get()
            {
                return this._health;
            },
            set(value)
            {
                this._health = value;
                if(UIGameing)
                {
                    if(this._health == 1)
                    {
                        GameGlobal.MsgCenter.emit(Constant.Msg.PlayHealthAni,true);
                    }
                    else
                    {   
                        GameGlobal.MsgCenter.emit(Constant.Msg.PlayHealthAni,false);
                    }   
                    GameControl.player.Health = value;
                    UIGameing.setImgHealth(this._health);
                }
            }
        },
        _levelProgress:0,
        LevelProgress:
        {
            get()
            {
                return this._levelProgress;
            },
            set(value)
            {
                this._levelProgress = value;
                if(UIGameing)
                {
                    UIGameing.setLevelPross(this._levelProgress);
                }
            }
        }, 
        
        _riflemanCount:0,
        RiflemanCount:
        {
            get()
            {
                return this._riflemanCount;
            },
            set(value)
            {
                this._riflemanCount = value;
                if(UIGameing)
                {   
                    if(this._riflemanCount > 0)
                    {
                        UIGameing.setHeadCount(this._riflemanCount);
                    }
                }
            }
        }, //爆头数
    },

    ctor()
    {
        this.Init();
    },

    Init()
    {
        this.Score = 0;
        this.Coin = GameGlobal.SeverManager.UserInfo.Coin; //等于服务器数据
        this.Level = 1;
        this.Health = 2;
        this.LevelProgress = 0;
        this.RiflemanCount = 0;
        this.ResurrectionCount = 1;
    },

    NextLevel()
    {
        this.Level++;
        this.LevelProgress = 0;
        if(this.Level % 2 == 0)
        {
            /*
            if(!GameGlobal.SeverManager.UserInfo.isMoreGame)
            {
                GameGlobal.AdsManager.ShowOrHideAdervert(false);
                GameGlobal.AdsManager.ShowOrHideAdervert(true);
            }
            */
        }
    },

    Resurrection()
    {
        this.Health = 2;
        this.ResurrectionCount --;
    },
    start () {

    },

});
