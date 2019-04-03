
var UIMain = require("UIMain");

var UIPop = require("UIPop");
var Msg = require("Msg");

var Constant =  cc.Class({
    
    extends: require("BaseManager"),

    properties: {
        
    },

    onLoad () {
        this.UIMain = new UIMain();
        this.UIPop = new UIPop();
        this.Msg = new Msg();
    },
    
});
