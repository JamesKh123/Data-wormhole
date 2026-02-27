import Papa from 'papaparse';
import type { SiteRecord } from '../types';

function parseRows(results: Papa.ParseResult<Record<string, string>>): SiteRecord[] {
  return results.data
    .filter((row) => row.Site && row.Year && row.Region)
    .map((row) => ({
      Site: row.Site?.trim() ?? '',
      Year: parseInt(row.Year, 10),
      Region: row.Region?.trim() ?? '',
      Users: parseInt(row.Users, 10) || 0,
      Trainings: parseInt(row.Trainings, 10) || 0,
    }));
}

export function parseCSV(file: File): Promise<SiteRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(parseRows(results)),
      error: (err: Error) => reject(err),
    });
  });
}

export async function loadDefaultCSV(): Promise<SiteRecord[]> {
  const response = await fetch('/sample_data.csv');
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(parseRows(results)),
      error: (err: Error) => reject(err),
    });
  });
}
