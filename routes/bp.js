var express = require('express');
var router = express.Router();

var knex = require('../con_db');

// vn = concat(o.hn,',',o.regdate,',',o.frequency)

router.get('/', function (req, res, next) {
  res.render('bp', {
    title: 'BP'
  });
});

router.post('/add_log', async function (req, res, next) {

  let vn = req.body.vn;
  let cid = req.body.cid;
  let bps = req.body.bps;
  let bpd = req.body.bpd;
  let pulse = req.body.pulse;
  let hn = req.body.hn;
  let fullname = req.body.fullname;
  let note1 = req.body.note1;
  let note2 = req.body.note2;
  let note3 = req.body.note3;

  d_update = new Date();
  console.log(d_update)

  var id = await knex('smart_gate_bp')
    .insert({
      id: null,
      vn: vn,
      cid: cid,
      bps: bps,
      bpd: bpd,
      pulse: pulse,
      hn: hn,
      fullname: fullname,
      d_update: d_update,
      note1: note1,
      note2: note2,
      note3: note3
    })
  res.json({
    'id': id[0]
  })
});

router.post('/update_opdscreen', async function (req, res, next) {

  let vn = req.body.vn;
  let hpressure = req.body.bps;
  let lpressure = req.body.bpd;
  let pulse = req.body.pulse;

  console.log('POST BP DATA = ', vn, hpressure, lpressure, pulse);

  let data = vn.split('|');
  let hn = data[0];
  let regdate = data[1];
  let frequency = data[2];

  let effect = await knex('opd')
    .where({
      'hn': hn,
      'regdate': regdate,
      'frequency': frequency
    })
    .update({
      hpressure: hpressure,
      lpressure: lpressure,
      pulse: pulse
    })

  res.json({
    'effect': effect
  })
});

router.post('/add_opdscreen_bp', async function (req, res, next) {

  let vn = req.body.vn;
  let bps = req.body.bps;
  let bpd = req.body.bpd;
  let pulse = req.body.pulse;
  let depcode = req.body.depcode;
  let staff = req.body.staff;
  let sql = ` replace into opdscreen_bp 
  set opdscreen_bp_id = get_serialnumber('opdscreen_bp_id') 
  ,vn =? ,bps=? ,bpd=? ,pulse=? ,depcode=? ,staff=? 
  ,screen_date = CURRENT_DATE,screen_time = CURRENT_TIME ,rr=0,o2sat=0,temperature=0 `;
  try {
    let data = await knex.raw(sql, [vn, bps, bpd, pulse, depcode, staff]);
    res.json({
      'opdscreen_bp': 'added'
    });
  } catch (error) {
    res.json({
      'opdscreen_bp': 'error'
    });
  }


});



module.exports = router;