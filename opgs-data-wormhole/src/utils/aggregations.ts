import type { SiteRecord, YearAggregate, RegionAggregate } from '../types';

export function aggregateByYear(records: SiteRecord[]): YearAggregate[] {
  const map = new Map<number, YearAggregate>();
  for (const r of records) {
    const existing = map.get(r.Year);
    if (existing) {
      existing.Users += r.Users;
      existing.Trainings += r.Trainings;
      existing.Sites += 1;
    } else {
      map.set(r.Year, { Year: r.Year, Users: r.Users, Trainings: r.Trainings, Sites: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.Year - b.Year);
}

export function aggregateByRegion(records: SiteRecord[]): RegionAggregate[] {
  const map = new Map<string, RegionAggregate>();
  for (const r of records) {
    const existing = map.get(r.Region);
    if (existing) {
      existing.Users += r.Users;
      existing.Trainings += r.Trainings;
      existing.Sites += 1;
    } else {
      map.set(r.Region, { Region: r.Region, Users: r.Users, Trainings: r.Trainings, Sites: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.Trainings - a.Trainings);
}

export function getSummary(records: SiteRecord[]) {
  const sites = new Set(records.map((r) => r.Site)).size;
  const users = records.reduce((sum, r) => sum + r.Users, 0);
  const trainings = records.reduce((sum, r) => sum + r.Trainings, 0);
  const regions = new Set(records.map((r) => r.Region)).size;
  const years = Array.from(new Set(records.map((r) => r.Year))).sort();
  return { sites, users, trainings, regions, years };
}

export function filterRecords(
  records: SiteRecord[],
  year: string,
  region: string,
  search: string
): SiteRecord[] {
  return records.filter((r) => {
    const matchYear = year === '' || r.Year === parseInt(year, 10);
    const matchRegion = region === '' || r.Region === region;
    const q = search.toLowerCase();
    const matchSearch =
      q === '' || r.Site.toLowerCase().includes(q) || r.Region.toLowerCase().includes(q);
    return matchYear && matchRegion && matchSearch;
  });
}
