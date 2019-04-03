
cc.Class({
    extends: cc.Component,

    properties:
    {
        
    },

    onLoad () {
        cc.find('Canvas').y = 667;
        this.MAIN_MENU_NUM = "Score";
        window.wx.onMessage((data)=>
        {
            switch(data.messageType)
            {
                case 0: //打开好友排行榜
                    this.OpenRank();
                    break;
                case 1: //关闭好友排行榜
                    this.CloseRank();
                    break; 
                case 2:  //提交得分
                    this.SaveScore(data.score);
                    break;
                case 3:
                    this.ShowOtherPlayer(data.score);
                        break;
            }
        })
    },

    OpenRank()
    {
        UIRanking.node.active = true;
        UIFriendItem.node.active = false;

        var self = this;
        
        wx.getUserInfo({

            openIdList: ['selfOpenId'],

            success: (userRes) => {

                let userData = userRes.data[0];

                wx.getFriendCloudStorage({

                    keyList: [self.MAIN_MENU_NUM],

                    success: res => 
                    {
                        let data = res.data;
                        data.sort((a, b) =>
                        {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) 
                            {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) 
                            {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) 
                            {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (let i = 0; i < data.length; i++)
                        {
                            var playerInfo = data[i];
                            if(playerInfo.avatarUrl == userData.avatarUrl)
                            {
                                UIRanking.SetMyItem(i,playerInfo);
                            }
                        }
                        UIRanking.loadOnePageInfo(0,data);
                        UIRanking.currentPage = 0;
                    },
                });
            },
        });
    },

     //保存用户信息
     SaveScore(score)
     { 
         var self = this;
         window.wx.getUserCloudStorage({
             keyList: [self.MAIN_MENU_NUM],
             success: (getres)=>
             {
                 if (getres.KVDataList.length != 0)
                {
                     if (getres.KVDataList[0].value > score) 
                     {
                         return;
                     }
                 }
               
                 window.wx.setUserCloudStorage({
                     KVDataList: [{key: self.MAIN_MENU_NUM, value: "" + score}],
                 });
             },
         });
     },

     //显示其他玩家
     ShowOtherPlayer(score)
     {
         UIRanking.node.active = false;
         UIFriendItem.node.active = true;
         var self = this;
         wx.getUserInfo({

             openIdList: ['selfOpenId'],

             success: (userRes) => {
                 let userData = userRes.data[0];

                 wx.getFriendCloudStorage({

                     keyList: [self.MAIN_MENU_NUM],

                     success: res => 
                     {
                         let data = res.data;
                         data.sort((a, b) =>
                          {
                             if (a.KVDataList.length == 0 && b.KVDataList.length == 0) 
                             {
                                 return 0;
                             }
                             if (a.KVDataList.length == 0) 
                             {
                                 return 1;
                             }
                             if (b.KVDataList.length == 0) 
                             {
                                 return -1;
                             }
                             return b.KVDataList[0].value - a.KVDataList[0].value;
                         });

                         var lastsocre = false;
 
                         var smalldata = null;
                        
                         var isfirst = false;
                         for (let i = 0; i < data.length; i++) 
                         {
                             if(data[i].KVDataList[0].value<score&&lastsocre == false)
                             {
                                 if(i>0)
                                 {   
                                     smalldata = data[i-1];
                                     if(smalldata.avatarUrl == userData.avatarUrl)
                                     {
                                         if(i>1)
                                         {
                                             smalldata = data[i-2];
                                         }
                                         else
                                         {
                                             isfirst = true;
                                         }
                                     }
                                 }
                                 else
                                 {
                                     isfirst = true;
                                 }
                                 lastsocre = true;
                             }
                             /*
                             if (data[i].avatarUrl == userData.avatarUrl) 
                             {
                               
                                 if(i == 0)
                                 {
                                     var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                     UITwo.setSelf(i+1,data[i]);
                                     if(data.length>=2)
                                     {
                                         UITwo.setLeft(i+2,data[i+1]);
                                     }
                                 }
                                 else if(i == data.length -1)
                                 {
                                     var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                     UITwo.setSelf(i+1,data[i]);
                                     if(data.length>=2)
                                     {
                                         UITwo.setRight(i,data[i-1]);
                                     }
                                 }
                                 else
                                 {
                                      var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                      UITwo.setRight(i,data[i-1]);
                                      UITwo.setSelf(i+1,data[i]);
                                      UITwo.setLeft(i+2,data[i+1]);
                                 }
                             }
                             */
                         }
                         if(data.length <= 1||isfirst == true)
                         {
                             UIFriendItem.NumOne();
                         }
                         else 
                         {
                             if(smalldata == null)
                             {
                                 if(data[data.length-1].avatarUrl == userData.avatarUrl)
                                 {
                                    UIFriendItem.setInfo(data[data.length-2]);
                                 }
                                 else
                                 {
                                    UIFriendItem.setInfo(data[data.length-1]);
                                 }
                                
                             }
                                
                             else
                                UIFriendItem.setInfo(smalldata);
                         }
                        
                     },
                 });
             },
         });
     },
});
