// Simulate browser loading
global.CONFIG = undefined;
eval(require('fs').readFileSync('./config.js', 'utf8'));

if (!global.CONFIG) {
  console.error('FAILED: CONFIG not defined after eval');
  process.exit(1);
}

// Validate structure
const required = {
  'hero.image': (obj) => typeof obj.hero?.image === 'string',
  'about.image': (obj) => typeof obj.about?.image === 'string',
  'about.text': (obj) => typeof obj.about?.text === 'string',
  'categoryCards.cosmetics': (obj) => typeof obj.categoryCards?.cosmetics === 'string',
  'categoryCards.teas': (obj) => typeof obj.categoryCards?.teas === 'string',
  'categoryCards.sets': (obj) => obj.categoryCards?.sets === null
};

const failures = [];
for (const [key, check] of Object.entries(required)) {
  if (!check(CONFIG)) {
    failures.push(`FAIL: ${key}`);
  } else {
    console.log(`✓ ${key}`);
  }
}

if (failures.length > 0) {
  console.error('\nValidation failed:');
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('\n✓ All structure validations passed');
  console.log(`\nCONFIG object size:`, JSON.stringify(CONFIG).length, 'characters');
}
