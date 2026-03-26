import 'dotenv/config';
import mongoose from 'mongoose';
import promptSync from 'prompt-sync';
import Customer from './models/Customer.js';

const prompt = promptSync();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Welcome to the CRM');

async function mainMenu() {
  let running = true;

  while (running) {
    console.log('\nWhat would you like to do?\n');
    console.log('  1. Create a customer');
    console.log('  2. View all customers');
    console.log('  3. Update a customer');
    console.log('  4. Delete a customer');
    console.log('  5. Quit');

    const choice = prompt('Number of action to run: ');

    switch (choice) {
      case '1': // Create
        await createCustomer();
        break;
      case '2': // View
        await viewCustomers();
        break;
      case '3': // Update
        await updateCustomer();
        break;
      case '4': // Delete
        await deleteCustomer();
        break;
      case '5': // Quit
        running = false;
        break;
      default:
        console.log('Invalid choice, try again.');
    }
  }

  mongoose.connection.close();
  console.log('Exiting the application.');
}

async function createCustomer() {
  const name = prompt('Customer name: ');
  const age = parseInt(prompt('Customer age: '), 10);

  const customer = new Customer({ name, age });
  await customer.save();
  console.log('Customer created:', customer);
}

async function viewCustomers() {
  const customers = await Customer.find();
  console.log('\nCustomers:');
  customers.forEach(c => console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`));
}

async function updateCustomer() {
  await viewCustomers();
  const id = prompt('Copy and paste the ID of the customer to update: ');

  const name = prompt('What is the customer\'s new name? ');
  const age = parseInt(prompt('What is the customer\'s new age? '), 10);

  const updated = await Customer.findByIdAndUpdate(id, { name, age }, { new: true });
  if (updated) {
    console.log('Customer updated:', updated);
  } else {
    console.log('Customer not found.');
  }
}

async function deleteCustomer() {
  await viewCustomers();
  const id = prompt('Copy and paste the ID of the customer to delete: ');

  const deleted = await Customer.findByIdAndDelete(id);
  if (deleted) {
    console.log('Customer deleted:', deleted);
  } else {
    console.log('Customer not found.');
  }
}

mainMenu();