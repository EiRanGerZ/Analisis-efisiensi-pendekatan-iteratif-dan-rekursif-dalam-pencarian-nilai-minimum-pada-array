// =====================================
// VARIABEL GLOBAL
// =====================================
let originalArray = [];
let iterArray = [];
let recurArray = [];
let enableVisualization = true;
let isSorting = false;

// Variabel untuk tracking statistik iteratif
let iterSwap = 0;
let iterCompare = 0;
let iterSortTime = 0;

// Variabel untuk tracking statistik rekursif
let recurSwap = 0;
let recurCompare = 0;
let recurSortTime = 0;

// =====================================
// FUNGSI UTAMA
// =====================================

// Generate array dengan nilai acak dari 1 sampai size (supaya median bisa besar)
function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  if (size < 1) {
    alert("Ukuran array harus minimal 1!");
    return;
  }

  if (size > 10000) {
    if (
      !confirm(
        `Ukuran array ${size} mungkin lambat atau crash browser. Lanjutkan?`
      )
    ) {
      return;
    }
  }

  // Generate angka random antara 1 sampai size
  originalArray = Array.from({ length: size }, () =>
    Math.floor(Math.random() * size) + 1
  );

  iterArray = [...originalArray];
  recurArray = [...originalArray];

  resetStats();

  document.getElementById("originalArray").classList.remove("hidden");
  document.getElementById("arrayCount").textContent = size;
  displayOriginalArray();

  document.getElementById("methodSelector").classList.remove("hidden");

  document.getElementById("iterBtn").disabled = false;
  document.getElementById("recurBtn").disabled = false;

  hideResults();

  enableVisualization = size <= 500; // Nonaktifkan visual untuk array besar
}

function resetStats() {
  iterSwap = 0;
  iterCompare = 0;
  iterSortTime = 0;
  recurSwap = 0;
  recurCompare = 0;
  recurSortTime = 0;
}

function hideResults() {
  document.getElementById("iterResults").classList.add("hidden");
  document.getElementById("recurResults").classList.add("hidden");
  document.getElementById("comparisonSection").classList.add("hidden");
}

// =====================================
// FUNGSI TAMPILAN ARRAY (batasi render max 100 elemen)
// =====================================

function displayOriginalArray() {
  const container = document.getElementById("originalValues");
  container.innerHTML = "";

  const size = originalArray.length;
  const maxDisplay = 100;

  if (size > maxDisplay) {
    for (let i = 0; i < maxDisplay; i++) {
      const item = document.createElement("div");
      item.className = "array-item";
      item.textContent = originalArray[i];
      container.appendChild(item);
    }
    const remainingCount = size - maxDisplay;
    const moreItem = document.createElement("div");
    moreItem.className = "array-item more";
    moreItem.textContent = `... +${remainingCount}`;
    container.appendChild(moreItem);
  } else {
    originalArray.forEach(value => {
      const item = document.createElement("div");
      item.className = "array-item";
      item.textContent = value;
      container.appendChild(item);
    });
  }
}

function displayIterArray(highlightIndices = [], highlightType = "") {
  const container = document.getElementById("iterArrayValues");
  container.innerHTML = "";
  const maxDisplay = 100;
  const size = iterArray.length;

  if (size > maxDisplay) {
    for (let i = 0; i < maxDisplay; i++) {
      const item = document.createElement("div");
      item.className = "array-item";
      if (highlightIndices.includes(i)) item.classList.add(highlightType);
      item.textContent = iterArray[i];
      container.appendChild(item);
    }
    const remainingCount = size - maxDisplay;
    const moreItem = document.createElement("div");
    moreItem.className = "array-item more";
    moreItem.textContent = `... +${remainingCount}`;
    container.appendChild(moreItem);
  } else {
    iterArray.forEach((value, index) => {
      const item = document.createElement("div");
      item.className = "array-item";
      if (highlightIndices.includes(index)) item.classList.add(highlightType);
      item.textContent = value;
      container.appendChild(item);
    });
  }
  document.getElementById("iterArrayDisplay").classList.remove("hidden");
}

function displayRecurArray(highlightIndices = [], highlightType = "") {
  const container = document.getElementById("recurArrayValues");
  container.innerHTML = "";
  const maxDisplay = 100;
  const size = recurArray.length;

  if (size > maxDisplay) {
    for (let i = 0; i < maxDisplay; i++) {
      const item = document.createElement("div");
      item.className = "array-item";
      if (highlightIndices.includes(i)) item.classList.add(highlightType);
      item.textContent = recurArray[i];
      container.appendChild(item);
    }
    const remainingCount = size - maxDisplay;
    const moreItem = document.createElement("div");
    moreItem.className = "array-item more";
    moreItem.textContent = `... +${remainingCount}`;
    container.appendChild(moreItem);
  } else {
    recurArray.forEach((value, index) => {
      const item = document.createElement("div");
      item.className = "array-item";
      if (highlightIndices.includes(index)) item.classList.add(highlightType);
      item.textContent = value;
      container.appendChild(item);
    });
  }
  document.getElementById("recurArrayDisplay").classList.remove("hidden");
}

