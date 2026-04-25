document.addEventListener("DOMContentLoaded", () => {
  const serviceSelect = document.getElementById("service");
  const dateInput = document.getElementById("date");
  const timeSlotSelect = document.getElementById("timeSlot");
  const bookingForm = document.getElementById("bookingStep1");

  // ID of your single doctor
  const SINGLE_DOCTOR_ID = 14;
  const SINGLE_DOCTOR_NAME = "Dr. John Smith";

  // 1️⃣ Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  // 2️⃣ Load saved booking from localStorage
  const savedBooking = JSON.parse(localStorage.getItem("bookingData"));
  if (savedBooking) {
    serviceSelect.value = savedBooking.service_id || "";
    dateInput.value = savedBooking.date || "";
    timeSlotSelect.value = savedBooking.time_slot_id || "";
  }

  // 3️⃣ Load services
  fetch("/api/services")
    .then(res => res.json())
    .then(services => {
      services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = service.service_name;
        serviceSelect.appendChild(option);
      });

      // Restore selection if saved
      if (savedBooking && savedBooking.service_id) {
        serviceSelect.value = savedBooking.service_id;
        serviceSelect.dispatchEvent(new Event("change")); // trigger time slots load
      }
    });

  // 4️⃣ Load static time slots when date is selected
  dateInput.addEventListener("change", () => {
    const selectedDate = dateInput.value;
    timeSlotSelect.innerHTML = `<option value="">-- Choose a Time --</option>`;
    if (!selectedDate) return;

    const timeSlots = [
      { id: 1, start_time: "09:00", end_time: "09:30" },
      { id: 2, start_time: "09:30", end_time: "10:00" },
      { id: 3, start_time: "10:00", end_time: "10:30" },
      { id: 4, start_time: "10:30", end_time: "11:00" },
      { id: 5, start_time: "11:00", end_time: "11:30" },
      { id: 6, start_time: "11:30", end_time: "12:00" },
    ];

    timeSlots.forEach(slot => {
      const option = document.createElement("option");
      option.value = slot.id;
      option.textContent = `${slot.start_time} - ${slot.end_time}`;
      timeSlotSelect.appendChild(option);
    });

    // Restore time slot if saved
    if (savedBooking && savedBooking.time_slot_id) {
      timeSlotSelect.value = savedBooking.time_slot_id;
    }
  });

  // 5️⃣ Save selections to localStorage on form submit
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!serviceSelect.value || !dateInput.value || !timeSlotSelect.value) {
      alert("Please select a service, date, and time.");
      return;
    }

    const bookingData = {
      service_id: serviceSelect.value,
      service_name: serviceSelect.options[serviceSelect.selectedIndex].text,
      doctor_id: SINGLE_DOCTOR_ID,
      doctor_name: SINGLE_DOCTOR_NAME,
      date: dateInput.value,
      time_slot_id: timeSlotSelect.value,
      time_slot_text: timeSlotSelect.options[timeSlotSelect.selectedIndex].text
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    alert("Booking saved! You can now proceed to the next step.");
  });
});