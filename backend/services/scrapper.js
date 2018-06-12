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
          url: 'http://www.fifa.com/worldcup/matches/',
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

            let gameId = $fixture.attr('data-id');
            let date = $fixture.find('.fi__info__datetime--abbr').eq(0).text();
            let time = $fixture.find('.fi-s__date-HHmm').eq(0).attr('data-timeutc');

            let hour = time.split(':')[0];
            let minute = time.split(':')[1];

            let dateTime = moment.utc(date, 'DD MMM yyyy');
            dateTime.set('hour', hour);
            dateTime.set('minute', minute);

            let $homeTeam = $fixture.find('.home').eq(0);
            let $awayTeam = $fixture.find('.away').eq(0);

            if (isShort) {
              fixture.i = gameId;
              fixture.d = dateTime.utc();
              fixture.h = $homeTeam.find('.fi-t__nTri').eq(0).text();
              fixture.a = $awayTeam.find('.fi-t__nTri').eq(0).text();

              fixture.r = -1;

              ret.push(fixture);
              return true;
            }

            fixture.gameId = gameId;

            fixture.dateTime = dateTime.utc();
            fixture.groupName = $fixture.find('.fi__info__group').eq(0).text();

            fixture.homeTeamId = $homeTeam.attr('data-team-id');
            fixture.homeTeamName = $homeTeam.find('.fi-t__nText').eq(0).text();
            fixture.homeTeamNameShort = $homeTeam.find('.fi-t__nTri').eq(0).text();

            fixture.awayTeamId = $awayTeam.attr('data-team-id');
            fixture.awayTeamName = $awayTeam.find('.fi-t__nText').eq(0).text();
            fixture.awayTeamNameShort = $awayTeam.find('.fi-t__nTri').eq(0).text();

            fixture.homeTeamGoals = 0;
            fixture.awayTeamGoals = 0;

            fixture.result = -1;

            ret.push(fixture);
          });

          resolve(ret);
        }
      );
    });
  }

  static ScrapFifaForResult(req, res) {
    return new Promise(function(resolve, reject) {
      var gameId = req.query.gameId;

      request(
        {
          method: 'GET',
          url: 'http://www.fifa.com/worldcup/matches/',
        },
        function(err, response, body, callback) {
          if (err)
            return console.error(err);

          let ret = { r: -1, hg: 0, ag: 0 };

          let $ = cheerio.load(body);

          let fixture = $('.fixture[data-id=' + gameId + ']').eq(0);

          ret.r = fixture.attr('data-status');

          // logic for result return : 0, 1, 2 for 1, X, 2

          resolve(ret);
        }
      );

    });
  }
}
