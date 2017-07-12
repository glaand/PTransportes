const Twitter = require('twitter');
const metro = require('./metro/metro');
const util = require('util');

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const lineCodes = {
    Lisboa: {
        Amarela: 'LA',
        Azul:'LB',
        Verde: 'LC',
        Vermelha: 'LD'
    },
    Porto: {
        Azul: 'PA',
        Vermelha: 'PB', 
        Verde: 'PC',
        Amarela: 'PD',
        Violeta: 'PE',
        Laranja: 'PF'
    }
};

var postedStatus = {};

module.exports.run = function()
{
    deleteAllTweets();
    setTimeout(function()
    {
        var lastStatus = {
            Lisboa: metro.getLineStatus('lisboa'),
            Porto: metro.getLineStatus('porto')
        };

        handleInformation(lastStatus, function(city, line)
        {
            postTweet(processStatus(lastStatus[city][line].status, city, lastStatus[city][line].lineName), lineCodes[city][line]);
        });

        var interval = setInterval(function()
        {
            var newStatus = {
                Lisboa: metro.getLineStatus('lisboa'),
                Porto: metro.getLineStatus('porto')
            };

            if (newStatus !== lastStatus)
            {
                handleInformation(newStatus, function(city, line)
                {
                    var linecode = lineCodes[city][line];
                    if (newStatus[city][line].status !== lastStatus[city][line].status)
                    {
                        deleteTweet(postedStatus[linecode]);
                        postTweet(processStatus(newStatus[city][line].status, city, lastStatus[city][line].lineName), linecode);
                        console.log('Updated status of line ' + linecode);
                    }
                });
            }

            lastStatus = newStatus;
        }, 180000);
    }, 2000);
}

function postTweet(status, code)
{
    client.post('statuses/update', { status: status }, function(error, tweet, response) 
    {
        if (error)
        {
            console.log(util.inspect(error, false, null));
            return;
        }

        addCode(code, JSON.parse(response.body).id_str);
    });
}

function deleteTweet(tweet_id)
{
    client.post('statuses/destroy/' + tweet_id, {}, function(error, tweet, response) 
    {
        if (error)
            console.log(util.inspect(error, false, null));
    });
}

function deleteAllTweets()
{
    client.get('statuses/user_timeline', {}, function(error, tweet, response)
    {
        if (error)
        {
            console.log(util.inspect(error, false, null));
            return;
        }

        res = JSON.parse(response.body);
        var tweetcount = Object.keys(res).length;
        for (var i = 0; i < tweetcount; i++)
        {
            deleteTweet(res[i].id_str);
        }
    });
}

function handleInformation(info, callback)
{
    for (city in info)
    {
        for(line in info[city])
        {
            callback(city, line);
        }
    }
}

function addCode(code, id)
{
    postedStatus[code] = id;
}

function processStatus(status, city, line) 
{
    var lc = city.toLowerCase();
    if (lc === 'lisboa')
        city = '𝗟𝗶𝘀𝗯𝗼𝗮';
    else if (lc === 'porto')
        city = '𝗣𝗼𝗿𝘁𝗼';
    else 
        city = 'NA';

    var ls = status.toLowerCase();
    if (ls === 'circulação normal' || ls === 'ok')
        return city + ' - ' + line + ' | ✅ | A circulação encontra-se normalizada.';

    if (ls === "serviço encerrado")
        return city + ' - ' + line + ' | ❌ | Esta linha está encerrada.';

    return city + ' - ' + line + ' | ⚠️ | ' + status;
}

