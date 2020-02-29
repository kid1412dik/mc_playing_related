var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:min/:max', function(req, res, next) {
  var min = req.params.min;
  var max = req.params.max;

  res.json({ YourMin: min, YourMax: max });
});

module.exports = router;