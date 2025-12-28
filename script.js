let originalArray = [];
      let iterArray = [];
      let recurArray = [];

      let iterSwap = 0,
        iterCompare = 0,
        iterSortStart = 0;
      let recurSwap = 0,
        recurCompare = 0,
        recurSortStart = 0;

      let iterSortTime = 0,
        recurSortTime = 0;
      let iterMin = null,
        iterMedian = null,
        iterExec = null;
      let recurMin = null,
        recurMedian = null,
        recurExec = null;

      let isSorting = false;
      let currentMethod = "iterative";
      let enableVisualization = true;

      function getDelay() {
        const speed = document.getElementById("sortSpeed").value;
        if (speed === "6") return 0;
        const delays = { 1: 1000, 2: 500, 3: 200, 4: 100, 5: 50 };
        return delays[speed];
      }

      function generateArray() {
        const size = parseInt(document.getElementById("arraySize").value);

        if (isNaN(size) || size < 1) {
          alert("Masukkan jumlah elemen yang valid (minimal 1)");
          return;
        }

        originalArray = [];
        for (let i = 0; i < size; i++) {
          originalArray.push(Math.floor(Math.random() * 1000) + 1);
        }

        enableVisualization = size <= 500;

        iterArray = [...originalArray];
        recurArray = [...originalArray];

        iterSwap = iterCompare = recurSwap = recurCompare = 0;
        iterMin =
          iterMedian =
          iterExec =
          recurMin =
          recurMedian =
          recurExec =
            null;

        displayOriginalArray();

        document.getElementById("methodSelector").classList.remove("hidden");
        document.getElementById("iterBtn").disabled = false;
        document.getElementById("recurBtn").disabled = false;

        document.getElementById("iterInfo").classList.add("hidden");
        document.getElementById("iterArrayDisplay").classList.add("hidden");
        document.getElementById("iterResults").classList.add("hidden");
        document.getElementById("recurInfo").classList.add("hidden");
        document.getElementById("recurArrayDisplay").classList.add("hidden");
        document.getElementById("recurResults").classList.add("hidden");
        document.getElementById("comparisonSection").classList.add("hidden");
      }

      function displayOriginalArray() {
        const container = document.getElementById("originalValues");
        const count = document.getElementById("arrayCount");
        count.textContent = originalArray.length;

        container.innerHTML = "";

        const displayLimit = 500;
        const displayArray =
          originalArray.length > displayLimit
            ? originalArray.slice(0, displayLimit)
            : originalArray;

        displayArray.forEach((value) => {
          const item = document.createElement("div");
          item.className = "array-item";
          item.textContent = value;
          container.appendChild(item);
        });

        if (originalArray.length > displayLimit) {
          const more = document.createElement("div");
          more.className = "array-item";
          more.style.background = "#999";
          more.textContent = `... +${originalArray.length - displayLimit}`;
          container.appendChild(more);
        }

        document.getElementById("originalArray").classList.remove("hidden");
      }

      function showMethod(method) {
        currentMethod = method;

        document.querySelectorAll(".method-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        event.target.classList.add("active");

        document.getElementById("iterativeViz").classList.remove("active");
        document.getElementById("recursiveViz").classList.remove("active");
        document.getElementById("comparisonViz").classList.remove("active");

        if (method === "iterative") {
          document.getElementById("iterativeViz").classList.add("active");
        } else if (method === "recursive") {
          document.getElementById("recursiveViz").classList.add("active");
        }
      }

      function showComparison() {
        currentMethod = "comparison";

        document.querySelectorAll(".method-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        event.target.classList.add("active");

        document.getElementById("iterativeViz").classList.remove("active");
        document.getElementById("recursiveViz").classList.remove("active");
        document.getElementById("comparisonViz").classList.add("active");

        updateComparison();
      }

      function updateComparison() {
        if (iterMin !== null) {
          document.getElementById("compIterSwap").textContent = iterSwap;
          document.getElementById("compIterCompare").textContent = iterCompare;
          document.getElementById("compIterSort").textContent =
            iterSortTime + "ms";
          document.getElementById("compIterMin").textContent = iterMin;
          document.getElementById("compIterMedian").textContent = iterMedian;
        }

        if (recurMin !== null) {
          document.getElementById("compRecurSwap").textContent = recurSwap;
          document.getElementById("compRecurCompare").textContent =
            recurCompare;
          document.getElementById("compRecurSort").textContent =
            recurSortTime + "ms";
          document.getElementById("compRecurMin").textContent = recurMin;
          document.getElementById("compRecurMedian").textContent = recurMedian;
        }

        if (iterMin !== null || recurMin !== null) {
          document
            .getElementById("comparisonSection")
            .classList.remove("hidden");
        }
      }

      function displayIterArray(highlightIndices = [], className = "") {
        if (!enableVisualization) return;

        const container = document.getElementById("iterArrayValues");
        container.innerHTML = "";

        const displayLimit = 500;
        const displayArray =
          iterArray.length > displayLimit
            ? iterArray.slice(0, displayLimit)
            : iterArray;

        displayArray.forEach((value, index) => {
          const item = document.createElement("div");
          item.className = "array-item";
          if (highlightIndices.includes(index)) {
            item.classList.add(className);
          }
          item.textContent = value;
          container.appendChild(item);
        });

        document.getElementById("iterArrayDisplay").classList.remove("hidden");
      }

      function displayRecurArray(highlightIndices = [], className = "") {
        if (!enableVisualization) return;

        const container = document.getElementById("recurArrayValues");
        container.innerHTML = "";

        const displayLimit = 500;
        const displayArray =
          recurArray.length > displayLimit
            ? recurArray.slice(0, displayLimit)
            : recurArray;

        displayArray.forEach((value, index) => {
          const item = document.createElement("div");
          item.className = "array-item";
          if (highlightIndices.includes(index)) {
            item.classList.add(className);
          }
          item.textContent = value;
          container.appendChild(item);
        });

        document.getElementById("recurArrayDisplay").classList.remove("hidden");
      }

      function sleep(ms) {
        if (ms === 0) return Promise.resolve();
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function startIterativeSorting() {
        if (isSorting) return;
        isSorting = true;

        iterArray = [...originalArray];
        iterSwap = iterCompare = 0;
        iterSortStart = Date.now();

        document.getElementById("iterBtn").disabled = true;
        document.getElementById("iterInfo").classList.remove("hidden");

        const method = document.getElementById("sortMethod").value;
        document.getElementById("iterMethodName").textContent =
          method.toUpperCase();
        document.getElementById("iterStatus").textContent = "Berjalan...";

        updateIterInfo();
        if (enableVisualization) displayIterArray();

        try {
          if (method === "selection") {
            await selectionSortIter();
          } else {
            await insertionSortIter();
          }

          iterSortTime = Date.now() - iterSortStart;
          document.getElementById("iterStatus").textContent = "Selesai ✓";
          updateIterInfo();

          await calculateIterResults();
        } catch (error) {
          console.error("Error:", error);
          alert("Terjadi error saat sorting iteratif");
        }

        isSorting = false;
        document.getElementById("iterBtn").disabled = false;
      }

      function updateIterInfo() {
        document.getElementById("iterSwapCount").textContent = iterSwap;
        document.getElementById("iterCompareCount").textContent = iterCompare;
        document.getElementById("iterSortTime").textContent =
          Date.now() - iterSortStart + "ms";
      }

      async function selectionSortIter() {
        const n = iterArray.length;
        const delay = getDelay();
        const updateInterval = 10000;

        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;

          for (let j = i + 1; j < n; j++) {
            iterCompare++;

            if (delay > 0) {
              updateIterInfo();
              displayIterArray([minIdx, j], "comparing");
              await sleep(delay);
            } else if (iterCompare % updateInterval === 0) {
              updateIterInfo();
              await sleep(1);
            }

            if (iterArray[j] < iterArray[minIdx]) {
              minIdx = j;
            }
          }

          if (minIdx !== i) {
            [iterArray[i], iterArray[minIdx]] = [
              iterArray[minIdx],
              iterArray[i],
            ];
            iterSwap++;

            if (delay > 0) {
              updateIterInfo();
              displayIterArray([i, minIdx], "swapping");
              await sleep(delay);
            } else if (iterSwap % (updateInterval / 10) === 0) {
              updateIterInfo();
              await sleep(1);
            }
          }
        }

        updateIterInfo();
        if (enableVisualization) {
          displayIterArray(
            Array.from({ length: Math.min(n, 500) }, (_, i) => i),
            "sorted"
          );
        }
      }

      async function insertionSortIter() {
        const n = iterArray.length;
        const delay = getDelay();
        const updateInterval = 10000;

        for (let i = 1; i < n; i++) {
          let key = iterArray[i];
          let j = i - 1;

          if (delay > 0) {
            displayIterArray([i], "comparing");
            await sleep(delay);
          }

          while (j >= 0 && iterArray[j] > key) {
            iterCompare++;
            iterArray[j + 1] = iterArray[j];
            iterSwap++;

            if (delay > 0) {
              updateIterInfo();
              displayIterArray([j, j + 1], "swapping");
              await sleep(delay);
            } else if (iterSwap % updateInterval === 0) {
              updateIterInfo();
              await sleep(1);
            }
            j--;
          }
          iterArray[j + 1] = key;
        }

        updateIterInfo();
        if (enableVisualization) {
          displayIterArray(
            Array.from({ length: Math.min(n, 500) }, (_, i) => i),
            "sorted"
          );
        }
      }

      async function calculateIterResults() {
        const start = performance.now();
        iterMin = Math.min(...iterArray);
        const mid = Math.floor(iterArray.length / 2);
        iterMedian =
          iterArray.length % 2 === 0
            ? ((iterArray[mid - 1] + iterArray[mid]) / 2).toFixed(2)
            : iterArray[mid];
        const end = performance.now();
        iterExec = (end - start).toFixed(4);

        document.getElementById("iterMinValue").textContent = iterMin;
        document.getElementById("iterMedianValue").textContent = iterMedian;
        document.getElementById("iterExecTime").textContent = iterExec + " ms";

        document.getElementById("iterResults").classList.remove("hidden");
      }

      async function startRecursiveSorting() {
        if (isSorting) return;
        isSorting = true;

        recurArray = [...originalArray];
        recurSwap = recurCompare = 0;
        recurSortStart = Date.now();

        document.getElementById("recurBtn").disabled = true;
        document.getElementById("recurInfo").classList.remove("hidden");

        const method = document.getElementById("sortMethod").value;
        document.getElementById("recurMethodName").textContent =
          method.toUpperCase();
        document.getElementById("recurStatus").textContent = "Berjalan...";

        updateRecurInfo();
        if (enableVisualization) displayRecurArray();

        try {
          if (method === "selection") {
            await selectionSortRecur(0);
          } else {
            await insertionSortRecur(1);
          }

          recurSortTime = Date.now() - recurSortStart;
          document.getElementById("recurStatus").textContent = "Selesai ✓";
          updateRecurInfo();

          await calculateRecurResults();
        } catch (error) {
          console.error("Error:", error);
          alert("Terjadi error saat sorting rekursif");
        }

        isSorting = false;
        document.getElementById("recurBtn").disabled = false;
      }

      function updateRecurInfo() {
        document.getElementById("recurSwapCount").textContent = recurSwap;
        document.getElementById("recurCompareCount").textContent = recurCompare;
        document.getElementById("recurSortTime").textContent =
          Date.now() - recurSortStart + "ms";
      }

      async function selectionSortRecur(i) {
        const n = recurArray.length;
        const delay = getDelay();
        const updateInterval = 10000;

        if (i >= n - 1) {
          if (enableVisualization) {
            displayRecurArray(
              Array.from({ length: Math.min(n, 500) }, (_, idx) => idx),
              "sorted"
            );
          }
          return;
        }

        let minIdx = await findMinIndexRecur(i, i + 1, i);

        if (minIdx !== i) {
          [recurArray[i], recurArray[minIdx]] = [
            recurArray[minIdx],
            recurArray[i],
          ];
          recurSwap++;

          if (delay > 0) {
            updateRecurInfo();
            displayRecurArray([i, minIdx], "swapping");
            await sleep(delay);
          } else if (recurSwap % (updateInterval / 10) === 0) {
            updateRecurInfo();
            await sleep(1);
          }
        }

        return await selectionSortRecur(i + 1);
      }

      async function findMinIndexRecur(start, j, minIdx) {
        const n = recurArray.length;
        const delay = getDelay();
        const updateInterval = 10000;

        if (j >= n) return minIdx;

        recurCompare++;

        if (delay > 0) {
          updateRecurInfo();
          displayRecurArray([minIdx, j], "comparing");
          await sleep(delay);
        } else if (recurCompare % updateInterval === 0) {
          updateRecurInfo();
          await sleep(1);
        }

        if (recurArray[j] < recurArray[minIdx]) {
          minIdx = j;
        }

        return await findMinIndexRecur(start, j + 1, minIdx);
      }

      async function insertionSortRecur(i) {
        const n = recurArray.length;
        const delay = getDelay();
        const updateInterval = 10000;

        if (i >= n) {
          if (enableVisualization) {
            displayRecurArray(
              Array.from({ length: Math.min(n, 500) }, (_, idx) => idx),
              "sorted"
            );
          }
          return;
        }

        let key = recurArray[i];
        let j = i - 1;

        if (delay > 0) {
          displayRecurArray([i], "comparing");
          await sleep(delay);
        }

        while (j >= 0 && recurArray[j] > key) {
          recurCompare++;
          recurArray[j + 1] = recurArray[j];
          recurSwap++;

          if (delay > 0) {
            updateRecurInfo();
            displayRecurArray([j, j + 1], "swapping");
            await sleep(delay);
          } else if (recurSwap % updateInterval === 0) {
            updateRecurInfo();
            await sleep(1);
          }
          j--;
        }
        recurArray[j + 1] = key;

        return await insertionSortRecur(i + 1);
      }

      async function calculateRecurResults() {
        const start = performance.now();
        recurMin = Math.min(...recurArray);
        const mid = Math.floor(recurArray.length / 2);
        recurMedian =
          recurArray.length % 2 === 0
            ? ((recurArray[mid - 1] + recurArray[mid]) / 2).toFixed(2)
            : recurArray[mid];
        const end = performance.now();
        recurExec = (end - start).toFixed(4);

        document.getElementById("recurMinValue").textContent = recurMin;
        document.getElementById("recurMedianValue").textContent = recurMedian;
        document.getElementById("recurExecTime").textContent =
          recurExec + " ms";

        document.getElementById("recurResults").classList.remove("hidden");
      }

      document.addEventListener("DOMContentLoaded", function () {
        document
          .getElementById("arraySize")
          .addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
              generateArray();
            }
          });
      });