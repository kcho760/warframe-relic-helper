const express = require('express');
const router = express.Router();
const relicsController = require('../controllers/relicsController.js');

// Updated route to get all non-vaulted relic names
router.get('/', relicsController.getAllNonVaultedRelicNames);

// Updated route to get information for a specific non-vaulted relic
router.get('/:relicName', relicsController.getNonVaultedRelicInfo);

module.exports = router;
