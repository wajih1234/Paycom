const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  const saltRounds = 10; // The cost factor
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Example usage
(async () => {
  const myPassword = 'wajih45!';
  const hashed = await hashPassword(myPassword);
  console.log('Hashed password:', hashed);
})();
