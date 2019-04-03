
var SoundManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
       
    },

    onLoad()
    {
        this.AduioClipList = [];
        this.SoundToggle = true; //音乐开关
        this.Volume = 0.5;
        this.SoundToggle = false;
        this.PlayMusic("Bg");
    },
    
    //播放音效
    PlaySound(name)
    {
        if(this.SoundToggle)
            return;
        this.LoaderClip(name).then((clip)=>
        {
            cc.audioEngine.play(clip,false,this.Volume);
        });
    },

    //播放音乐
    PlayMusic(name)
    {
        if(this.SoundToggle)
        {
            cc.audioEngine.stopMusic();
            return;
        }
        this.LoaderClip(name).then((clip)=>
        {
            cc.audioEngine.playMusic(clip,true);
        });
    },
    //加载声音文件
    LoaderClip(name)
    {
        return new Promise((resolve, reject) => {
            if(this.AduioClipList[name] == undefined)
            {
                var path = "Sound/" + name;
                cc.loader.loadRes(path,cc.AudioClip,(err,clip)=>
                {
                    this.AduioClipList[name] = clip;
                    resolve(clip);
                })
            }
            else
            {
                resolve(this.AduioClipList[name]);
            }
        });
    }   
});
