const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // ✅ ไม่ต้องใช้ config

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/records', async (req, res) => {
  const records = await prisma.financialRecord.findMany();
  res.json(records);
});

app.post('/records', async (req, res) => {
  const { item, income, expense, note, total } = req.body;
  const newRecord = await prisma.financialRecord.create({
    data: { item, income, expense, note, total },
  });
  res.json(newRecord);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
