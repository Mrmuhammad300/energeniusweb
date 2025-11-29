// Test script to verify capacity conversions
// Inline implementation for testing

function convertAmpHoursToWattHours(ampHours, watts) {
  let voltage = 12;
  
  if (watts >= 15000) {
    voltage = 48;
  } else if (watts >= 3000) {
    voltage = 48;
  } else if (watts >= 1500 || ampHours >= 80) {
    voltage = 24;
  } else {
    voltage = 12;
  }
  
  return ampHours * voltage;
}

function parseCapacityToWattHours(capacityStr, watts) {
  if (!capacityStr || capacityStr === 'N/A') {
    return watts > 0 ? watts * 0.8 : 0;
  }
  
  const ahMatch = capacityStr.match(/(\d+)\s*(?:Amp\s*Hours?|Ah)/i);
  if (ahMatch) {
    const ampHours = parseInt(ahMatch[1]);
    return convertAmpHoursToWattHours(ampHours, watts);
  }
  
  const numMatch = capacityStr.match(/(\d+)/);
  if (numMatch) {
    const ampHours = parseInt(numMatch[1]);
    return convertAmpHoursToWattHours(ampHours, watts);
  }
  
  return watts > 0 ? watts * 0.8 : 0;
}

// Test data
const testCases = [
  // Scout Series (Portable)
  { name: 'Scout 400', wattage: 400, capacity: '40 Amp Hours', expectedVoltage: 12, expectedWh: 480 },
  { name: 'Scout 750', wattage: 750, capacity: '40 Amp Hours', expectedVoltage: 12, expectedWh: 480 },
  { name: 'Scout 1000', wattage: 1000, capacity: '40 Amp Hours', expectedVoltage: 12, expectedWh: 480 },
  { name: 'Scout 750 Pro', wattage: 750, capacity: '120 Amp Hours', expectedVoltage: 24, expectedWh: 2880 },
  { name: 'Scout 1000 Pro', wattage: 1000, capacity: '120 Amp Hours', expectedVoltage: 24, expectedWh: 2880 },
  
  // Nomad Series
  { name: 'Nomad 1500', wattage: 1500, capacity: '120 Amp Hours', expectedVoltage: 24, expectedWh: 2880 },
  { name: 'Nomad 2000', wattage: 2000, capacity: '120 Amp Hours', expectedVoltage: 24, expectedWh: 2880 },
  
  // Guardian Series
  { name: 'Guardian 3000', wattage: 3000, capacity: '200 Amp Hours', expectedVoltage: 48, expectedWh: 9600 },
  { name: 'Guardian 5000', wattage: 5000, capacity: '400 Amp Hours', expectedVoltage: 48, expectedWh: 19200 },
  { name: 'Guardian 8000', wattage: 8000, capacity: '400 Amp Hours', expectedVoltage: 48, expectedWh: 19200 },
  
  // Titan Series
  { name: 'Titan 10K', wattage: 10000, capacity: '400 Amp Hours', expectedVoltage: 48, expectedWh: 19200 },
  { name: 'Titan 15K', wattage: 15000, capacity: '600 Amp Hours', expectedVoltage: 48, expectedWh: 28800 },
  
  // Apex Series
  { name: 'Apex 20K', wattage: 20000, capacity: '400 Amp Hours', expectedVoltage: 48, expectedWh: 19200 },
  { name: 'Apex 25K', wattage: 25000, capacity: '800 Amp Hours', expectedVoltage: 48, expectedWh: 38400 },
  { name: 'Apex 30K', wattage: 30000, capacity: '800 Amp Hours', expectedVoltage: 48, expectedWh: 38400 },
  
  // PowerBank Series (Battery-only products)
  { name: 'PowerBank 40', wattage: 0, capacity: '40 Amp Hours', expectedVoltage: 12, expectedWh: 480 },
  { name: 'PowerBank 45', wattage: 0, capacity: '45 Amp Hours', expectedVoltage: 12, expectedWh: 540 },
  { name: 'PowerBank 80', wattage: 0, capacity: '80 Amp Hours', expectedVoltage: 24, expectedWh: 1920 },
  { name: 'PowerBank 90', wattage: 0, capacity: '90 Amp Hours', expectedVoltage: 24, expectedWh: 2160 },
  { name: 'PowerBank 120', wattage: 0, capacity: '120 Amp Hours', expectedVoltage: 24, expectedWh: 2880 },
];

console.log('\n🔋 Testing EnerGenius Capacity Conversions\n');
console.log('='.repeat(100));

let passCount = 0;
let failCount = 0;

testCases.forEach(test => {
  const actualWh = parseCapacityToWattHours(test.capacity, test.wattage);
  const passed = actualWh === test.expectedWh;
  
  if (passed) {
    passCount++;
    console.log(`✅ ${test.name.padEnd(20)} | ${test.wattage}W | ${test.capacity.padEnd(15)} → ${actualWh.toLocaleString()}Wh (${test.expectedVoltage}V)`);
  } else {
    failCount++;
    console.log(`❌ ${test.name.padEnd(20)} | ${test.wattage}W | ${test.capacity.padEnd(15)} → Expected: ${test.expectedWh.toLocaleString()}Wh, Got: ${actualWh.toLocaleString()}Wh`);
  }
});

console.log('='.repeat(100));
console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed out of ${testCases.length} tests\n`);

if (failCount === 0) {
  console.log('🎉 All capacity conversions are correct!\n');
} else {
  console.log('⚠️  Some conversions need adjustment.\n');
  process.exit(1);
}
