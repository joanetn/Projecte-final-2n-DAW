const router = require("express").Router();
const controller = require("../controllers/ranking.controller");

router.get("/", controller.getRanking);
router.get("/lliga/:lligaId", controller.getRankingLiga);

module.exports = router;
