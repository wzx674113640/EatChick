 

cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    start () {
        this.bulletCom = this.node.parent.getComponent("Bullet");
        this.power = this.bulletCom.Power;
       
        if(this.node.getComponent(cc.Animation)!=null)
        {
             this.node.getComponent(cc.Animation).play("Bullet");
        }
       

    },
    
    
    onCollisionEnter(other,self)
    {
        switch(other.node.group)
        {
            case "EnemyBody":
                other.node.parent.getComponent("BasePerson").DropBlood(this.power);
                
                this.bulletCom.DestoryBullet();
                break;
            case "EnemyHead":
                other.node.parent.getComponent("BasePerson").DropBlood(2*this.power,true);
                //GameControl.AddHeadCount();
                this.bulletCom.DestoryBullet();
                break;
        }
    },
    
});
