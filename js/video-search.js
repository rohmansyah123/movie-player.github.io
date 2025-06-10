// js/video-search.js

// Pastikan `videoPlaylist` dari video-data.js sudah tersedia

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayerContainer = document.querySelector('.video-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');

    // Fungsi untuk memuat video ke player
    function loadVideoIntoPlayer(videoUrl) {
        if (!videoUrl) {
            videoPlayerContainer.innerHTML = '<p class="no-results">URL video tidak valid.</p>';
            return;
        }

        // Hapus iframe yang ada jika ada
        videoPlayerContainer.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allowfullscreen', '');
        // --- Penambahan Lazy Load ---
        iframe.setAttribute('loading', 'lazy'); // Video hanya dimuat saat mendekati viewport
        // ---------------------------

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
        const searchTerm = searchInput.value.toLowerCase().trim(); // Tambahkan trim() untuk menghilangkan spasi
        let filteredVideos = [];

        if (searchTerm.length > 0) {
            filteredVideos = videoPlaylist.filter(video =>
                video.title.toLowerCase().includes(searchTerm)
            );
        } else {
            // Jika input pencarian kosong, tampilkan semua video secara default
            filteredVideos = [...videoPlaylist]; // Buat salinan agar tidak memodifikasi array asli
        }
        displaySearchResults(filteredVideos);
    }

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', handleSearch);

    // Inisialisasi: Panggil handleSearch untuk menampilkan semua video saat halaman dimuat
    // (atau Anda bisa memutar video pertama dan tidak menampilkan daftar awal jika ingin)
    handleSearch(); // Ini akan menampilkan semua video saat pertama kali dimuat

    // Secara default, putar video pertama di playlist saat halaman dimuat
    if (videoPlaylist.length > 0) {
        loadVideoIntoPlayer(videoPlaylist[0].url);
        // Tandai video pertama sebagai aktif di hasil pencarian awal
        const firstVideoId = videoPlaylist[0].id;
        const firstItem = document.querySelector(`.search-result-item[data-video-id="${firstVideoId}"]`);
        if (firstItem) {
            firstItem.classList.add('active');
        }
    }
});
