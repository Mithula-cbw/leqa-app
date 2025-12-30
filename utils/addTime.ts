// Leqa © 2025 Mithula Chanthuka

export const addTime = (date: Date, value: number, unit: string) => {
    const newDate = new Date(date);
    if (unit === "years") newDate.setFullYear(newDate.getFullYear() + value);
    else if (unit === "hours") newDate.setHours(newDate.getHours() + value);
    else newDate.setDate(newDate.getDate() + value);
    return newDate;
  };