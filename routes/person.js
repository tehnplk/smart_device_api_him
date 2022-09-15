var express = require('express');
var router = express.Router();
var knex = require('../con_db');

// vn = concat(o.hn,',',o.regdate,',',o.frequency)

router.get('/get_person_by_vn/:vn', async function (req, res, next) {
  let vn = req.params.vn;
  let sql = ` SELECT p.hn ,REPLACE(p.cardid,'-','') cid ,p.fullname FROM opd p
  WHERE  concat(p.hn,'|',p.regdate,'|',p.frequency) =? limit 1  `;
  let data = await knex.raw(sql, [vn]);
  try {
    res.json({
      'hn': data[0][0].hn,
      'cid': data[0][0].cid,
      'fullname': data[0][0].fullname
    })
  } catch (error) {
    res.json({
      'hn': '0',
      'cid': '0',
      'fullname': 'ไม่พบรายชื่อ'
    });
  }

});

router.get('/get_person_by_cid/:cid', async function (req, res, next) {
  let cid = req.params.cid;
  let sql = ` SELECT p.hn,REPLACE(p.cardid,'-','') cid,fullname from opd p where REPLACE(p.cardid,'-','') = ? limit 1`;
  let data = await knex.raw(sql, [cid]);

  try {
    res.json({
      'hn': data[0][0].hn,
      'cid': data[0][0].cid,
      'fullname': data[0][0].fullname
    })
  } catch (error) {
    res.json({
      'hn': '0',
      'cid': '0',
      'fullname': 'ไม่พบรายชื่อ'
    });
  }

});

router.get('/get_cid_by_hn/:hn', async function (req, res, next) {
  let hn = req.params.hn;
  let sql = ` SELECT REPLACE(p.cardid,'-','') cid  from opd p where p.hn = ?  and CURRENT_DATE >= p.regdate  ORDER BY p.regdate  DESC limit 1`;
  let data = await knex.raw(sql, [hn]);

  try {
    res.json({
      'cid': data[0][0].cid
    })
  } catch (error) {
    res.json({
      'cid': '0'
    });
  }

});

router.get('/get_vn_by_cid/:cid', async function (req, res, next) {
  let cid = req.params.cid;
  let sql = ` select concat(o.hn,'|',o.regdate,'|',o.frequency) vn  from opd o 
  where  REPLACE(o.cardid,'-','')=? and regdate = CURRENT_DATE order by timereg desc limit 1 `;
  let data = await knex.raw(sql, [cid]);

  try {
    res.json({
      'vn': data[0][0].vn
    })
  } catch (error) {
    res.json({
      'vn': '0'
    });
  }

});


module.exports = router;