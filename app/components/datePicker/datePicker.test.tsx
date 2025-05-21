import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DatePicker from "./datePicker";

describe("DatePicker", () => {
  const NOWDATE = new Date("2024-01-31");
  const NOWSTRING = "Wed Jan 31 2024";
  beforeAll(() => {
    const date = NOWDATE;
    jest.useFakeTimers().setSystemTime(date);
  });

  it("renders the date", () => {
    render(<DatePicker />);
    const button = screen.getByText(NOWSTRING);

    expect(button).toBeInTheDocument();
  });

  it("changes the day", () => {
    render(<DatePicker />);
    const button = screen.getByText(NOWSTRING);
    fireEvent.click(button);

    const day13 = screen.getByText("13");
    fireEvent.click(day13);
    expect(day13.getAttribute("aria-checked")).toBe("true");
  });

  it("changes the month and shows the leap year 29th", () => {
    render(<DatePicker />);
    const button = screen.getByText(NOWSTRING);
    fireEvent.click(button);

    const day31 = screen.getByText("31");
    expect(day31).toBeInTheDocument();
    const incMonthButton = screen.getAllByText("+")[1];
    fireEvent.click(incMonthButton);
    const day29 = screen.getByText("29");
    expect(day29.getAttribute("aria-checked")).toBe("true");
  });

  it("changes the year and saves the date", () => {
    render(<DatePicker />);
    const button = screen.getByText(NOWSTRING);
    fireEvent.click(button);

    const decYearButton = screen.getAllByText("-")[0];
    fireEvent.click(decYearButton);
    const year = screen.getByText("2023");
    expect(year).toBeInTheDocument();

    const saveButton = screen.getByText("Enregistrer");
    fireEvent.click(saveButton);
    const dateButton = screen.getByText("Tue Jan 31 2023");
    expect(dateButton).toBeInTheDocument();
  });
});
