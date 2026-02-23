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

// Helper: Format angka ke Rupiah
function formatIDR(val) {
  return "Rp " + Math.ceil(val).toLocaleString("id-ID");
}

// Render daftar input hotel berdasarkan jumlah malam
function renderHotelInputs() {
  const nights = parseInt(document.getElementById("nights").value) || 0;
  const container = document.getElementById("hotel-list-container");
  const currentValues = Array.from(
    document.querySelectorAll(".hotel-input"),
  ).map((input) => input.value);

  container.innerHTML = "";
  for (let i = 1; i <= nights; i++) {
    const val = currentValues[i - 1] || 0;
    container.innerHTML += `
            <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-200 transition">
                <span class="text-xs font-bold text-slate-400 w-16 uppercase">Malam ${i}</span>
                <input type="text" placeholder="Hotel/Kota" class="flex-1 p-1 bg-transparent border-b border-slate-200 outline-none text-sm" value="Hotel Malam ${i}">
                <input type="number" class="hotel-input w-28 p-1 border rounded bg-white text-right outline-blue-500" value="${val}">
            </div>
        `;
  }
  calculate();
}

// Render daftar destinasi wisata
function renderDestinations() {
  const destDiv = document.getElementById("destinations-list");
  DESTINATIONS.forEach((d) => {
    destDiv.innerHTML += `
          <label class="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-transparent">
              <div class="flex items-center gap-3">
                  <input type="checkbox" class="dest-check w-4 h-4 rounded text-blue-600" value="${d.price}">
                  <span class="font-medium text-slate-700">${d.name}</span>
              </div>
              <span class="text-slate-400 text-xs">${formatIDR(d.price)}</span>
          </label>
        `;
  });
}

// Fungsi Utama: Kalkulasi Biaya
function calculate() {
  const pax = parseInt(document.getElementById("participants").value) || 0;
  const days = parseInt(document.getElementById("days").value) || 0;

  // Kendaraan
  const vSelect = document.getElementById("vehicle");
  const vPrice = parseInt(vSelect.value);
  const vCap = parseInt(vSelect.options[vSelect.selectedIndex].dataset.cap);
  const vUnits = parseInt(document.getElementById("vehicle-units").value) || 0;
  const transportCost = vPrice * days * vUnits;

  const recVehicles = vCap > 0 ? Math.ceil(pax / vCap) : 0;
  document.getElementById("vehicle-recommendation").innerText =
    `* Rekomendasi: min. ${recVehicles} unit untuk ${pax} pax.`;

  // Kamar
  const rooms = parseInt(document.getElementById("room-units").value) || 0;
  const recRooms = Math.ceil(pax / 2);
  document.getElementById("room-recommendation").innerText =
    `* Rekomendasi: ${recRooms} kamar (Twin Sharing).`;

  let hotelCost = 0;
  document.querySelectorAll(".hotel-input").forEach((input) => {
    hotelCost += (parseInt(input.value) || 0) * rooms;
  });

  // Konsumsi
  const mPrice = parseInt(document.getElementById("meal-price").value) || 0;
  const mQty = parseInt(document.getElementById("meal-qty").value) || 0;
  const mealCost = mPrice * mQty * pax;

  // Guide
  const gFeeDaily = parseInt(document.getElementById("guide-fee").value) || 0;
  const guideTotal = gFeeDaily * days;

  // Tiket Wisata
  let destCost = 0;
  document.querySelectorAll(".dest-check:checked").forEach((cb) => {
    destCost += parseInt(cb.value) * pax;
  });

  // Margin & Final
  const profitNominal =
    parseInt(document.getElementById("profit-nominal").value) || 0;
  const totalModal =
    transportCost + hotelCost + mealCost + destCost + guideTotal;
  const totalJual = totalModal + profitNominal;
  const perPax = pax > 0 ? totalJual / pax : 0;

  // Update UI Breakdown
  document.getElementById("breakdown").innerHTML = `
        <div class="flex justify-between"><span>Transport (${vUnits} unit)</span><span>${formatIDR(transportCost)}</span></div>
        <div class="flex justify-between"><span>Hotel (${rooms} kmr)</span><span>${formatIDR(hotelCost)}</span></div>
        <div class="flex justify-between text-blue-300"><span>Guide Fee (${days} hari)</span><span>${formatIDR(guideTotal)}</span></div>
        <div class="flex justify-between"><span>Konsumsi</span><span>${formatIDR(mealCost)}</span></div>
        <div class="flex justify-between"><span>Tiket Objek</span><span>${formatIDR(destCost)}</span></div>
        <div class="flex justify-between font-bold pt-2 border-t border-slate-700 text-white"><span>Total Modal</span><span>${formatIDR(totalModal)}</span></div>
        <div class="flex justify-between text-xs text-green-400 font-bold uppercase mt-2"><span>Margin Profit</span><span>${formatIDR(profitNominal)}</span></div>
    `;
  document.getElementById("price-per-pax").innerText = formatIDR(perPax);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderDestinations();
  renderHotelInputs();

  // Listen to any input change
  document.body.addEventListener("input", (e) => {
    if (e.target.matches("input, select")) {
      if (e.target.id === "nights") {
        renderHotelInputs();
      } else {
        calculate();
      }
    }
  });

  // Khusus untuk checkbox destinasi
  document.body.addEventListener("change", (e) => {
    if (e.target.classList.contains("dest-check")) {
      calculate();
    }
  });
});
