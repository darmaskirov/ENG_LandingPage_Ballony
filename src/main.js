import { tours, dateRange, totalPrice, validateBooking } from "./booking.js";
const $ = (id) => document.getElementById(id);
const form = $("booking-form");
document.documentElement.classList.add("js");
form.querySelector('[type="submit"]').disabled = false;
const money = (value) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
function updateDates() {
  const range = dateRange();
  $("date").min = range.min;
  $("date").max = range.max;
}
updateDates();
function updatePrice() {
  const tour = tours.find((t) => t.id === $("tour").value);
  const count = Number($("participants").value);
  $("total").value = money(totalPrice(tour.id, count));
  $("price-breakdown").textContent =
    `${count} ${count === 1 ? "person" : "people"} × ${money(tour.price)} · Demo price`;
}
function readForm() {
  return {
    tour: $("tour").value,
    date: $("date").value,
    participants: $("participants").value,
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    consent: $("consent").checked,
  };
}
let attempted = false;
function renderErrors(data, focus = false) {
  const errors = validateBooking(data);
  for (const key of Object.keys(data)) {
    const field = $(key);
    $(`${key}-error`).textContent = errors[key] || "";
    if (errors[key]) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }
  if (focus && Object.keys(errors).length) $(Object.keys(errors)[0]).focus();
  return errors;
}
form.addEventListener("input", () => {
  updatePrice();
  if (attempted) renderErrors(readForm());
});
form.addEventListener("change", () => {
  updatePrice();
  if (attempted) renderErrors(readForm());
});
const menu = document.querySelector(".menu-toggle");
const nav = $("navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  delete nav.dataset.open;
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.dataset.open = String(open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
for (const dialog of document.querySelectorAll("dialog")) {
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]"))
      document.body.style.overflow = "";
  });
}
function openDialog(dialog) {
  dialog.showModal();
  document.body.style.overflow = "hidden";
}
let chosenTour;
document.querySelectorAll("[data-tour]").forEach((button) =>
  button.addEventListener("click", () => {
    chosenTour = tours.find((t) => t.id === button.dataset.tour);
    $("tour-dialog-title").textContent = chosenTour.name;
    $("tour-description").textContent = chosenTour.description;
    $("tour-facts").textContent =
      `${chosenTour.duration} · ${chosenTour.group} · ${money(chosenTour.price)} / person (demo)`;
    $("tour-includes").replaceChildren(
      ...chosenTour.includes.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }),
    );
    openDialog($("tour-dialog"));
  }),
);
$("choose-tour").addEventListener("click", () => {
  $("tour").value = chosenTour.id;
  updatePrice();
  if (attempted) renderErrors(readForm());
  $("tour-dialog").close();
  $("booking").scrollIntoView();
  $("date").focus({ preventScroll: true });
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateDates();
  attempted = true;
  const data = readForm();
  if (Object.keys(renderErrors(data, true)).length) return;
  const tour = tours.find((t) => t.id === data.tour);
  const rows = [
    ["Experience", tour.name],
    [
      "Demo date",
      new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
        new Date(`${data.date}T12:00:00`),
      ),
    ],
    ["Participants", data.participants],
    ["Demo total", money(totalPrice(data.tour, data.participants))],
    ["Sample name", data.name],
    ["Sample email", data.email],
  ];
  $("review-summary").replaceChildren(
    ...rows.map(([label, value]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }),
  );
  $("review-eyebrow").textContent = "REVIEW YOUR DEMO";
  $("review-title").textContent = "A little closer.";
  $("review-message").textContent =
    "Check your illustrative request. Nothing will be sent or booked.";
  $("review-actions").hidden = false;
  $("restart-demo").hidden = true;
  openDialog($("review-dialog"));
});
$("edit-demo").addEventListener("click", () => $("review-dialog").close());
$("complete-demo").addEventListener("click", () => {
  $("review-eyebrow").textContent = "DEMO COMPLETE";
  $("review-title").textContent = "Imagine being there.";
  $("review-message").textContent =
    "Your demo request is complete. No reservation was made, no payment was taken, and nothing was sent. Sample contact details have been cleared.";
  $("review-summary").replaceChildren();
  $("review-actions").hidden = true;
  $("restart-demo").hidden = false;
  form.reset();
  attempted = false;
  renderErrors({
    tour: "sunrise",
    date: dateRange().min,
    participants: "2",
    name: "Sample",
    email: "sample@example.com",
    consent: true,
  });
  updatePrice();
  $("restart-demo").focus();
});
$("restart-demo").addEventListener("click", () => $("review-dialog").close());
