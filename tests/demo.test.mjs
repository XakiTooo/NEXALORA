import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file, dependencies = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', js)(name => {
    if (!(name in dependencies)) throw new Error('Unexpected dependency: ' + name);
    return dependencies[name];
  }, module, module.exports);
  return module.exports;
}
const missions = load('src/lib/data/missionsDatabase.ts');
const uploads = load('src/lib/demo/submissions.ts', { '@/lib/data/missionsDatabase': missions });
test('catalog and detail work while network is unavailable', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network must not be used'); };
  try {
    const catalog = await missions.fetchMissionsCatalog();
    assert.equal(catalog.length, 3);
    for (const mission of catalog) {
      const detail = await missions.fetchMissionDetail(mission.id);
      assert.equal(detail.mission.id, mission.id);
      assert.ok(detail.quizQuestions.length);
      assert.ok(detail.dicodingModules.length);
    }
  } finally { globalThis.fetch = original; }
});
test('demo submission accepts file metadata without uploading content', async () => {
  const result = await uploads.submitAssignment('misi-if-kantin', {name:'tugas.pdf',size:1024,type:'application/pdf'}, 'Demo');
  assert.equal(result.userId, 'demo-local');
  assert.equal(result.path, '');
  assert.ok(result.id);
});
test('demo still rejects invalid and oversized files', async () => {
  for (const file of [{name:'script.exe',size:10,type:''},{name:'tugas.pdf',size:26*1024*1024,type:'application/pdf'},{name:'tugas.pdf',size:0,type:'application/pdf'}]) {
    await assert.rejects(uploads.submitAssignment('misi-if-kantin',file,''));
  }
});
test('API adapter never calls the remote backend', async () => {
  const api = load('src/lib/api/client.ts');
  await assert.rejects(api.apiRequest('/api/profile'), error => error.code === 'DEMO_LOCAL_ONLY');
  assert.equal(api.getStoredToken(), null);
});
test('demo package has no Supabase dependency or environment files', () => {
  const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
  assert.equal(pkg.dependencies['@supabase/supabase-js'], undefined);
  assert.equal(fs.existsSync('.env.local'), false);
  assert.equal(fs.existsSync('src/lib/supabase'), false);
});
