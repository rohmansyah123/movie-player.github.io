// js/video-search.js

// Pastikan `videoPlaylist` dari video-data.js sudah tersedia

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayerContainer = document.querySelector('.video-container');
    const searchInput = document.getElementById('search-input'); // Input teks untuk pencarian
    const searchResultsContainer = document.getElementById('search-results'); // Kontainer untuk hasil pencarian

    // Fungsi untuk memuat video ke player
    function loadVideoIntoPlayer(videoUrl) {
        if (!videoUrl) {
            videoPlayerContainer.innerHTML = '<p style="color: red; text-align: center;">URL video tidak valid.</p>';
            return;
        }

        // Hapus iframe yang ada jika ada
        videoPlayerContainer.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allowfullscreen', '');

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
            resultItem.dataset.videoId = video.id;
            resultItem.textContent = video.title;

            resultItem.addEventListener('click', function(event) {
                event.preventDefault();
                const selectedVideoId = this.dataset.videoId;
                const selectedVideo = videoPlaylist.find(v => v.id === selectedVideoId);

                if (selectedVideo) {
                    loadVideoIntoPlayer(selectedVideo.url);

                    // Optional: Tandai video yang sedang aktif
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
        const searchTerm = searchInput.value.toLowerCase(); // Ambil input dan ubah ke huruf kecil
        let filteredVideos = [];

        if (searchTerm.length > 0) {
            filteredVideos = videoPlaylist.filter(video =>
                video.title.toLowerCase().includes(searchTerm) // Cari judul yang mengandung searchTerm
            );
        }
        // Jika input kosong, tampilkan semua video atau kosongkan hasil
        // Untuk saat ini, jika kosong, tidak menampilkan apa-apa kecuali ada hasil pencarian
        displaySearchResults(filteredVideos);
    }

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', handleSearch); // Akan memicu pencarian setiap kali ada input

    // Inisialisasi: Secara default, putar video pertama di playlist saat halaman dimuat (opsional)
    if (videoPlaylist.length > 0) {
        loadVideoIntoPlayer(videoPlaylist[0].url);
        // Tandai video pertama jika Anda ingin ada hasil default (tapi ini fitur pencarian, jadi mungkin tidak perlu)
        // Jika Anda ingin menampilkan semua video secara default, panggil displaySearchResults(videoPlaylist);
    }
});
            
