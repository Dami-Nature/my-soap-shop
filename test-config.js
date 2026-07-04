// Load config.js content
const fs = require('fs');
const configContent = fs.readFileSync('./config.js', 'utf8');

// Execute in a new context to simulate browser environment
const vm = require('vm');
const context = vm.createContext({});
try {
  vm.runInContext(configContent, context);
  console.log('Context keys:', Object.keys(context));
  console.log('CONFIG exists:', 'CONFIG' in context);
  if ('CONFIG' in context) {
    console.log('CONFIG:', context.CONFIG);
  }
} catch (e) {
  console.log('Error executing config:', e.message);
}
