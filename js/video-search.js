// js/video-search.js

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayerContainer = document.querySelector('.video-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const initialPlayerMessage = document.querySelector('.initial-player-message'); // Ambil pesan awal

    // --- GANTI DENGAN URL GOOGLE SHEET JSON ANDA YANG SEBENARNYA ---
    // Pastikan URL ini diakhiri dengan 'output=json'
    const GOOGLE_SHEET_JSON_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeSTPSNbrSSzzM6JqPARGhcBeeg0rLy05lQnP6qjNsNX5cFH9vxo2p036HzZvNfyqYhJfEJUCT8Ca3/pub?gid=0&single=true&output=json';
    // ------------------------------------------------------------------

    let videoPlaylist = []; // Playlist akan diisi dari Google Sheet

    // Fungsi untuk memuat video ke player
    function loadVideoIntoPlayer(videoUrl) {
        if (!videoUrl) {
            videoPlayerContainer.innerHTML = '<p class="no-results">URL video tidak valid.</p>';
            return;
        }

        // Hapus pesan awal jika ada
        if (initialPlayerMessage) {
            initialPlayerMessage.style.display = 'none';
        }
        // Hapus iframe yang ada jika ada
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
        searchResultsContainer.innerHTML = ''; // Kosongkan hasil sebelumnya

        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p class="no-results">Tidak ada video ditemukan.</p>';
            return;
        }

        results.forEach(video => {
            const resultItem = document.createElement('a');
            resultItem.href = '#';
            resultItem.classList.add('search-result-item');
            resultItem.dataset.videoId = video.id; // Menyimpan ID video di data attribute
            resultItem.textContent = video.title;

            resultItem.addEventListener('click', function(event) {
                event.preventDefault(); // Mencegah link dari memuat ulang halaman
                const selectedVideoId = this.dataset.videoId;
                const selectedVideo = videoPlaylist.find(v => v.id === selectedVideoId);

                if (selectedVideo) {
                    loadVideoIntoPlayer(selectedVideo.url);

                    // Tandai video yang sedang aktif
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
        const searchTerm = searchInput.value.toLowerCase().trim(); // Ambil input dan ubah ke huruf kecil
        let filteredVideos = [];

        if (searchTerm.length > 0) {
            filteredVideos = videoPlaylist.filter(video =>
                video.title.toLowerCase().includes(searchTerm) // Cari judul yang mengandung searchTerm
            );
        } else {
            // Jika input pencarian kosong, tampilkan semua video
            filteredVideos = [...videoPlaylist]; // Buat salinan agar tidak memodifikasi array asli
        }
        displaySearchResults(filteredVideos);
    }

    // Fungsi untuk mengambil data dari Google Sheet
    async function fetchVideoDataFromGoogleSheet() {
        try {
            const response = await fetch(GOOGLE_SHEET_JSON_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Memparsing data dari format JSON Google Sheet
            // Pastikan nama kolom di sheet Anda (misal: ID, Title, URL) sesuai dengan gsx$namakolom.$t
            videoPlaylist = data.feed.entry.map(entry => ({
                id: entry.gsx$id.$t,       // 'id' adalah nama kolom di sheet Anda
                title: entry.gsx$title.$t, // 'title' adalah nama kolom di sheet Anda
                url: entry.gsx$url.$t      // 'url' adalah nama kolom di sheet Anda
            }));

            console.log('Video data loaded:', videoPlaylist); // Untuk debugging
            handleSearch(); // Tampilkan semua video di hasil pencarian setelah data dimuat
        } catch (error) {
            console.error('Gagal mengambil atau memparsing data dari Google Sheet:', error);
            searchResultsContainer.innerHTML = '<p class="no-results" style="color: red;">Gagal memuat daftar video. Periksa koneksi atau URL Google Sheet Anda.</p>';
            searchInput.style.display = 'none'; // Sembunyikan input pencarian jika gagal
        }
    }

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', handleSearch); // Akan memicu pencarian setiap kali ada input

    // Panggil fungsi untuk mengambil data dari Google Sheet saat DOM sudah dimuat
    fetchVideoDataFromGoogleSheet();
});
