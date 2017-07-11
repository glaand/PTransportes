const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://www.metrodoporto.pt/';

var lines = [];

module.exports.getLineStatus = function() 
{
    request(URL, function(error, response, body)
    {
        $ = cheerio.load(body);
        $('.DestaqueRight_AREA ul li').each(function(i, elem)
        {
            var lineName = $(this).children('.title').text();
            var stops = lineName.split(' - ');
            lines[i] = { 
                lineName: convertLineNameToColor(lineName), 
                status: $(this).children('.text').text(),
                stops: {
                    firstStop: stops[0],
                    lastStop: stops[1]
                } 
            };
        });
    });

    var namedLines = { Azul: lines[0], Vermelha: lines[1], Verde: lines[2], Amarela: lines[3], Violeta: lines[4], Laranja: lines[5] }
    return namedLines;
}

function convertLineNameToColor(lineName)
{
    var ll = lineName.toLowerCase();
    if (ll === 'estádio do dragão - sr. de matosinhos')
        return 'Linha Azul';
    else if (ll === 'estádio do dragão - póvoa de varzim')
        return 'Linha Vermelha';
    else if (ll === 'campanhã - ismai')
        return 'Linha Verde';
    else if (ll === 'sto. ovídio - hospital s.joão')
        return 'Linha Amarela';
    else if (ll === 'estádio do dragão - aeroporto')
        return 'Linha Violeta';
    else if (ll === 'senhora da hora - fânzeres')
        return 'Linha Laranja';

    return 'NA';
}