"use client";

import { ChangeEvent, useState } from "react";
import cantons from "../../data/cantons.json";

interface regionPickerProps {
  setRegion: (reg: string) => void;
  region?: string;
}

export default function DatePicker(props: regionPickerProps) {
  const { region, setRegion } = props;
  const CANTONS = cantons as dataMap;

  const handleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setRegion(ev.target.value);
  };

  return (
    <select defaultValue={region || "GE"} onChange={handleChange}>
      {Object.keys(CANTONS).map((key) => (
        <option key={key} value={key}>
          {CANTONS[key]}
        </option>
      ))}
    </select>
  );
}
