"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./datePicker.module.css";
import { getHolidaysByYear } from "@/app/api/publicHolidays";
import RegionPicker from "../regionPicker/regionPicker";

export default function DatePicker() {
  const [pickedDate, setPickedDate] = useState(new Date(Date.now()));
  const [shownDate, setShownDate] = useState(new Date(Date.now()));
  const [showModal, setShowModal] = useState(false);
  const [monthDays, setMonthDays] = useState([0]);
  const [region, setRegion] = useState("GE");
  const [holidays, setHolidays] = useState({} as holidayList);
  const [monthHolidays, setMonthHolidays] = useState({} as holidayMonthList);

  const fetchHolidays = async (year: number, month: number) => {
    const data = await getHolidaysByYear(year);
    setMonthHolidays(holidays[month]);
    setHolidays(data);
  };

  useEffect(() => {
    const sDate = new Date(shownDate);
    fetchHolidays(sDate.getFullYear(), sDate.getMonth());
  }, [fetchHolidays, shownDate]);

  useEffect(() => {
    getMonthInfo(shownDate.getFullYear(), shownDate.getMonth());
  }, [region]);

  const openModal = () => {
    setShowModal(true);
    setShownDate(pickedDate);
    getMonthInfo(shownDate.getFullYear(), shownDate.getMonth());
  };

  const changeDay = (day: number) => {
    if (day > 0) {
      setShownDate(
        new Date(shownDate.getFullYear(), shownDate.getMonth(), day)
      );
    }
  };

  const getMonthInfo = (year: number, month: number) => {
    const dayCount = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const curDays = new Array(firstDay).fill(0);
    for (let i = 1; i <= dayCount; i++) {
      curDays.push(i);
    }
    setMonthDays(curDays);
    if (holidays) {
      setMonthHolidays(holidays[month]);
    }
    return dayCount;
  };

  const getHoliday = (d: number) => {
    if (monthHolidays) {
      let h = monthHolidays[d];
      if (h && (h.global || h.counties?.includes(`CH-${region}`))) {
        return h;
      }
    }
    return null;
  };

  const getClassName = (d: number, i: number) => {
    if (d <= 0) {
      return styles.hidden;
    }
    if (getHoliday(d)) {
      return styles.holiday;
    }
    if ((i + 2) % 7 < 2) {
      return styles.weekend;
    }
    return "";
  };

  const incYearAndMonth = async (yInc = 0, mInc = 0) => {
    const year = shownDate.getFullYear() + yInc;
    const month = shownDate.getMonth() + mInc;
    let day = shownDate.getDate();
    const dayCount = getMonthInfo(year, month);
    if (day > dayCount) {
      day = dayCount;
    }
    setShownDate(new Date(year, month, day));
  };

  return (
    <div className={styles.datepicker}>
      {showModal && (
        <div className={styles.modal}>
          <p>
            <RegionPicker region={region} setRegion={setRegion} />
          </p>
          <h2>
            <span onClick={() => incYearAndMonth(-1)}>-</span>
            <span>{shownDate.getFullYear()}</span>
            <span onClick={() => incYearAndMonth(1)}>+</span>
          </h2>
          <h3>
            <span onClick={() => incYearAndMonth(0, -1)}>-</span>
            <span>{shownDate.getMonth() + 1}</span>
            <span onClick={() => incYearAndMonth(0, 1)}>+</span>
          </h3>
          <div>
            {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((j) => (
              <span key={j}>{j}</span>
            ))}
            <br />
            {monthDays.map((d, i) => (
              <Fragment key={`day${i}`}>
                <span
                  className={getClassName(d, i)}
                  aria-checked={d === shownDate.getDate()}
                  onClick={() => changeDay(d)}
                >
                  {d}
                  {getHoliday(d) && (
                    <span className={styles.tooltip}>
                      {getHoliday(d)?.name}
                    </span>
                  )}
                </span>
                {i % 7 === 6 && <br />}
              </Fragment>
            ))}
          </div>
          <button onClick={() => setShowModal(false)}>Cancel</button>
          <button
            onClick={() => {
              setPickedDate(shownDate);
              setShowModal(false);
            }}
          >
            Enregistrer
          </button>
        </div>
      )}
      <button
        onClick={() => openModal()}
        className={showModal ? styles.hidden : ""}
      >
        {pickedDate.toDateString()}
      </button>
    </div>
  );
}
