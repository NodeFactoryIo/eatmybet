import * as cheerio from 'cheerio';
import request from 'request';
import * as moment from 'moment';

export default class Scrapper {

  static ScrapFifa(req, res) {
    return new Promise(function(resolve, reject) {
        var isShort = req.query.short != null; 

        request(
            {
                method: 'GET',
                url: 'http://www.fifa.com/worldcup/matches/'  
            }, 
            function(err, response, body, callback) {
                if (err) 
                    return console.error(err);

                let ret = [];

                let $ = cheerio.load(body);

                let fixtures = $('.fixture');

                fixtures.each(function(i, element){

                    let $fixture = $(this);
                    let fixture = {};

                    //fixture.date = $fixture.find('.fi-mu__info__datetime').eq(0).attr('data-utcdate');
                    let date = $fixture.find('.fi__info__datetime--abbr').eq(0).text();
                    let time = $fixture.find('.fi-s__date-HHmm').eq(0).attr('data-timeutc');

                    let hour = time.split(':')[0];
                    let minute = time.split(':')[1];

                    let dateTime = moment.utc(date, 'DD MMM yyyy');
                    dateTime.set('hour', hour);
                    dateTime.set('minute', minute);

                    let $homeTeam = $fixture.find('.home').eq(0);
                    let $awayTeam = $fixture.find('.away').eq(0);

                    if(isShort) {

                        fixture.d = dateTime.utc();
                        fixture.h = $homeTeam.find('.fi-t__nTri').eq(0).text();  
                        fixture.a = $awayTeam.find('.fi-t__nTri').eq(0).text(); 

                        ret.push(fixture);
                        return true;
                    }

                    fixture.dateTime = dateTime.utc();
                    fixture.groupName = $fixture.find('.fi__info__group').eq(0).text();
                    
                    fixture.homeTeamId = $homeTeam.attr('data-team-id');
                    fixture.homeTeamName = $homeTeam.find('.fi-t__nText').eq(0).text();  
                    fixture.homeTeamNameShort = $homeTeam.find('.fi-t__nTri').eq(0).text(); 
                    
                    fixture.awayTeamId = $awayTeam.attr('data-team-id');
                    fixture.awayTeamName = $awayTeam.find('.fi-t__nText').eq(0).text();  
                    fixture.awayTeamNameShort = $awayTeam.find('.fi-t__nTri').eq(0).text(); 

                    ret.push(fixture);
                });

                resolve(ret);
            }
        );
            
    });

    
  }
}
