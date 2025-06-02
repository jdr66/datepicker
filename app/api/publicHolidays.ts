import { Yesteryear } from "next/font/google";

const CH = "CH";
const emptyHolidayList = new Array(12).fill({}) as unknown as holidayList;

const setStorageItem = (
  holidays: holiday[],
  countrycode: string,
  year: number
) => {
  try {
    const jsonValue = JSON.stringify(holidays);
    localStorage.setItem(`${countrycode}-${year}`, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const getStorageItem = (countrycode: string, year: number) => {
  try {
    const jsonValue = localStorage.getItem(`${countrycode}-${year}`);
    const value = jsonValue ? JSON.parse(jsonValue) : ([] as holiday[]);
    return value;
  } catch (e) {
    return [] as holiday[];
  }
};

const mapHolidays = (unmapped: holiday[]) => {
  const mapped = JSON.parse(JSON.stringify(emptyHolidayList)) as holidayList;
  unmapped.forEach((d) => {
    const { date, localName: name, global, counties } = d;
    const [_year, month, day] = date.split("-");
    mapped[parseInt(month) - 1][parseInt(day)] = {
      name,
      global,
      counties,
      date,
    };
  });
  return mapped;
};

export const getHolidaysByYear = async (year: number) => {
  let holidays = getStorageItem(CH, year);
  if (holidays.lenght > 0) {
    return mapHolidays(holidays);
  }
  try {
    holidays = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${CH}`
    )
      .then((res) => res.json())
      .then((res) => {
        const days = res as holiday[];
        setStorageItem(days, CH, year);
        return mapHolidays(days);
      });
    return holidays;
  } catch (e) {
    console.error(e);
    return emptyHolidayList;
  }
};
