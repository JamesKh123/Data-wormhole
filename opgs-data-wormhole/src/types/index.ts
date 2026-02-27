export interface SiteRecord {
  Site: string;
  Year: number;
  Region: string;
  Users: number;
  Trainings: number;
}

export interface YearAggregate {
  Year: number;
  Users: number;
  Trainings: number;
  Sites: number;
}

export interface RegionAggregate {
  Region: string;
  Users: number;
  Trainings: number;
  Sites: number;
}

export interface FilterState {
  year: string;
  region: string;
  search: string;
}
