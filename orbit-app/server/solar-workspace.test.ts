import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { requiredScope } from './request-auth.ts';
import { SolarWorkspace } from './solar-workspace.ts';

const roots: string[] = [];
function fixture() { const root = mkdtempSync(join(tmpdir(), 'solar-files-')); roots.push(root); return { root, workspace: new SolarWorkspace(root) }; }
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
describe('Solar local project files', () => {
  it('lists supported files, hides internals, and opens nested source', () => {
    const { root, workspace } = fixture(); mkdirSync(join(root,'src')); mkdirSync(join(root,'node_modules'));
    writeFileSync(join(root,'.env'), 'SECRET=test'); writeFileSync(join(root,'image.png'), 'image'); writeFileSync(join(root,'src','app.ts'), 'export const answer = 42;');
    expect(workspace.list().entries.map(e => e.name)).toEqual(['src']);
    expect(workspace.read('src/app.ts').content).toContain('42');
  });
  it('creates files atomically and rejects stale revisions without changing disk', () => {
    const { root, workspace } = fixture(); const first = workspace.save('pages/brief.md', '# First', null);
    const second = workspace.save(first.path, '# Second', first.revision);
    expect(() => workspace.save(first.path, '# Stale draft', first.revision)).toThrow('changed');
    expect(() => workspace.save(first.path, '# Duplicate', null)).toThrow('changed');
    expect(readFileSync(join(root,first.path),'utf8')).toBe('# Second');
    expect(second.revision).not.toBe(first.revision);
  });
  it('rejects traversal, absolute paths, credentials, ADS and binary files', () => {
    const { root, workspace } = fixture();
    for (const path of ['../outside.md', '/outside.md', 'C:/outside.md', 'src/../../outside.md', '.git/config', '.env', 'src/file.ts:secret', 'src\\file.ts']) {
      expect(() => workspace.save(path, 'data', null)).toThrow();
    }
    writeFileSync(join(root,'binary.txt'), Buffer.from([0,1,2])); expect(() => workspace.read('binary.txt')).toThrow('Binary');
    expect(() => workspace.save('large.txt', 'x'.repeat(1_000_001), null)).toThrow('oversized');
  });
  it('does not follow a directory link outside the workspace', () => {
    const { root, workspace } = fixture(); const outside = fixture().root;
    writeFileSync(join(outside,'private.md'),'outside'); symlinkSync(outside, join(root,'linked'), 'junction');
    expect(workspace.list().entries).toEqual([]);
    expect(() => workspace.read('linked/private.md')).toThrow('Linked');
    expect(() => workspace.save('linked/new.md','data',null)).toThrow('Linked');
  });
  it('opens more source types, including extensionless project files', () => {
    const { root, workspace } = fixture();
    for (const name of ['App.vue', 'theme.scss', 'main.cpp', 'Dockerfile', 'Makefile']) writeFileSync(join(root, name), 'x');
    expect(workspace.list().entries.map(e => e.name).sort()).toEqual(['App.vue', 'Dockerfile', 'Makefile', 'main.cpp', 'theme.scss']);
    expect(workspace.read('Dockerfile').content).toBe('x');
  });
  it('serves preview assets with their type, including built pages, but never internals', () => {
    const { root, workspace } = fixture(); mkdirSync(join(root,'dist')); mkdirSync(join(root,'node_modules'));
    writeFileSync(join(root,'dist','index.html'), '<h1>built</h1>'); writeFileSync(join(root,'logo.png'), Buffer.from([137,80,78,71,0,1]));
    writeFileSync(join(root,'node_modules','x.js'), 'secret'); writeFileSync(join(root,'.env'), 'SECRET=1');
    expect(workspace.asset('dist/index.html').type).toMatch(/text\/html/);
    expect(workspace.asset('logo.png').data.length).toBe(6);
    for (const path of ['node_modules/x.js', '.env', '../x.html', 'tool.exe']) expect(() => workspace.asset(path)).toThrow();
  });
  it('requires owner/admin privileges for reading and writing project files', () => {
    for (const method of ['GET','PUT','POST','DELETE']) expect(requiredScope(method, '/api/bots/agent/solar-workspace')).toBe('admin');
  });
});
