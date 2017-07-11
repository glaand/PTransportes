var cityList = { 
    lisboa: require('./lisboa'), 
};

// preload
cityList.lisboa.getFerryStatus();

module.exports.getFerryStatus = function(cityName) 
{
    for (var k in cityList)
    {
        if (cityName.toLowerCase() === k)
            return cityList[k].getFerryStatus();
    }

    return "Error";
}