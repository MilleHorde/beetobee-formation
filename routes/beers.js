"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const models = require('../models');
const socket = require('../tools/socket');

const check = {
  name: {
    type: 'string',
    required: true
  },
  priceCts: {
    type: 'number',
    required: true
  },
  description: {
    type: 'string'
  },
  country: {
    type: 'string'
  },
  alcoholPercent: {
    type: 'number',
    required: true
  },
  vote: {
    type: 'number'
  }
};

let checkObj = (obj) => {
  let errors = [];
  Object.keys(check).forEach((item) => {
    let alreadyError = false;
    if (check[item].required && !obj[item]) {
      errors.push(`Missing ${item}`);
    }
    if (typeof obj[item] !== check[item].type && !alreadyError && obj[item]) {
      errors.push(`Bad type for ${item}`);
    }
  });

  if (errors.length) {
    return errors;
  } else {
    return true;
  }
};

//BEERS ROUTES /beers

/**
 * @api {get} /beers/:id Get one specific beer
 * @apiName GetByIdBeer
 * @apiGroup Beers
 *
 * @apiParam {ObjectId} id id of specific beer
 *
 * @apiSuccess {Object} beer wanted.
 */
router.get('/:id', [], (req, res) => {
  return models.Beer.findById(req.params.id)
    .then((beer) => {
      res.json(beer);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    })
});

/**
 * @api {get} /beers/ Get all beers
 * @apiName GetAllBeers
 * @apiGroup Beers
 *
 * @apiSuccess {Array} ingredients. (filtered)
 */
router.get('/', [], (req, res) => {
  return models.Beer.find({})
    .then((beers) => {
      res.json(beers);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    })
});

/**
 * @api {post} /beers/ Add beer
 * @apiName AddBeer
 * @apiGroup Beers
 *
 * @apiParam {String} [name] name of beer
 * @apiParam {String} [description] description of beer
 * @apiParam {String} [country] country of beer
 * @apiParam {Number} [alcoholPercent] alcolhol percent of beer
 * @apiParam {Number} [priceCts] price of beer in cts
 *
 * @apiSuccess {Object} beer created.
 */
router.post('/', [], (req, res) => {
  let toCreate = req.body;

  let checked = checkObj(toCreate);

  if (typeof checked === 'boolean') {
    return models.Beer.create(toCreate)
      .then((newBeer) => {
        res.json(newBeer);
      })
      .catch((err) => {
        res.status(500).json({error: err});
      })
  } else {
    res.status(403).json({error: checked});
  }
});

/**
 * @api {put} /beers/:id/up Up vote of beer
 * @apiName VoteUpBeer
 * @apiGroup Beers
 *
 * @apiParam {ObjectId} id id of beer wanted
 *
 * @apiSuccess {Object} beer updated.
 */
router.put('/:id/up', [], (req, res) => {
  return models.Beer.findById(req.params.id)
    .then((beer) => {
      if (!beer) {
        res.status(404).json({error: 'Not found'});
      }

      return models.Beer.update(req.params.id, {vote: beer.vote + 1}, {new: true})
    })
    .then((newBeer)=>{
      socket.alertElse(newBeer, "voteUp", "beer");
      res.json(newBeer);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
});

/**
 * @api {put} /beers/:id/down Down vote of beer
 * @apiName VoteDownBeer
 * @apiGroup Beers
 *
 * @apiParam {ObjectId} id id of beer wanted
 *
 * @apiSuccess {Object} beer updated.
 */
router.put('/:id/down', [], (req, res) => {
  return models.Beer.findById(req.params.id)
    .then((beer) => {
      if (!beer) {
        res.status(404).json({error: 'Not found'});
      }

      return models.Beer.update(req.params.id, {vote: beer.vote - 1}, {new: true})
    })
    .then((newBeer)=>{
      socket.alertElse(newBeer, "voteDown", "beer");
      res.json(newBeer);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
});

/**
 * @api {put} /beers/:id Update one specific beer
 * @apiName UpdateBeer
 * @apiGroup Beers
 *
 * @apiParam {ObjectId} id id of beer wanted
 * @apiParam {String} [name] name of beer
 * @apiParam {String} [description] description of beer
 * @apiParam {String} [country] country of beer
 * @apiParam {Number} [alcoholPercent] alcolhol percent of beer
 * @apiParam {Number} [priceCts] price of beer in cts
 *
 * @apiSuccess {Object} beer updated.
 */
router.put('/:id', [], (req, res) => {
  let toUpdate = req.body;
  let errors = [];

  Object.keys(toUpdate).forEach((item) => {
    if (typeof toUpdate[item] !== check[item].type) {
      errors.push(`Bad type for ${item}`);
    }
  });

  if (!errors.length) {
    return models.Beer.update(req.params.id, toUpdate, {new: true})
      .then((newBeer) => {
        res.json(newBeer);
      })
      .catch((err) => {
        res.status(500).json({error: err});
      })
  } else {
    res.status(403).json({error: errors});
  }
});

/**
 * @api {delete} /beers/:id Delete one specific beers
 * @apiName DeleteBeer
 * @apiGroup Beers
 *
 * @apiParam {ObjectId} id id of specific beer
 *
 * @apiSuccess {Boolean} response.
 */
router.delete('/:id', [], (req, res) => {
  return models.Beer.remove(req.params.id)
    .then((deleted) => {
      res.json(deleted);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    })
});

module.exports = router;
