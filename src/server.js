const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
});