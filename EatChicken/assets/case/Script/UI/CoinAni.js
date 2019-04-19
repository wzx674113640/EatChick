cc.Class({
    extends: cc.Component,

    properties: {
        txtPopPrefab: cc.Node,
        //radius: 300,
        Coin:cc.Node
    },

    start: function() {

        this.radius = 120;
        this.m_coinPool = new cc.NodePool()
        for (var i = 0; i < 10; i++) {
            var node = cc.instantiate(this.txtPopPrefab)
            node.parent = this.node;
            node.active = true;
        }
        /*
        this.Btn.on(cc.Node.EventType.TOUCH_START, ()=>
        {
            this.play(cc.v2(0,0),cc.v2(-276,594));
        }, this); 
        */
    },

    getCoinNode() {
        if (this.m_coinPool.size() > 0) {
            return this.m_coinPool.get()
        } else {
            var node = cc.instantiate(this.txtPopPrefab)
            node.parent = this.node;
            node.active = true;
            return node;
        }
    },

    play(point,action = null) {
        var targetPoint = this.Coin.parent.getPosition();
        var p1 = point;
        var XXlist = [100,300,400,450];
        //targetPoint = this.node.convertToNodeSpaceAR(targetPoint);
        var playCallback = function(_coin) {
            
            _coin.scale = 1
            var spawn1 = cc.jumpTo(0.3, p2,50,1);
            
            _coin.runAction(spawn1)
            
            this.scheduleOnce(()=>
            {
                var time = Math.floor(Math.random()*5)*0.2  + 0.5;
                var vv = _coin.getPosition().x > 0? 1:-1;
                var index = Math.floor(Math.random()*XXlist.length);
                var bezier = [_coin.getPosition(), cc.v2(XXlist[index]*vv, 300), targetPoint];
                var bezierTo = cc.bezierTo(time, bezier);

                var call = cc.callFunc(function() {
                    action();
                    this.m_coinPool.put(_coin);
                    this.Coin.scale = 1;
                    var s = cc.scaleTo(0.1,1.5);
                    var s1 = cc.scaleTo(0.1,1);
                    this.Coin.stopAllActions();
                    this.Coin.runAction(cc.sequence(s,s1));
                }, this)

                _coin.runAction(cc.sequence(bezierTo,call))
            },0.25);
        }.bind(this)

        var _angle = 360 / 10
        for (var i = 0; i < 10; i++) {
            var angle = Math.PI / 20 * (_angle * i)
            var rr = Math.floor(Math.random()*50);
            var p2 = cc.v2(Math.cos(angle), Math.sin(angle)).mulSelf(this.radius + rr).addSelf(p1);
            var coin = this.getCoinNode()
            coin.parent = this.node
            coin.position = p1
            coin.active = true
            playCallback(coin)
        }
    },
});