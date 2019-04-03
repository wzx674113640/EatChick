var UIManager = require("UIManager");
var Constant = require("Constant");
var EffectManager = require("EffectManager");
var SeverManager = require("SeverManager");
var AdsManager = require("AdsManager");
var SoundManager = require("SoundManager");
var HelperManager = require("HelperManager");
var SubManager = require("SubManager");
var MsgCenter = require("MsgCenter");
var HintManager = require("HintManager");

var GameGlobal = cc.Class({
    extends: cc.Component,

    onLoad()
    {
        window.GameGlobal = this;

        window.Constant = new Constant();
        this.UIManager = new UIManager();
        this.EffectManager = new EffectManager();
        this.SeverManager = new SeverManager();
        this.AdsManager = new AdsManager();
        this.SoundManager = new SoundManager();
        this.HelperManager = new HelperManager();
        this.SubManager = new SubManager();
        this.HintManager = new HintManager();

        this.MsgCenter = MsgCenter;

        window.Constant.onLoad();
        this.SeverManager.onLoad();
        this.UIManager.onLoad();
        this.EffectManager.onLoad();
        this.AdsManager.onLoad();
        this.SoundManager.onLoad();
        this.HelperManager.onLoad();
        this.SubManager.onLoad();
        this.HintManager.onLoad();
    },

    start()
    {
        window.Constant.start();
        this.SeverManager.start();
        this.UIManager.start();
        this.EffectManager.start();
        this.AdsManager.start();
        this.SoundManager.start();
        this.HelperManager.start();
        this.SubManager.start();
        this.HintManager.start();
    },

    update(dt)
    {
        this.SubManager.update(dt);
    }
}); 
