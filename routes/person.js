var express = require('express');
var router = express.Router();
var knex = require('../con_db');

// vn = concat(o.hn,',',o.regdate,',',o.frequency)

router.get('/get_person_by_vn/:vn', async function (req, res, next) {
  let vn = req.params.vn;
  let sql = ` SELECT p.hn ,p.cid ,CONCAT(p.pname,p.fname,' ',p.lname) as fullname  
  FROM ovst o INNER JOIN patient p ON p.hn = o.hn WHERE  o.vn =? limit 1  `;
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
  let sql = ` SELECT hn,cardid cid,fullname from opd p where p.cardid = ? limit 1`;
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
  let sql = ` SELECT p.cardid  from opd p where p.hn = ?  limit 1`;
  let data = await knex.raw(sql, [hn]);

  try {
    res.json({
      'cid': data[0][0].cardid
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
  where  o.cardid=? and regdate = CURRENT_DATE order by timereg desc limit 1 `;
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