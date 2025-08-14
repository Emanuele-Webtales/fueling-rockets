#!/usr/bin/env node

/**
 * Generate secure teacher access codes for Fueling Rockets
 * Run this script to generate new codes when needed
 */

import crypto from 'crypto';

function generateCode(length = 8) {
  // Generate a secure random code with mixed case and numbers
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return result;
}

function generateMultipleCodes(count = 5) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateCode());
  }
  return codes;
}

console.log('🎓 Fueling Rockets - Teacher Access Code Generator\n');

const codes = generateMultipleCodes(5);
console.log('Generated teacher access codes:');
codes.forEach((code, index) => {
  console.log(`${index + 1}. ${code}`);
});

console.log('\n📝 To use these codes:');
console.log('1. Add one to your .env file: NEXT_PUBLIC_TEACHER_ACCESS_CODE=CODE_HERE');
console.log('2. Share the code with teachers who need access');
console.log('3. Each code can be used by multiple teachers');
console.log('4. Generate new codes when needed for security');

console.log('\n🔒 Security notes:');
console.log('- Codes are case-sensitive');
console.log('- Store codes securely and rotate periodically');
console.log('- Consider using different codes for different schools/organizations');
