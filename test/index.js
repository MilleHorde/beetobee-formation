"use strict";

if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}

const models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe("### Beer API tests ###", () => {

  //Just require all your test.js file
  before(() => {
    let self = this;
    self.api = chai.request(server);
  });

  describe("GET / - tests", () => {
    before(() => {
      let self = this;
      self.create = {
        name: 'test',
        alcoholPercent: 2,
        priceCts: 300
      };
      return models.Beer.remove({})
        .then(()=>{
          return models.Beer.create(self.create);
        })
    });

    it("should return new beer created", ()=>{
      let self = this;
      return self.api.get('/beers')
        .then((res)=>{
          expect(res.body.length).to.eql(1);
        })
    })
  })
});