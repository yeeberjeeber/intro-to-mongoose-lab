import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Customer from './models/customer.js'

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB!');
  console.log('Database name:', mongoose.connection.name);
})
.catch(err => console.log('MongoDB connection error: ', err));

// Routes
app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

app.post('/customers', async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.status(201).json(customer);
});

app.put('/customers/:id', async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/customers/:id', async (req, res) => {
  const deleted = await Customer.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});