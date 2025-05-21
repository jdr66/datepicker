"use client";

import { Fragment, useState } from "react";
import styles from "./datePicker.module.css";

export default function DatePicker() {
  const [pickedDate, setPickedDate] = useState(new Date(Date.now()));
  const [shownDate, setShownDate] = useState(new Date(Date.now()));
  const [showModal, setShowModal] = useState(false);
  const [monthDays, setMonthDays] = useState([0]);

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
    return dayCount;
  };

  const incYearAndMonth = (yInc = 0, mInc = 0) => {
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
                  className={d > 0 ? "" : styles.hidden}
                  aria-checked={d === shownDate.getDate()}
                  onClick={() => changeDay(d)}
                >
                  {d}
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
