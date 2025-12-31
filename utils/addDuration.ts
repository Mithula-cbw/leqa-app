// Leqa © 2025 Mithula Chanthuka

type Duration = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
};

export const addDuration = (date: Date, duration: Duration): Date => {
  const d = new Date(date);

  if (duration.years) {
    d.setFullYear(d.getFullYear() + duration.years);
  }

  if (duration.months) {
    d.setMonth(d.getMonth() + duration.months);
  }

  if (duration.days) {
    d.setDate(d.getDate() + duration.days);
  }

  if (duration.hours) {
    d.setHours(d.getHours() + duration.hours);
  }

  return d;
};
