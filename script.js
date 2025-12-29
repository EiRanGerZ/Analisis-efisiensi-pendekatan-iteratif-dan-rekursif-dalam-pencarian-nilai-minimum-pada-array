 /* ================================
           VARIABEL GLOBAL
    ================================ */
        
        // Array original yang di-generate
        let originalArray = [];
        
        // Array untuk iteratif dan rekursif
        let iterArray = [];
        let recurArray = [];

        // Counter untuk iteratif (swap dan compare)
        let iterSwap = 0, iterCompare = 0, iterSortStart = 0;
        
        // Counter untuk rekursif (swap dan compare)
        let recurSwap = 0, recurCompare = 0, recurSortStart = 0;

        // Variabel untuk menyimpan hasil
        let iterSortTime = 0, recurSortTime = 0;
        let iterMin = null, iterMedian = null, iterExec = null;
        let recurMin = null, recurMedian = null, recurExec = null;

        // Flag untuk mengecek apakah sedang sorting
        let isSorting = false;
        
        // Metode yang sedang aktif (iterative/recursive/comparison)
        let currentMethod = 'iterative';
        
        // Flag untuk mengaktifkan/nonaktifkan visualisasi (dinonaktifkan jika array > 500)
        let enableVisualization = true;

        /* ================================
                    FUNGSI UTILITY
           ================================ */

        /**
         * Mendapatkan delay waktu berdasarkan kecepatan yang dipilih user
         * @returns {number} Delay dalam milliseconds
         */
        function getDelay() {
            const speed = document.getElementById('sortSpeed').value;
            if (speed === '6') return 0; // Mode instan tanpa delay
            const delays = {'1': 1000, '2': 500, '3': 200, '4': 100, '5': 50};
            return delays[speed];
        }

        /**
         * Fungsi untuk membuat delay/pause dalam eksekusi
         * @param {number} ms - Waktu delay dalam milliseconds
         * @returns {Promise} Promise yang resolve setelah delay
         */
        function sleep(ms) {
            if (ms === 0) return Promise.resolve(); // Jika delay 0, langsung resolve
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /* ================================
                FUNGSI GENERATE ARRAY
           ================================ */

        /**
         * Generate array random berdasarkan input user
         */
        function generateArray() {
            // Ambil ukuran array dari input
            const size = parseInt(document.getElementById('arraySize').value);
            
            // Validasi input
            if (isNaN(size) || size < 1) {
                alert('Masukkan jumlah elemen yang valid (minimal 1)');
                return;
            }

            // Generate array random dengan nilai 1-1000
            originalArray = [];
            for (let i = 0; i < size; i++) {
                originalArray.push(Math.floor(Math.random() * 1000) + 1);
            }

            // Nonaktifkan visualisasi untuk array besar (> 500 elemen)
            enableVisualization = size <= 500;

            // Copy array ke iterArray dan recurArray
            iterArray = [...originalArray];
            recurArray = [...originalArray];
            
            // Reset semua counter
            iterSwap = iterCompare = recurSwap = recurCompare = 0;
            iterMin = iterMedian = iterExec = recurMin = recurMedian = recurExec = null;
            
            // Tampilkan array original
            displayOriginalArray();
            
            // Tampilkan method selector dan enable tombol sorting
            document.getElementById('methodSelector').classList.remove('hidden');
            document.getElementById('iterBtn').disabled = false;
            document.getElementById('recurBtn').disabled = false;
            
            // Sembunyikan hasil sebelumnya
            document.getElementById('iterInfo').classList.add('hidden');
            document.getElementById('iterArrayDisplay').classList.add('hidden');
            document.getElementById('iterResults').classList.add('hidden');
            document.getElementById('recurInfo').classList.add('hidden');
            document.getElementById('recurArrayDisplay').classList.add('hidden');
            document.getElementById('recurResults').classList.add('hidden');
            document.getElementById('comparisonSection').classList.add('hidden');
        }

        /* ================================
                FUNGSI DISPLAY ARRAY
           ================================ */

        /**
         * Menampilkan array original di UI
         */
        function displayOriginalArray() {
            const container = document.getElementById('originalValues');
            const count = document.getElementById('arrayCount');
            count.textContent = originalArray.length;
            
            container.innerHTML = '';
            
            // Batasi tampilan untuk array besar (hanya 500 elemen pertama)
            const displayLimit = 500;
            const displayArray = originalArray.length > displayLimit 
                ? originalArray.slice(0, displayLimit) 
                : originalArray;
            
            // Buat div untuk setiap elemen array
            displayArray.forEach(value => {
                const item = document.createElement('div');
                item.className = 'array-item';
                item.textContent = value;
                container.appendChild(item);
            });

            // Tambahkan indikator jika ada elemen yang tidak ditampilkan
            if (originalArray.length > displayLimit) {
                const more = document.createElement('div');
                more.className = 'array-item';
                more.style.background = '#999';
                more.textContent = `... +${originalArray.length - displayLimit}`;
                container.appendChild(more);
            }

            document.getElementById('originalArray').classList.remove('hidden');
        }

        /**
         * Menampilkan array iteratif dengan highlight untuk animasi
         * @param {Array} highlightIndices - Index yang akan di-highlight
         * @param {string} className - Class CSS untuk styling (comparing/swapping/sorted)
         */
        function displayIterArray(highlightIndices = [], className = '') {
            if (!enableVisualization) return; // Skip jika visualisasi dinonaktifkan
            
            const container = document.getElementById('iterArrayValues');
            container.innerHTML = '';
            
            const displayLimit = 500;
            const displayArray = iterArray.length > displayLimit 
                ? iterArray.slice(0, displayLimit) 
                : iterArray;
            
            // Buat div untuk setiap elemen dengan highlight jika perlu
            displayArray.forEach((value, index) => {
                const item = document.createElement('div');
                item.className = 'array-item';
                // Tambahkan class highlight jika index ada di highlightIndices
                if (highlightIndices.includes(index)) {
                    item.classList.add(className);
                }
                item.textContent = value;
                container.appendChild(item);
            });

            document.getElementById('iterArrayDisplay').classList.remove('hidden');
        }

        /**
         * Menampilkan array rekursif dengan highlight untuk animasi
         * @param {Array} highlightIndices - Index yang akan di-highlight
         * @param {string} className - Class CSS untuk styling (comparing/swapping/sorted)
         */
        function displayRecurArray(highlightIndices = [], className = '') {
            if (!enableVisualization) return; // Skip jika visualisasi dinonaktifkan
            
            const container = document.getElementById('recurArrayValues');
            container.innerHTML = '';
            
            const displayLimit = 500;
            const displayArray = recurArray.length > displayLimit 
                ? recurArray.slice(0, displayLimit) 
                : recurArray;
            
            // Buat div untuk setiap elemen dengan highlight jika perlu
            displayArray.forEach((value, index) => {
                const item = document.createElement('div');
                item.className = 'array-item';
                // Tambahkan class highlight jika index ada di highlightIndices
                if (highlightIndices.includes(index)) {
                    item.classList.add(className);
                }
                item.textContent = value;
                container.appendChild(item);
            });

            document.getElementById('recurArrayDisplay').classList.remove('hidden');
        }

        /* ================================
           FUNGSI NAVIGASI METODE
           ================================ */

        /**
         * Menampilkan visualisasi metode tertentu (iterative/recursive)
         * @param {string} method - Metode yang dipilih
         */
        function showMethod(method) {
            currentMethod = method;
            
            // Update active state pada tombol
            document.querySelectorAll('.method-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Sembunyikan semua container
            document.getElementById('iterativeViz').classList.remove('active');
            document.getElementById('recursiveViz').classList.remove('active');
            document.getElementById('comparisonViz').classList.remove('active');
            
            // Tampilkan container yang dipilih
            if (method === 'iterative') {
                document.getElementById('iterativeViz').classList.add('active');
            } else if (method === 'recursive') {
                document.getElementById('recursiveViz').classList.add('active');
            }
        }

        /**
         * Menampilkan section perbandingan
         */
        function showComparison() {
            currentMethod = 'comparison';
            
            // Update active state pada tombol
            document.querySelectorAll('.method-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Sembunyikan container iteratif dan rekursif
            document.getElementById('iterativeViz').classList.remove('active');
            document.getElementById('recursiveViz').classList.remove('active');
            
            // Tampilkan container perbandingan
            document.getElementById('comparisonViz').classList.add('active');
            
            // Update data perbandingan
            updateComparison();
        }

        /**
         * Update data pada section perbandingan
         */
        function updateComparison() {
            // Update data iteratif jika sudah ada
            if (iterMin !== null) {
                document.getElementById('compIterSwap').textContent = iterSwap;
                document.getElementById('compIterCompare').textContent = iterCompare;
                document.getElementById('compIterSort').textContent = iterSortTime + 'ms';
                document.getElementById('compIterMin').textContent = iterMin;
                document.getElementById('compIterMedian').textContent = iterMedian;
            }
            
            // Update data rekursif jika sudah ada
            if (recurMin !== null) {
                document.getElementById('compRecurSwap').textContent = recurSwap;
                document.getElementById('compRecurCompare').textContent = recurCompare;
                document.getElementById('compRecurSort').textContent = recurSortTime + 'ms';
                document.getElementById('compRecurMin').textContent = recurMin;
                document.getElementById('compRecurMedian').textContent = recurMedian;
            }
            
            // Tampilkan section perbandingan jika minimal satu metode sudah dijalankan
            if (iterMin !== null || recurMin !== null) {
                document.getElementById('comparisonSection').classList.remove('hidden');
            }
        }

        /* ================================
           SORTING ITERATIF
           ================================ */

        /**
         * Memulai proses sorting iteratif
         */
        async function startIterativeSorting() {
            if (isSorting) return; // Cegah double execution
            isSorting = true;
            
            // Reset array dan counter
            iterArray = [...originalArray];
            iterSwap = iterCompare = 0;
            iterSortStart = Date.now();
            
            // Disable tombol dan tampilkan info
            document.getElementById('iterBtn').disabled = true;
            document.getElementById('iterInfo').classList.remove('hidden');
            
            // Update nama metode
            const method = document.getElementById('sortMethod').value;
            document.getElementById('iterMethodName').textContent = method.toUpperCase();
            document.getElementById('iterStatus').textContent = 'Berjalan...';
            
            // Update info awal
            updateIterInfo();
            if (enableVisualization) displayIterArray();
            
            try {
                // Jalankan sorting sesuai metode yang dipilih
                if (method === 'selection') {
                    await selectionSortIter();
                } else {
                    await insertionSortIter();
                }
                
                // Hitung waktu total dan update status
                iterSortTime = Date.now() - iterSortStart;
                document.getElementById('iterStatus').textContent = 'Selesai ✓';
                updateIterInfo();
                
                // Hitung hasil akhir (min dan median)
                await calculateIterResults();
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi error saat sorting iteratif');
            }
            
            // Enable kembali tombol
            isSorting = false;
            document.getElementById('iterBtn').disabled = false;
        }

        /**
         * Update informasi statistik iteratif di UI
         */
        function updateIterInfo() {
            document.getElementById('iterSwapCount').textContent = iterSwap;
            document.getElementById('iterCompareCount').textContent = iterCompare;
            document.getElementById('iterSortTime').textContent = (Date.now() - iterSortStart) + 'ms';
        }

        /* ================================
           SELECTION SORT ITERATIF
           ================================ */

        /**
         * Selection Sort - Versi Iteratif
         * Algoritma: Cari elemen terkecil, tukar dengan elemen pertama yang belum tersortir
         */
        async function selectionSortIter() {
            const n = iterArray.length;
            const delay = getDelay();
            const updateInterval = 10000; // Update UI setiap 10000 iterasi untuk mode instan
            
            // Loop untuk setiap posisi array
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i; // Anggap elemen i adalah yang terkecil
                
                // Cari elemen terkecil di sisa array
                for (let j = i + 1; j < n; j++) {
                    iterCompare++; // Increment counter perbandingan
                    
                    // Update UI jika ada delay atau setiap interval tertentu
                    if (delay > 0) {
                        updateIterInfo();
                        displayIterArray([minIdx, j], 'comparing'); // Highlight elemen yang dibandingkan
                        await sleep(delay);
                    } else if (iterCompare % updateInterval === 0) {
                        updateIterInfo();
                        await sleep(1); // Yield ke event loop agar UI tidak freeze
                    }
                    
                    // Update minIdx jika menemukan elemen yang lebih kecil
                    if (iterArray[j] < iterArray[minIdx]) {
                        minIdx = j;
                    }
                }
                
                // Tukar elemen terkecil dengan elemen posisi i
                if (minIdx !== i) {
                    [iterArray[i], iterArray[minIdx]] = [iterArray[minIdx], iterArray[i]];
                    iterSwap++; // Increment counter swap
                    
                    // Update UI dengan animasi swap
                    if (delay > 0) {
                        updateIterInfo();
                        displayIterArray([i, minIdx], 'swapping'); // Highlight elemen yang di-swap
                        await sleep(delay);
                    } else if (iterSwap % (updateInterval / 10) === 0) {
                        updateIterInfo();
                        await sleep(1);
                    }
                }
            }
            
            // Update info terakhir dan tampilkan array tersortir
            updateIterInfo();
            if (enableVisualization) {
                displayIterArray(Array.from({length: Math.min(n, 500)}, (_, i) => i), 'sorted');
            }
        }

        /* ================================
           INSERTION SORT ITERATIF
           ================================ */

        /**
         * Insertion Sort - Versi Iteratif
         * Algoritma: Ambil elemen, sisipkan ke posisi yang benar di bagian yang sudah tersortir
         */
        async function insertionSortIter() {
            const n = iterArray.length;
            const delay = getDelay();
            const updateInterval = 10000;
            
            // Mulai dari elemen kedua (index 1)
            for (let i = 1; i < n; i++) {
                let key = iterArray[i]; // Simpan elemen yang akan disisipkan
                let j = i - 1;
                
                // Tampilkan elemen yang sedang diproses
                if (delay > 0) {
                    displayIterArray([i], 'comparing');
                    await sleep(delay);
                }
                
                // Geser elemen yang lebih besar dari key ke kanan
                while (j >= 0 && iterArray[j] > key) {
                    iterCompare++; // Increment counter perbandingan
                    iterArray[j + 1] = iterArray[j]; // Geser elemen ke kanan
                    iterSwap++; // Increment counter swap
                    
                    // Update UI dengan animasi
                    if (delay > 0) {
                        updateIterInfo();
                        displayIterArray([j, j + 1], 'swapping');
                        await sleep(delay);
                    } else if (iterSwap % updateInterval === 0) {
                        updateIterInfo();
                        await sleep(1);
                    }
                    j--;
                }
                // Sisipkan key di posisi yang benar
                iterArray[j + 1] = key;
            }
            
            // Update info terakhir dan tampilkan array tersortir
            updateIterInfo();
            if (enableVisualization) {
                displayIterArray(Array.from({length: Math.min(n, 500)}, (_, i) => i), 'sorted');
            }
        }

        /**
         * Menghitung hasil akhir iteratif (minimum dan median)
         */
        async function calculateIterResults() {
            const start = performance.now();
            
            // Cari nilai minimum
            iterMin = Math.min(...iterArray);
            
            // Hitung median
            const mid = Math.floor(iterArray.length / 2);
            iterMedian = iterArray.length % 2 === 0 
                ? ((iterArray[mid - 1] + iterArray[mid]) / 2).toFixed(2) // Rata-rata 2 nilai tengah jika genap
                : iterArray[mid]; // Nilai tengah jika ganjil
            
            const end = performance.now();
            iterExec = (end - start).toFixed(4); // Waktu eksekusi dalam ms
            
            // Update UI dengan hasil
            document.getElementById('iterMinValue').textContent = iterMin;
            document.getElementById('iterMedianValue').textContent = iterMedian;
            document.getElementById('iterExecTime').textContent = iterExec + ' ms';
            
            document.getElementById('iterResults').classList.remove('hidden');
        }

        /* ================================
           SORTING REKURSIF
           ================================ */

        /**
         * Memulai proses sorting rekursif
         */
        async function startRecursiveSorting() {
            if (isSorting) return; // Cegah double execution
            isSorting = true;
            
            // Reset array dan counter
            recurArray = [...originalArray];
            recurSwap = recurCompare = 0;
            recurSortStart = Date.now();
            
            // Disable tombol dan tampilkan info
            document.getElementById('recurBtn').disabled = true;
            document.getElementById('recurInfo').classList.remove('hidden');
            
            // Update nama metode
            const method = document.getElementById('sortMethod').value;
            document.getElementById('recurMethodName').textContent = method.toUpperCase();
            document.getElementById('recurStatus').textContent = 'Berjalan...';
            
            // Update info awal
            updateRecurInfo();
            if (enableVisualization) displayRecurArray();
            
            try {
                // Jalankan sorting sesuai metode yang dipilih
                if (method === 'selection') {
                    await selectionSortRecur(0);
                } else {
                    await insertionSortRecur(1);
                }
                
                // Hitung waktu total dan update status
                recurSortTime = Date.now() - recurSortStart;
                document.getElementById('recurStatus').textContent = 'Selesai ✓';
                updateRecurInfo();
                
                // Hitung hasil akhir (min dan median)
                await calculateRecurResults();
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi error saat sorting rekursif');
            }
            
            // Enable kembali tombol
            isSorting = false;
            document.getElementById('recurBtn').disabled = false;
        }

        /**
         * Update informasi statistik rekursif di UI
         */
        function updateRecurInfo() {
            document.getElementById('recurSwapCount').textContent = recurSwap;
            document.getElementById('recurCompareCount').textContent = recurCompare;
            document.getElementById('recurSortTime').textContent = (Date.now() - recurSortStart) + 'ms';
        }

        /* ================================
           SELECTION SORT REKURSIF
           ================================ */

        /**
         * Selection Sort - Versi Rekursif
         * @param {number} i - Index awal untuk sorting
         */
        async function selectionSortRecur(i) {
            const n = recurArray.length;
            const delay = getDelay();
            const updateInterval = 10000;
            
            // Base case: jika sudah sampai akhir array
            if (i >= n - 1) {
                if (enableVisualization) {
                    displayRecurArray(Array.from({length: Math.min(n, 500)}, (_, idx) => idx), 'sorted');
                }
                return;
            }
            
            // Cari index minimum di sisa array (rekursif)
            let minIdx = await findMinIndexRecur(i, i + 1, i);
            
            // Tukar jika perlu
            if (minIdx !== i) {
                [recurArray[i], recurArray[minIdx]] = [recurArray[minIdx], recurArray[i]];
                recurSwap++;
                
                // Update UI dengan animasi
                if (delay > 0) {
                    updateRecurInfo();
                    displayRecurArray([i, minIdx], 'swapping');
                    await sleep(delay);
                } else if (recurSwap % (updateInterval / 10) === 0) {
                    updateRecurInfo();
                    await sleep(1);
                }
            }
            
            // Recursive call: lanjut ke elemen berikutnya
            return await selectionSortRecur(i + 1);
        }

        /**
         * Fungsi helper rekursif untuk mencari index minimum
         * @param {number} start - Index awal pencarian
         * @param {number} j - Index saat ini yang diperiksa
         * @param {number} minIdx - Index minimum sementara
         * @returns {number} Index dari elemen minimum
         */
        async function findMinIndexRecur(start, j, minIdx) {
            const n = recurArray.length;
            const delay = getDelay();
            const updateInterval = 10000;
            
            // Base case: sudah sampai akhir array
            if (j >= n) return minIdx;
            
            recurCompare++; // Increment counter perbandingan
            
            // Update UI
            if (delay > 0) {
                updateRecurInfo();
                displayRecurArray([minIdx, j], 'comparing');
                await sleep(delay);
            } else if (recurCompare % updateInterval === 0) {
                updateRecurInfo();
                await sleep(1);
            }
            
            // Update minIdx jika menemukan elemen lebih kecil
            if (recurArray[j] < recurArray[minIdx]) {
                minIdx = j;
            }
            
            // Recursive call: lanjut ke elemen berikutnya
            return await findMinIndexRecur(start, j + 1, minIdx);
        }

        /* ================================
           INSERTION SORT REKURSIF
           ================================ */

        /**
         * Insertion Sort - Versi Rekursif
         * @param {number} i - Index elemen yang akan disisipkan
         */
        async function insertionSortRecur(i) {
            const n = recurArray.length;
            const delay = getDelay();
            const updateInterval = 10000;
            
            // Base case: sudah sampai akhir array
            if (i >= n) {
                if (enableVisualization) {
                    displayRecurArray(Array.from({length: Math.min(n, 500)}, (_, idx) => idx), 'sorted');
                }
                return;
            }
            
            let key = recurArray[i]; // Simpan elemen yang akan disisipkan
            let j = i - 1;
            
            // Tampilkan elemen yang sedang diproses
            if (delay > 0) {
                displayRecurArray([i], 'comparing');
                await sleep(delay);
            }
            
            // Geser elemen yang lebih besar dari key ke kanan
            while (j >= 0 && recurArray[j] > key) {
                recurCompare++;
                recurArray[j + 1] = recurArray[j];
                recurSwap++;
                
                // Update UI dengan animasi
                if (delay > 0) {
                    updateRecurInfo();
                    displayRecurArray([j, j + 1], 'swapping');
                    await sleep(delay);
                } else if (recurSwap % updateInterval === 0) {
                    updateRecurInfo();
                    await sleep(1);
                }
                j--;
            }
            // Sisipkan key di posisi yang benar
            recurArray[j + 1] = key;
            
            // Recursive call: lanjut ke elemen berikutnya
            return await insertionSortRecur(i + 1);
        }

        /**
         * Menghitung hasil akhir rekursif (minimum dan median)
         */
        async function calculateRecurResults() {
            const start = performance.now();
            
            // Cari nilai minimum
            recurMin = Math.min(...recurArray);
            
            // Hitung median
            const mid = Math.floor(recurArray.length / 2);
            recurMedian = recurArray.length % 2 === 0 
                ? ((recurArray[mid - 1] + recurArray[mid]) / 2).toFixed(2) // Rata-rata 2 nilai tengah jika genap
                : recurArray[mid]; // Nilai tengah jika ganjil
            
            const end = performance.now();
            recurExec = (end - start).toFixed(4); // Waktu eksekusi dalam ms
            
            // Update UI dengan hasil
            document.getElementById('recurMinValue').textContent = recurMin;
            document.getElementById('recurMedianValue').textContent = recurMedian;
            document.getElementById('recurExecTime').textContent = recurExec + ' ms';
            
            document.getElementById('recurResults').classList.remove('hidden');
        }

        /* ================================
           EVENT LISTENERS
           ================================ */

        /**
         * Event listener saat halaman selesai dimuat
         */
        document.addEventListener('DOMContentLoaded', function() {
            // Tambahkan event listener untuk Enter key pada input array size
            document.getElementById('arraySize').addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    generateArray(); // Generate array saat Enter ditekan
                }
            });
        });