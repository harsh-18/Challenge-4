const test = require('node:test');
const assert = require('node:assert');
const { venueProfiles, scenarios, incidentOverrides, generateLocalFallback } = require('./app.js');

test('VenueIQ 2026 Data Model Tests', (t) => {
  // Test Venue Profiles
  assert.ok(venueProfiles.ny, 'New York venue profile should exist');
  assert.strictEqual(venueProfiles.ny.name, 'New York New Jersey Stadium');
  assert.strictEqual(venueProfiles.ny.capacity, '82,500');
  
  assert.ok(venueProfiles.atl, 'Atlanta venue profile should exist');
  assert.strictEqual(venueProfiles.atl.name, 'Atlanta Stadium');

  // Test Scenarios
  assert.ok(scenarios.pregame, 'Pregame scenario should exist');
  assert.strictEqual(scenarios.pregame.risk, 'Elevated');

  assert.ok(scenarios.weather, 'Weather scenario should exist');
  assert.strictEqual(scenarios.weather.risk, 'Weather watch');

  // Test Incidents
  assert.ok(incidentOverrides.gate_fail, 'Gate failure incident should exist');
  assert.strictEqual(incidentOverrides.gate_fail.zone, 'North gate');
});

test('VenueIQ 2026 Local RAG Fallback Engine Tests', async (t) => {
  // Mock the venueSelect element value since local RAG checks it
  global.venueSelect = { value: 'ny' };

  await t.test('returns Spanish translation on Spanish keywords', () => {
    const prompt = 'Necesito una ruta sin escaleras en español por favor';
    const result = generateLocalFallback(prompt);
    assert.match(result, /En el estadio/);
    assert.match(result, /entrada familiar/);
  });

  await t.test('returns French translation on French keywords', () => {
    const prompt = 'shuttle bus en français';
    const result = generateLocalFallback(prompt);
    assert.match(result, /Au stade/);
    assert.match(result, /recommandons/);
  });

  await t.test('returns Portuguese translation on Portuguese keywords', () => {
    const prompt = 'caminho de acessibilidade em português';
    const result = generateLocalFallback(prompt);
    assert.match(result, /No estádio/);
    assert.match(result, /acesso sem degraus/);
  });

  await t.test('returns Arabic translation on Arabic keywords', () => {
    const prompt = 'ترجمة بالعربية';
    const result = generateLocalFallback(prompt);
    assert.match(result, /ملعب/);
    assert.match(result, /قطار الأنفاق/);
  });

  await t.test('returns German translation on German keywords', () => {
    const prompt = 'auf deutsch bitte';
    const result = generateLocalFallback(prompt);
    assert.match(result, /Stadion/);
    assert.match(result, /Bahnverbindung/);
  });

  await t.test('returns English fallback default on general input', () => {
    const prompt = 'Where is the nearest wheelchair accessible elevator?';
    const result = generateLocalFallback(prompt);
    assert.match(result, /At New York New Jersey Stadium/);
    assert.match(result, /family entry/);
  });
});
