

cc.Class({
    extends: cc.Component,

    properties: {
        Bullet:cc.Node,
        speed: 5000,//子弹移动速度
        survivalTime:2//子弹生存时间
    },

    onLoad () {
        this.speed = 2000;
        this.Person = null; //开枪者
        this.Power = 0; //子弹威力
        this.isMove = false;//自动是否开始移动

        this.BulletSkin = this.node.getComponent(cc.Sprite);
    },

    
    //发射子弹
    ShitBullets(power,rotation)
    {
        this.node.rotation = rotation ;
        this.node.active = true;
        this.Power = power;
        this.isMove = true;
    },

    update(dt)
    {
        if(!this.isMove)
            return;
        this.Bullet.x -= dt * this.speed; 
        this.survivalTime -= dt;
        if(this.survivalTime<=0)
        {
            this.DestoryBullet();
        }
    },
    //销毁子弹
    DestoryBullet()
    {
       this.node.destroy();
    }
});