// =====================================
// FUNGSI SORTING CORE
// =====================================

// Insertion Sort Iteratif 
function insertionSortIterCore(array) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      iterCompare++;
      array[j + 1] = array[j];
      iterSwap++;
      j--;
    }
    array[j + 1] = key;
  }
}

// Insertion Sort Rekursif
function insertionSortRecurCore(array, i = 1) {
  const n = array.length;
  if (i >= n) return;

  let key = array[i];
  let j = i - 1;
  while (j >= 0 && array[j] > key) {
    recurCompare++;
    array[j + 1] = array[j];
    recurSwap++;
    j--;
  }
  array[j + 1] = key;

  insertionSortRecurCore(array, i + 1);
}

// =====================================
// FUNGSI ANIMASI (terpisah dari sorting)
// =====================================

// Animasi untuk Insertion Sort Iteratif
async function animateInsertionSortIter() {
  const n = iterArray.length;
  const delay = getDelay();
  const updateInterval = n > 500 ? 50 : 1;

  for (let i = 1; i < n; i++) {
    let key = iterArray[i];
    let j = i - 1;

    while (j >= 0 && iterArray[j] > key) {
      iterCompare++;
      iterArray[j + 1] = iterArray[j];
      iterSwap++;

      if (delay > 0 && ((i + j) % updateInterval === 0)) {
        updateIterInfo();
        displayIterArray([j, j + 1], "swapping");
        await sleep(delay);
      }
      j--;
    }
    iterArray[j + 1] = key;
  }

  if (enableVisualization) {
    displayIterArray(
      Array.from({ length: Math.min(n, 500) }, (_, idx) => idx),
      "sorted"
    );
  }
}

// Animasi untuk Insertion Sort Rekursif
async function animateInsertionSortRecur() {
  const n = recurArray.length;
  let iStack = [1];
  const delay = getDelay();
  const updateInterval = n > 500 ? 50 : 1;

  while (iStack.length > 0) {
    let i = iStack.pop();
    if (i >= n) continue;

    let key = recurArray[i];
    let j = i - 1;

    while (j >= 0 && recurArray[j] > key) {
      recurCompare++;
      recurArray[j + 1] = recurArray[j];
      recurSwap++;

      if (delay > 0 && (j % updateInterval === 0)) {
        updateRecurInfo();
        displayRecurArray([j, j + 1].filter(x => x >= 0 && x < n), "swapping");
        await sleep(delay);
      }
      j--;
    }
    recurArray[j + 1] = key;

    iStack.push(i + 1);
  }

  if (enableVisualization) {
    displayRecurArray(
      Array.from({ length: Math.min(n, 500) }, (_, idx) => idx),
      "sorted"
    );
  }
}

// =====================================
// FUNGSI MULAI SORTING
// =====================================

async function startIterativeSorting() {
  if (isSorting) {
    alert("Sorting sedang berjalan. Tunggu selesai atau klik ulang untuk restart.");
    return;
  }
  isSorting = true;

  iterArray = [...originalArray];
  iterSwap = 0;
  iterCompare = 0;
  iterSortTime = 0;

  document.getElementById("iterInfo").classList.remove("hidden");
  document.getElementById("iterStatus").textContent = "Berjalan...";
  updateIterInfo();

  if (enableVisualization) displayIterArray();

  const startTime = performance.now();
  if (enableVisualization) {
    await animateInsertionSortIter();
  } else {
    insertionSortIterCore(iterArray);
  }
  iterSortTime = performance.now() - startTime;

  const n = iterArray.length;
  const minValue = iterArray[0];
  const medianValue =
    n % 2 === 0
      ? (iterArray[n / 2 - 1] + iterArray[n / 2]) / 2
      : iterArray[Math.floor(n / 2)];

  document.getElementById("iterStatus").textContent = "Selesai";
  document.getElementById("iterMinValue").textContent = minValue;
  document.getElementById("iterMedianValue").textContent = medianValue;
  document.getElementById("iterExecTime").textContent = `${iterSortTime.toFixed(2)} ms`;
  document.getElementById("iterResults").classList.remove("hidden");

  updateIterInfo();
  isSorting = false;
}

