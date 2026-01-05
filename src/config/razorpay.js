// // Razorpay configuration for TEST mode only
// const Razorpay = require('razorpay');

// // Create Razorpay instance with test credentials
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// module.exports = razorpay;
// Razorpay configuration
const Razorpay = require('razorpay');

let razorpay;

try {
  // Check if environment variables are set
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  Razorpay keys not found. Using dummy instance.');
    // Create dummy instance for development
    razorpay = {
      orders: {
        create: async (options) => {
          console.log('Dummy Razorpay order created:', options);
          return {
            id: `order_dummy_${Date.now()}`,
            amount: options.amount,
            currency: options.currency,
            status: 'created'
          };
        }
      }
    };
  } else {
    // Create real Razorpay instance
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized');
  }
} catch (error) {
  console.error('❌ Razorpay initialization error:', error.message);
  // Fallback to dummy instance
  razorpay = {
    orders: {
      create: async (options) => {
        console.log('Fallback Razorpay order:', options);
        return {
          id: `order_fallback_${Date.now()}`,
          amount: options.amount,
          currency: options.currency,
          status: 'created'
        };
      }
    }
  };
}

module.exports = razorpay;