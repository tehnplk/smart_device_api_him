var express = require('express');
var router = express.Router();

var knex = require('../con_db');
var version = require('../version')

router.get('/', function (req, res, next) {

  res.render('index', {
    title: `SMART DEVICE API ${version.version()}`
  });
});

router.get('/test', async function (req, res) {
  let sql = ` select * from opd order by regdate desc , timereg desc limit 1 `;
  let data = await knex.raw(sql);
  res.json({
    'hn': data[0][0].hn,
    'regdate': data[0][0].regdate,
    'timereg': data[0][0].timereg,
    'frequency': data[0][0].frequency
  })
});


module.exports = router;