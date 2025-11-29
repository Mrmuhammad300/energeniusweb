// Test to see what products are available
const fetch = require('node-fetch');

async function testProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const products = await res.json();
    
    console.log('Total products:', products.length);
    console.log('\nProducts with wattage:');
    
    const withWattage = products.filter(p => p.wattage && p.wattage > 0);
    console.log('Count:', withWattage.length);
    
    withWattage.forEach(p => {
      console.log(`- ${p.name}: ${p.wattage}W (SKU: ${p.sku})`);
    });
    
    // Test recommendation logic for 10,000W
    const targetWattage = 10000;
    const suitable = withWattage.filter(
      p => p.wattage >= targetWattage * 0.8 && p.wattage <= targetWattage * 1.5
    ).sort((a, b) => Math.abs(a.wattage - targetWattage) - Math.abs(b.wattage - targetWattage)).slice(0, 3);
    
    console.log(`\nFor ${targetWattage}W target (range: ${targetWattage * 0.8}W - ${targetWattage * 1.5}W):`);
    console.log('Suitable products:', suitable.length);
    suitable.forEach(p => {
      console.log(`- ${p.name}: ${p.wattage}W`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testProducts();
