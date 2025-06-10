// js/video-search.js

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayerContainer = document.querySelector('.video-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const initialPlayerMessage = document.querySelector('.initial-player-message');

    // --- GANTI DENGAN URL GOOGLE SHEET CSV ANDA YANG SUDAH DIPUBLIKASIKAN ---
    // Pastikan URL ini diakhiri dengan 'output=csv'
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeSTPSNbrSSzzM6JqPARGhcBeeg0rLy05lQnP6qjNsNX5cFH9vxo2p036HzZvNfyqYhJfEJUCT8Ca3/pub?gid=0&single=true&output=csv';
    // ----------------------------------------------------------------------

    let videoPlaylist = []; // Playlist akan diisi dari Google Sheet

    // Fungsi untuk memuat video ke player
    function loadVideoIntoPlayer(videoUrl) {
        if (!videoUrl) {
            videoPlayerContainer.innerHTML = '<p class="no-results">URL video tidak valid.</p>';
            return;
        }

        if (initialPlayerMessage) {
            initialPlayerMessage.style.display = 'none';
        }
        videoPlayerContainer.querySelector('iframe')?.remove();

        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy'); // Fitur lazy load

        videoPlayerContainer.appendChild(iframe);
    }

    // Fungsi untuk menampilkan hasil pencarian
    function displaySearchResults(results) {
        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p class="no-results">Tidak ada video ditemukan.</p>';
            return;
        }

        results.forEach(video => {
            const resultItem = document.createElement('a');
            resultItem.href = '#';
            resultItem.classList.add('search-result-item');
            resultItem.dataset.videoId = video.id;
            resultItem.textContent = video.title;

            resultItem.addEventListener('click', function(event) {
                event.preventDefault();
                const selectedVideoId = this.dataset.videoId;
                const selectedVideo = videoPlaylist.find(v => v.id === selectedVideoId);

                if (selectedVideo) {
                    loadVideoIntoPlayer(selectedVideo.url);

                    const currentActive = document.querySelector('.search-result-item.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    this.classList.add('active');
                }
            });
            searchResultsContainer.appendChild(resultItem);
        });
    }

    // Fungsi untuk menangani pencarian
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filteredVideos = [];

        if (searchTerm.length > 0) {
            filteredVideos = videoPlaylist.filter(video =>
                video.title.toLowerCase().includes(searchTerm)
            );
        } else {
            // Jika input pencarian kosong, tampilkan semua video
            filteredVideos = [...videoPlaylist];
        }
        displaySearchResults(filteredVideos);
    }

    // --- Fungsi untuk mengambil dan memparsing data dari Google Sheet (CSV) ---
    async function fetchVideoDataFromGoogleSheetCSV() {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();

            // Memparsing CSV secara manual
            // Pisahkan baris
            const rows = csvText.split('\n');
            // Ambil header dari baris pertama (trim untuk spasi ekstra)
            const headers = rows[0].split(',').map(header => header.trim());

            // Pastikan header yang diharapkan ada
            const idIndex = headers.indexOf('ID');
            const titleIndex = headers.indexOf('Title');
            const urlIndex = headers.indexOf('URL');

            if (idIndex === -1 || titleIndex === -1 || urlIndex === -1) {
                throw new Error('Header kolom (ID, Title, URL) tidak ditemukan di Google Sheet CSV.');
            }

            videoPlaylist = [];
            // Iterasi mulai dari baris kedua (indeks 1) karena baris pertama adalah header
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (row === '') continue; // Lewati baris kosong

                const columns = row.split(',').map(col => col.trim());

                // Pastikan ada cukup kolom untuk diurai
                if (columns.length > Math.max(idIndex, titleIndex, urlIndex)) {
                    videoPlaylist.push({
                        id: columns[idIndex],
                        title: columns[titleIndex],
                        url: columns[urlIndex]
                    });
                }
            }

            console.log('Video data loaded (CSV):', videoPlaylist);
            handleSearch(); // Tampilkan semua video di hasil pencarian setelah data dimuat
        } catch (error) {
            console.error('Gagal mengambil atau memparsing data dari Google Sheet CSV:', error);
            searchResultsContainer.innerHTML = '<p class="no-results" style="color: red;">Gagal memuat daftar video. Periksa koneksi, URL Google Sheet CSV, atau format kolom.</p>';
            searchInput.style.display = 'none';
        }
    }

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', handleSearch);

    // Panggil fungsi untuk mengambil data dari Google Sheet (CSV) saat DOM sudah dimuat
    fetchVideoDataFromGoogleSheetCSV();
});
