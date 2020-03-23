const request = require('request-promise');
const cheerio = require('cheerio');


(async () => {

    console.log(`Initial request to get the csrf_token value`);
    let initialRequest = await request({
        uri:'http://quotes.toscrape.com/login',
        gzip: true,
        resolveWithFullResponse: true
    });

    //// Parsing the cookie
    let cookie = initialRequest.headers['set-cookie'].map(value => value.split(':')[0]).join(' ');

    let $ = cheerio.load(initialRequest.body);
    ///token grabber from POST request
    let csrfToken = $('input[name="csrf_token"]').val();

    console.log(`POST Request to login form`);
    try {
    let loginRequest = await request({
        uri: 'http://quotes.toscrape.com/login',
        method: 'POST',
        gzip: true,
        headers: {
            //headers gained from preserved POST back
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'quotes.toscrape.com',
            'Origin': 'http://quotes.toscrape.com',
            'Referer': 'http//quotes.toscrape.com/login',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/74.0'
        },
        form: {
            'csrf_token': csrfToken,
            ///could put an input from a wordlist
            'username': 'un',
            'password': 'pw'
        },
        resolveWithFullResponse: true
    })
    } catch(response) {
    //catch the cookie information
        cookie = response.response.headers['set-cookie'].map(value => value.split(';')[0]).join(' ');
    //console response.response.headers['set-cookie']
    //debugger
    } 

    //check the login from the body response in LoggedInresponse
    console.log(`LoggedIn Request`);
    let loggedInResponse = await request({
        uri: 'http://quotes.toscrape.com/',
        method: 'GET',
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            ///removed since no longer completing form 'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'quotes.toscrape.com',
            'Origin': 'http://quotes.toscrape.com',
            'Referer': 'http//quotes.toscrape.com/login',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/74.0'
        }
    });

    debugger;

})();