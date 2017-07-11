const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://app.metrolisboa.pt/status/estado_Linhas.php';

const lineStops = {
    Amarela: {
        firstStop: 'Rato',
        lastStop: 'Odivelas'
    },
    Azul: {
        firstStop: 'St. Apolónia',
        lastStop: 'Reboleira'
    },
    Verde: {
        firstStop: 'Cais do Sodré',
        lastStop: 'Telheiras'
    },
    Vermelha: {
        firstStop: 'S. Sebastião',
        lastStop: 'Aeroporto'
    },
}

var lines = [];

module.exports.getLineStatus = function() 
{
    request(URL, function(error, response, body)
    {
        $ = cheerio.load(body);
        $('table tr').each(function(i, elem)
        {
            var lineName = $(this).children('td').first().children('img').attr('alt');
            var line = lineName.split(" ")[1];
            lines[i] = { 
                lineName: lineName,
                status: $(this).children('td').next().children('ul').text(),
                stops: lineStops[line]
            };
        });
    });

    var namedLines = { Amarela: lines[0], Azul: lines[1], Verde: lines[2], Vermelha: lines[3] }
    return namedLines;
}