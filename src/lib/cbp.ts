import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Census County Business Patterns 2023, Kentucky counties (see ../data/ky-cbp-notes.md).
// Copied from ../data by scripts/sync-content.mjs; the build runs from the site folder.
const csvPath = join(process.cwd(), 'content', 'data', 'ky-cbp-2023-establishments.csv');

export interface CountyRow {
  county: string;
  establishments: number;
  employees: number;
}

export const tradeNaics: Record<string, { code: string; label: string; short: string }> = {
  'plumbing-hvac': { code: '238220', label: 'Plumbing, heating and air-conditioning contractors', short: 'Plumbing & HVAC' },
  electrical: { code: '238210', label: 'Electrical contractors', short: 'Electrical' },
  'landscaping-tree': { code: '561730', label: 'Landscaping services (includes tree services)', short: 'Landscaping & tree' },
  roofing: { code: '238160', label: 'Roofing contractors', short: 'Roofing' },
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

let cache: Record<string, string>[] | null = null;

function load(): Record<string, string>[] {
  if (cache) return cache;
  const [header, ...rest] = parseCsv(readFileSync(csvPath, 'utf-8').replace(/^﻿/, ''));
  cache = rest
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
  return cache;
}

export function countiesFor(trade: string): CountyRow[] {
  const naics = tradeNaics[trade]?.code;
  if (!naics) return [];
  return load()
    .filter((r) => r.NAICS2017 === naics)
    .map((r) => ({
      county: r.NAME.replace(/ County, Kentucky$/, ''),
      establishments: Number(r.ESTAB),
      employees: Number(r.EMP),
    }))
    .sort((a, b) => b.establishments - a.establishments);
}

export function summary(trade: string) {
  const rows = countiesFor(trade);
  return {
    rows,
    total: rows.reduce((s, r) => s + r.establishments, 0),
    countiesReported: rows.length,
    top: rows[0],
  };
}
