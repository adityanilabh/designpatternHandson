/* Study links.

   The bug this file exists to prevent: the drawer once offered "All reading for
   <module>", which navigated to the module page — the page the item is rendered
   on. Clicking the item there reopened the drawer, which offered the same link.
   A closed loop that never reached a resource.

   So the load-bearing assertion is the boring one: every study link leaves the
   app. */
import { describe, it, expect } from 'vitest';
import { allItems, findItem } from '../lib/items';
import { studyFor } from '../lib/study';
import RESOURCES from '../content/resources';

const ITEMS = allItems();

describe('study links never navigate inside the app', () => {
  it('every href on every item is absolute and external', () => {
    const offenders: string[] = [];
    for (const item of ITEMS) {
      const { reading, searches } = studyFor(item);
      for (const l of [...reading, ...searches]) {
        if (!/^https?:\/\//.test(l.href)) offenders.push(`${item.key}: ${l.label} -> ${l.href}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('no link points at this app, however it is spelled', () => {
    const bad = /(^|\/\/)(localhost|designpattern-handson\.vercel\.app)/i;
    const offenders: string[] = [];
    for (const item of ITEMS) {
      const { reading, searches } = studyFor(item);
      for (const l of [...reading, ...searches]) {
        if (bad.test(l.href)) offenders.push(`${item.key}: ${l.href}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('every item has somewhere to go', () => {
  it('no item is left with an empty study block', () => {
    const empty = ITEMS.filter((i) => {
      const s = studyFor(i);
      return !s.reading.length && !s.searches.length;
    });
    expect(empty.map((i) => i.key)).toEqual([]);
  });

  it('every link carries a non-empty label', () => {
    for (const item of ITEMS) {
      const { reading, searches } = studyFor(item);
      for (const l of [...reading, ...searches]) expect(l.label.trim()).not.toBe('');
    }
  });

  it('links are unique within an item — no destination offered twice', () => {
    for (const item of ITEMS) {
      const { reading, searches } = studyFor(item);
      const hrefs = [...reading, ...searches].map((l) => l.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });
});

describe('curated rows are filtered to the item they are about', () => {
  it('a String question is not offered HashMap reading', () => {
    /* the exact regression: techRead is per-module, so every Java question was
       being handed the module's HashMap article */
    const item = findItem('tq-java-0')!;
    expect(item.name).toMatch(/String/i);
    const labels = studyFor(item).reading.map((r) => r.label.toLowerCase());
    expect(labels.some((l) => l.includes('hashmap'))).toBe(false);
  });

  it('a HashMap question still keeps its HashMap reading', () => {
    const item = ITEMS.find((i) => i.key.startsWith('tq-java-') && /^HashMap internals/.test(i.name))!;
    const labels = studyFor(item).reading.map((r) => r.label.toLowerCase());
    expect(labels.some((l) => l.includes('hashmap'))).toBe(true);
  });

  it('system design sessions keep all their per-session reading', () => {
    /* sdRead is keyed by session, so it is already item-specific and must not
       be filtered — session 2 is caching and owns four links */
    const reading = studyFor(findItem('sd-2')!).reading;
    expect(reading.length).toBeGreaterThanOrEqual(3);
  });
});

describe('resolved resources', () => {
  it('every generated URL is absolute and carries a title', () => {
    for (const [key, rows] of Object.entries(RESOURCES)) {
      for (const [publisher, url, title] of rows) {
        expect(url, key).toMatch(/^https:\/\//);
        expect(publisher.trim(), key).not.toBe('');
        expect(title.trim(), key).not.toBe('');
      }
    }
  });

  it('a resolved item shows the article title, not just the publisher', () => {
    const key = Object.keys(RESOURCES)[0];
    if (!key) return;                       /* generator not run yet */
    const label = studyFor(findItem(key)!).reading[0].label;
    expect(label).toMatch(/ — .+/);
  });
});

describe('blind prompts keep their withheld-solution warning', () => {
  it('warns, and offers exactly one way out', () => {
    const bp = ITEMS.find((i) => i.key.startsWith('bp-'))!;
    const s = studyFor(bp);
    expect(s.warning).toMatch(/no solutions by design/i);
    expect(s.reading).toEqual([]);
    expect(s.searches).toHaveLength(1);
  });
});
