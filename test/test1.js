var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test GET Leons profile', function () {
    //	this.timeout(15000);

    var requestResult;
    var response;

    before(function (done) {
        chai.request("shortenme.azurewebsites.net")
            .get("/app/account/leonardolw@hotmail.com")
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET should return an array object with at least 1 object', function () {
        expect(response).to.have.status(200);
        //expect(response.body).to.be.an.object;
        expect(response.body).to.have.length.above(0);
        expect(response).to.have.headers;
    });

    it('The first entry in the array has accountID', function () {
        expect(requestResult[0]).to.include.keys('accountId');
    });
    it('The response is formed correctly', function () {
        expect(response.body).to.not.be.a.string;
    });

    it('All elements in returned array have accountId number', function () {
        expect(response.body).to.satisfy(
            function (body) {
                for (var i = 0; i < body.length; i++) {
                    expect(body[i]).to.have.property('accountId').that.is.a('string');
                }
                return true;
            });
    });
    it('The elements returned array have all the expected string properties', function () {
        expect(response.body).to.satisfy(
            function (body) {
                for (var i = 0; i < body.length; i++) {
                    expect(body[i]).to.have.property('fName').that.is.a('string');
                    expect(body[i]).to.have.property('mName').that.is.a('string');
                    expect(body[i]).to.have.property('lName').that.is.a('string');
                    expect(body[i]).to.have.property('emailAddr').that.is.a('string');
                    expect(body[i]).to.have.property('phoneNum').that.is.a('string');
                    expect(body[i]).to.have.property('userType').that.is.a('string');
                    expect(body[i]).to.have.property('createDate').that.is.a('string');
                }
                return true;
            });
    });
});


describe('Test GET Leons urls', function () {
    //	this.timeout(15000);

    var requestResult;
    var response;

    before(function (done) {
        chai.request("shortenme.azurewebsites.net")
            .get("/app/account/url/leonardolw@hotmail.com")
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET should return an object', function () {
        expect(response).to.have.status(200);
        //expect(response.body).to.be.an.object;
        expect(response).to.have.headers;
    });
    it('GET should return an object with an account id', function () {
        expect(response.body).to.include.keys('accountId');
    });
    it('GET should return an object with an urls array', function () {
        expect(response.body).to.have.property('urls').that.is.a('array');
    });
    it('The response is formed correctly', function () {
        expect(response.body).to.not.be.a.string;
    });

    it('All elements in returned array have accountId number', function () {
        expect(response.body).to.have.property('accountId').that.is.a('string');
    });
    it('The elements returned array have all the expected properties', function () {
        expect(response.body.urls).to.satisfy(
            function (urls) {
                for (var i = 0; i < urls.length; i++) {
                    expect(urls[i]).to.have.property('urlId').that.is.a('number');
                    expect(urls[i]).to.have.property('shortUrl').that.is.a('string');
                    expect(urls[i]).to.have.property('longUrl').that.is.a('string');
                    expect(urls[i]).to.have.property('expirationDate').that.is.a('string');
                    expect(urls[i]).to.have.property('isRemoved').that.is.a('boolean');
                }
                return true;

            });
    });
});

describe('Test POST Leon shortens a url', function () {

    var requestResult;
    var response;

    before(function (done) {
        chai.request("shortenme.azurewebsites.net")
            .post("/app/url/")
            .send({ 'accountId': 'leonardolw@hotmail.com', 'longUrl': 'www.testingurlpost1.com' })
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST should return an object', function () {
        expect(response).to.have.status(200);
        expect(response).to.have.headers;
    });

    it('The first entry is formed correctly', function () {
        expect(response.body).to.not.be.a.string;
    });
    it('The elements object with all the expected properties', function () {
        expect(response.body).to.have.property('urlId').that.is.a('number');
        expect(response.body).to.have.property('shortUrl').that.is.a('string');
        expect(response.body).to.have.property('longUrl').that.is.a('string');
        expect(response.body).to.have.property('emojiLink').that.is.a('string');
        expect(response.body).to.have.property('expirationDate').that.is.a('string');
        expect(response.body).to.have.property('isRemoved').that.is.a('boolean');
    });
});