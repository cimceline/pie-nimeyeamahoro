import mongoose from 'mongoose';
import config from '../config/index.js';
import User from '../models/User.js';

async function unlock() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const email = process.argv[2] || 'tumusengeblaise7@gmail.com';
    const newPassword = process.argv[3] || 'Admin123!';

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      console.log(`User not found: ${email}`);
      process.exit(1);
    }

    console.log(`Before: loginAttempts=${user.loginAttempts}, lockUntil=${user.lockUntil}`);

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.password = newPassword;
    await user.save();

    console.log(`After:  loginAttempts=${user.loginAttempts}, lockUntil=${user.lockUntil}`);
    console.log(`Password reset to: ${newPassword}`);
    console.log(`Account unlocked and password reset for ${email}`);
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

unlock();
