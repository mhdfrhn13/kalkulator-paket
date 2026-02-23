// Data Destinasi (Sesuai source)
const DESTINATIONS = [
  { id: 1, name: "Lembah Anai", price: 5000 },
  { id: 2, name: "PDIKM", price: 25000 },
  { id: 3, name: "Panorama", price: 25000 },
  { id: 4, name: "Panorama Baru", price: 10000 },
  { id: 5, name: "Harau", price: 50000 },
  { id: 6, name: "Malin Kundang", price: 10000 },
  { id: 7, name: "Danau Ateh Bawah", price: 10000 },
  { id: 8, name: "Istana Pagaruyung", price: 25000 },
  { id: 9, name: "Benteng", price: 50000 },
];

function formatIDR(val) {
  return "Rp " + Math.ceil(val).toLocaleString("id-ID");
}

function renderHotelInputs() {
  const nights = parseInt(document.getElementById("nights").value) || 0;
  const container = document.getElementById("hotel-list-container");
  const currentValues = Array.from(
    document.querySelectorAll(".hotel-input"),
  ).map((i) => i.value);

  container.innerHTML = "";
  for (let i = 1; i <= nights; i++) {
    const val = currentValues[i - 1] || 0;
    container.innerHTML += `
      <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
        <div class="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[10px] font-bold text-slate-400 shadow-sm">${i}</div>
        <div class="flex-1">
          <input type="text" placeholder="Nama Hotel" class="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-300" value="Hotel Malam ${i}">
        </div>
        <div class="relative">
          <span class="absolute left-2 top-1.5 text-[10px] text-slate-400 font-bold">Rp</span>
          <input type="number" class="hotel-input w-28 pl-7 p-1.5 bg-white border border-slate-200 rounded-lg text-right text-xs font-bold outline-indigo-500" value="${val}">
        </div>
      </div>`;
  }
  calculate();
}

function renderDestinations() {
  const destDiv = document.getElementById("destinations-list");
  DESTINATIONS.forEach((d) => {
    destDiv.innerHTML += `
      <label class="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer transition-all">
        <div class="flex items-center gap-3">
          <input type="checkbox" class="dest-check" value="${d.price}">
          <span class="text-sm font-semibold text-slate-700">${d.name}</span>
        </div>
        <span class="text-slate-400 text-xs font-bold">${formatIDR(d.price)}</span>
      </label>`;
  });
}

function calculate() {
  const pax = parseInt(document.getElementById("participants").value) || 0;
  const days = parseInt(document.getElementById("days").value) || 0;

  // Transport
  const vSelect = document.getElementById("vehicle");
  const vPrice = parseInt(vSelect.value);
  const vCap = parseInt(vSelect.options[vSelect.selectedIndex].dataset.cap);
  const vUnits = parseInt(document.getElementById("vehicle-units").value) || 0;
  const transportCost = vPrice * days * vUnits;

  // Recommendation logic
  const recVehicles = vCap > 0 ? Math.ceil(pax / vCap) : 0;
  document.getElementById("vehicle-recommendation").innerText =
    `* Rekomendasi min: ${recVehicles} unit`;

  // Akomodasi
  const rooms = parseInt(document.getElementById("room-units").value) || 0;
  let hotelCost = 0;
  document
    .querySelectorAll(".hotel-input")
    .forEach((input) => (hotelCost += (parseInt(input.value) || 0) * rooms));

  // Makan & Guide
  const mealCost =
    (parseInt(document.getElementById("meal-price").value) || 0) *
    (parseInt(document.getElementById("meal-qty").value) || 0) *
    pax;
  const guideTotal =
    (parseInt(document.getElementById("guide-fee").value) || 0) * days;

  // Tiket
  let destCost = 0;
  document
    .querySelectorAll(".dest-check:checked")
    .forEach((cb) => (destCost += parseInt(cb.value) * pax));

  // Totals
  const profit = parseInt(document.getElementById("profit-nominal").value) || 0;
  const totalModal =
    transportCost + hotelCost + mealCost + destCost + guideTotal;
  const totalJual = totalModal + profit;
  const perPax = pax > 0 ? totalJual / pax : 0;

  // UI Update
  document.getElementById("breakdown").innerHTML = `
    <div class="flex justify-between text-sm"> <span class="text-slate-400">Transportasi</span> <span>${formatIDR(transportCost)}</span> </div>
    <div class="flex justify-between text-sm"> <span class="text-slate-400">Akomodasi</span> <span>${formatIDR(hotelCost)}</span> </div>
    <div class="flex justify-between text-sm"> <span class="text-slate-400">Guide Service</span> <span>${formatIDR(guideTotal)}</span> </div>
    <div class="flex justify-between text-sm"> <span class="text-slate-400">Konsumsi</span> <span>${formatIDR(mealCost)}</span> </div>
    <div class="flex justify-between text-sm"> <span class="text-slate-400">Tiket Wisata</span> <span>${formatIDR(destCost)}</span> </div>
    <div class="flex justify-between font-bold pt-4 border-t border-slate-700 text-lg"> <span>Total Modal</span> <span>${formatIDR(totalModal)}</span> </div>`;

  document.getElementById("price-per-pax").innerText = formatIDR(perPax);
}

// Initializing
document.addEventListener("DOMContentLoaded", () => {
  renderDestinations();
  renderHotelInputs();
  document.body.addEventListener("input", (e) => {
    if (e.target.id === "nights") renderHotelInputs();
    calculate();
  });
  document.body.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") calculate();
  });
});
