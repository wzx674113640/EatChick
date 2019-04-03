
var wallConfig = 
{
    MinWidth : 100,
    MaxWidth : 300,
    MinHeight: 80,
    MaxHeight: 200,
}

var WidthCoef = 4; //宽度系数
var HeightCoef = 4;//高度系数

function setLevel(level)
{
    wallConfig.MinWidth = 250 - level * WidthCoef ;
    if(wallConfig.MinWidth<=100)
    {
        wallConfig.MinWidth = 100;
    }
    wallConfig.MaxWidth = 300 - level * WidthCoef;
    if(wallConfig.MaxWidth<=200)
    {
        wallConfig.MaxWidth = 200;
    }
    
    wallConfig.MinHeight = 80 + level * HeightCoef;

    if(wallConfig.MinHeight > 400)
    {
        wallConfig.MinHeight = 400;
    }

    wallConfig.MaxHeight = 150 + level * HeightCoef;
    if(wallConfig.MaxHeight > 500)
    {
        wallConfig.MaxHeight = 500;
    }
}

module.exports = {
    'wallConfig': wallConfig,
    "setLevel": setLevel
}