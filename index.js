const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Ganti host ke 0.0.0.0 agar dapat diakses dari device lain
const host = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Endpoint untuk daftar kota
app.get('/api/city', (req, res) => {
  fs.readFile('./cities.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal membaca file cities.json:', err.message);
      return res.status(500).json({ error: 'Gagal membaca data kota lokal' });
    }
    try {
      const cities = JSON.parse(data);
      res.json({
        rajaongkir: {
          results: cities,
        },
      });
    } catch (parseErr) {
      console.error('Gagal parsing JSON:', parseErr.message);
      res.status(500).json({ error: 'Data kota tidak valid' });
    }
  });
});

// Endpoint dummy ongkir
app.post('/api/cost', (req, res) => {
  const { origin, destination, courier } = req.body;

  if (!origin || !destination || !courier) {
    return res.status(400).json({ error: 'Origin, destination, dan courier wajib diisi' });
  }

  let cost = 10000;
  if (courier === 'jne') cost = 12000;
  if (courier === 'jnt') cost = 14000;
  if (origin !== destination) cost += 3000;

  res.json({
    rajaongkir: {
      results: [
        {
          code: courier,
          costs: [
            {
              service: 'REG',
              cost: [
                {
                  value: cost,
                  etd: '2-3',
                  note: '',
                },
              ],
            },
          ],
        },
      ],
    },
  });
});

// Jalankan server di semua interface
app.listen(port, host, () => {
  console.log(`✅ Server berjalan di http://${host}:${port}`);
});
