const express = require('express');
const axios = require('axios');
const router = express.Router();

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

router.post('/nova-poshta', async (req, res) => {

  try {

    const requestData = req.body;

    const response = await axios.post(NOVA_POSHTA_API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error communicating with Nova Poshta API:', error.message);

    res.status(error.response?.status || 500).json({
      error: 'Failed to process request to Nova Poshta API',
      details: error.message,
    });
  }
});

module.exports = router;
