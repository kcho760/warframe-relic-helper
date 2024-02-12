const express = require('express');
const router = express.Router();
const { fetchActiveVoidFissures } = require('../services/voidFissuresService');

router.get('/active-fissures', async (req, res) => {
  try {
    const fissures = await fetchActiveVoidFissures();
    res.json(fissures);
  } catch (error) {
    res.status(500).send('Failed to fetch active fissures');
  }
});

module.exports = router;
