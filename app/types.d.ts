declare interface dataMap {
  [key: string]: string;
}

declare interface holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties?: string[];
  launchYear?: number;
  types: string[];
}

declare interface holidayMonthList {
  [key: number]: {
    name: string;
    global: boolean;
    counties?: string[];
    date: string;
  };
}
declare type holidayList = [
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList,
  holidayMonthList
];
