const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://www.transtejo.pt/';

var connections = [];

module.exports.getFerryStatus = function() 
{
    request(URL, function(error, response, body)
    {
        $ = cheerio.load(body);
        var j = 0;
        $('.tablePartidas tr').each(function(i, elem)
        {
            if ((i+1) % 2 === 0)
            {
                var dt;
                var from;
                var to;
                var status;
                var room;

                $(this).children('td').each(function(i, elem)
                {
                    switch(i)
                    {
                        case 0:
                            dt = $(this).text();
                            break;
                        case 1:
                            from = $(this).text();
                            break;
                        case 2:
                            to = $(this).text();
                            break;
                        case 3:
                            status = $(this).children('span').text();
                            break;
                        case 4:
                            room = $(this).text();
                            break;
                    }
                });

                if (room !== '') 
                {
                    connections[j] = { 
                        departureTime: dt,
                        from: from,
                        to: to,
                        status: status,
                        room: room
                    };
                } else {

                    connections[j] = { 
                        departureTime: dt,
                        from: from,
                        to: to,
                        status: "Previsto"
                    };

                }
                j++;
            }
        });
    });

    return connections;
}