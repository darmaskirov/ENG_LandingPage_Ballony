import test from "node:test";
import assert from "node:assert/strict";
import { dateRange, totalPrice, validateBooking } from "../src/booking.js";
const now = new Date(2026, 9, 13, 12);
const good = {
  tour: "sunrise",
  date: "2026-10-14",
  participants: "2",
  name: "Alex Explorer",
  email: "explorer@example.com",
  consent: true,
};
test("valid local demo request", () =>
  assert.deepEqual(validateBooking(good, now), {}));
test("prices for all tours and participant boundaries", () => {
  assert.equal(totalPrice("sunrise", 2), 360);
  assert.equal(totalPrice("valleys", 8), 1920);
  assert.equal(totalPrice("private", 1), 390);
  for (const count of [0, 9, 1.5, "bad"])
    assert.equal(totalPrice("sunrise", count), null);
  assert.equal(totalPrice("unknown", 2), null);
});
test("rolling dates cross year boundary", () =>
  assert.deepEqual(dateRange(new Date(2026, 11, 31, 12)), {
    min: "2027-01-01",
    max: "2027-03-31",
  }));
test("past, too distant and impossible dates rejected", () => {
  for (const date of ["", "2026-10-13", "2027-01-12", "2026-11-31", "garbage"])
    assert.ok(validateBooking({ ...good, date }, now).date);
  assert.ok(!validateBooking({ ...good, date: "2027-01-11" }, now).date);
});
test("invalid contact data and missing acknowledgement rejected", () => {
  const errors = validateBooking(
    { ...good, name: " ", email: "bad@", consent: false },
    now,
  );
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.consent);
});
test("unicode names and trimmed contact data work", () =>
  assert.deepEqual(
    validateBooking(
      { ...good, name: "Олексій", email: "demo+balloon@example.com" },
      now,
    ),
    {},
  ));
