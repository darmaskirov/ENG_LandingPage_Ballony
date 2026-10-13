export const tours = [
  {
    id: "sunrise",
    name: "The Sunrise Flight",
    price: 180,
    duration: "60-minute flight",
    group: "Shared basket",
    description:
      "A quiet ascent into the first light, drifting above the sculpted valleys of Göreme.",
    includes: [
      "Illustrative hotel transfer",
      "Pre-flight briefing",
      "Sunrise valley route",
    ],
    image: "sunrise",
  },
  {
    id: "valleys",
    name: "The Valley Explorer",
    price: 240,
    duration: "90-minute flight",
    group: "Small-group basket",
    description:
      "An unhurried journey over fairy chimneys, soft ridgelines and the folds of the Rose Valley.",
    includes: [
      "Illustrative hotel transfer",
      "Extended valley route",
      "Time for photography",
    ],
    image: "valleys",
  },
  {
    id: "private",
    name: "Just Your Sky",
    price: 390,
    duration: "60-minute flight",
    group: "Private concept",
    description:
      "A more intimate perspective on Cappadocia, imagined for you and your favourite people.",
    includes: [
      "Illustrative private transfer",
      "Private basket concept",
      "A slower morning itinerary",
    ],
    image: "sunrise",
  },
];
export function dateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dateRange(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 90);
  return { min: dateISO(start), max: dateISO(end) };
}
export function totalPrice(tourId, participants) {
  const tour = tours.find((t) => t.id === tourId);
  const count = Number(participants);
  return tour && Number.isInteger(count) && count >= 1 && count <= 8
    ? tour.price * count
    : null;
}
export function validateBooking(data, now = new Date()) {
  const errors = {};
  const range = dateRange(now);
  if (!tours.some((t) => t.id === data.tour))
    errors.tour = "Choose a demo experience.";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? "") ||
    Number.isNaN(Date.parse(`${data.date}T12:00:00`)) ||
    dateISO(new Date(`${data.date}T12:00:00`)) !== data.date ||
    data.date < range.min ||
    data.date > range.max
  )
    errors.date = "Choose a demo date between tomorrow and 90 days from today.";
  if (totalPrice(data.tour, data.participants) === null)
    errors.participants = "Choose between 1 and 8 participants.";
  if (
    !data.name?.trim() ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 80
  )
    errors.name =
      "Enter a name with 2–80 characters. A sample name is welcome.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "") ||
    data.email.length > 254
  )
    errors.email = "Enter a valid email, for example explorer@example.com.";
  if (!data.consent)
    errors.consent = "Please acknowledge that this is a local demo.";
  return errors;
}