async function startRecursiveSorting() {
  if (isSorting) {
    alert("Sorting sedang berjalan. Tunggu selesai atau klik ulang untuk restart.");
    return;
  }
  isSorting = true;

  recurArray = [...originalArray];
  recurSwap = 0;
  recurCompare = 0;
  recurSortTime = 0;

  document.getElementById("recurInfo").classList.remove("hidden");
  document.getElementById("recurStatus").textContent = "Berjalan...";
  updateRecurInfo();

  if (enableVisualization) displayRecurArray();

  const startTime = performance.now();
  if (enableVisualization) {
    await animateInsertionSortRecur();
  } else {
    insertionSortRecurCore(recurArray);
  }
  recurSortTime = performance.now() - startTime;

  const n = recurArray.length;
  const minValue = recurArray[0];
  const medianValue =
    n % 2 === 0
      ? (recurArray[n / 2 - 1] + recurArray[n / 2]) / 2
      : recurArray[Math.floor(n / 2)];

  document.getElementById("recurStatus").textContent = "Selesai";
  document.getElementById("recurMinValue").textContent = minValue;
  document.getElementById("recurMedianValue").textContent = medianValue;
  document.getElementById("recurExecTime").textContent = `${recurSortTime.toFixed(2)} ms`;
  document.getElementById("recurResults").classList.remove("hidden");

  updateRecurInfo();
  isSorting = false;
}

// =====================================
// UPDATE INFO
// =====================================

function updateIterInfo() {
  document.getElementById("iterSwapCount").textContent = iterSwap;
  document.getElementById("iterCompareCount").textContent = iterCompare;
  document.getElementById("iterSortTime").textContent = `${iterSortTime.toFixed(2)} ms`;
}

function updateRecurInfo() {
  document.getElementById("recurSwapCount").textContent = recurSwap;
  document.getElementById("recurCompareCount").textContent = recurCompare;
  document.getElementById("recurSortTime").textContent = `${recurSortTime.toFixed(2)} ms`;
}

// =====================================
// NAVIGASI METODE & PERBANDINGAN
// =====================================

function showMethod(method) {
  document.getElementById("iterativeViz").classList.remove("active");
  document.getElementById("recursiveViz").classList.remove("active");
  document.getElementById("comparisonViz").classList.remove("active");

  document.querySelectorAll(".method-btn").forEach(btn => btn.classList.remove("active"));

  if (method === "iterative") {
    document.getElementById("iterativeViz").classList.add("active");
    document.querySelector(".method-btn:nth-child(1)").classList.add("active");
  } else if (method === "recursive") {
    document.getElementById("recursiveViz").classList.add("active");
    document.querySelector(".method-btn:nth-child(2)").classList.add("active");
  }
}

function showComparison() {
  document.getElementById("iterativeViz").classList.remove("active");
  document.getElementById("recursiveViz").classList.remove("active");
  document.getElementById("comparisonViz").classList.add("active");

  document.querySelectorAll(".method-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(".method-btn:nth-child(3)").classList.add("active");

  document.getElementById("compIterSwap").textContent = iterSwap || "-";
  document.getElementById("compIterCompare").textContent = iterCompare || "-";
  document.getElementById("compIterSort").textContent = iterSortTime ? `${iterSortTime.toFixed(2)} ms` : "-";
  document.getElementById("compIterMin").textContent = iterArray.length ? iterArray[0] : "-";
  document.getElementById("compIterMedian").textContent = iterArray.length
    ? (iterArray.length % 2 === 0
      ? (iterArray[iterArray.length / 2 - 1] + iterArray[iterArray.length / 2]) / 2
      : iterArray[Math.floor(iterArray.length / 2)])
    : "-";

  document.getElementById("compRecurSwap").textContent = recurSwap || "-";
  document.getElementById("compRecurCompare").textContent = recurCompare || "-";
  document.getElementById("compRecurSort").textContent = recurSortTime ? `${recurSortTime.toFixed(2)} ms` : "-";
  document.getElementById("compRecurMin").textContent = recurArray.length ? recurArray[0] : "-";
  document.getElementById("compRecurMedian").textContent = recurArray.length
    ? (recurArray.length % 2 === 0
      ? (recurArray[recurArray.length / 2 - 1] + recurArray[recurArray.length / 2]) / 2
      : recurArray[Math.floor(recurArray.length / 2)])
    : "-";

  document.getElementById("comparisonSection").classList.remove("hidden");
}

// =====================================
// HELPER
// =====================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay() {
  const speed = document.getElementById("sortSpeed").value;
  switch (speed) {
    case "1": return 1000;
    case "2": return 500;
    case "3": return 200;
    case "4": return 100;
    case "5": return 50;
    case "6": return 0;
    default: return 200;
  }
}