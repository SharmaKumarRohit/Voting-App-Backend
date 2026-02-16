const express = require("express");
const router = express.Router();
const {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  submitVote,
  countVotes,
  getCandidates,
} = require("../controllers/candidateController");
const { jwtAuthMiddleware } = require("../jwt");

router.post("/", jwtAuthMiddleware, createCandidate);
router.put("/:candidateId", jwtAuthMiddleware, updateCandidate);
router.delete("/:candidateId", jwtAuthMiddleware, deleteCandidate);
router.post("/vote/:candidateId", jwtAuthMiddleware, submitVote);
router.get("/vote/count", countVotes);
router.get("/", getCandidates);

module.exports = router;
