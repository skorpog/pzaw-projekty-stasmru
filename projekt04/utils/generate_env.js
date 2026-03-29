import crypto from 'crypto';

const port = process.env.PORT || 3000;
const pepper = crypto.randomBytes(32).toString('hex');
console.log(`PORT=${port}`);
console.log(`PEPPER=${pepper}`);
