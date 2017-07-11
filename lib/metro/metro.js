var cityList = { 
    lisboa: require('./lisboa'), 
    porto: require('./porto') 
};

// preload
cityList.lisboa.getLineStatus();
cityList.porto.getLineStatus();

module.exports.getLineStatus = function(cityName) 
{
    for (var k in cityList)
    {
        if (cityName.toLowerCase() === k)
            return cityList[k].getLineStatus();
    }

    return "Error";
}