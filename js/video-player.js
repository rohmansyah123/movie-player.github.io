// js/video-player.js

// Pastikan `videoPlaylist` dari video-data.js sudah tersedia

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayerContainer = document.querySelector('.video-container');
    const videoListContainer = document.getElementById('video-list'); // Container untuk daftar video

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

    // Fungsi untuk menampilkan daftar video
    function renderVideoList() {
        if (!videoListContainer || !videoPlaylist || videoPlaylist.length === 0) {
            console.warn('Elemen daftar video tidak ditemukan atau playlist kosong.');
            return;
        }

        videoPlaylist.forEach(video => {
            const listItem = document.createElement('a');
            listItem.href = '#'; // Menggunakan # agar tidak reload halaman
            listItem.classList.add('video-item');
            listItem.dataset.videoId = video.id; // Menyimpan ID video di data attribute
            listItem.textContent = video.title;

            // Tambahkan event listener untuk setiap item video
            listItem.addEventListener('click', function(event) {
                event.preventDefault(); // Mencegah link dari memuat ulang halaman
                const selectedVideoId = this.dataset.videoId;
                const selectedVideo = videoPlaylist.find(v => v.id === selectedVideoId);

                if (selectedVideo) {
                    loadVideoIntoPlayer(selectedVideo.url);

                    // Optional: Tandai video yang sedang aktif
                    const currentActive = document.querySelector('.video-item.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    this.classList.add('active');
                }
            });
            videoListContainer.appendChild(listItem);
        });

        // Secara default, putar video pertama di playlist saat halaman dimuat
        if (videoPlaylist.length > 0) {
            loadVideoIntoPlayer(videoPlaylist[0].url);
            // Tandai video pertama sebagai aktif
            const firstItem = document.querySelector(`.video-item[data-video-id="${videoPlaylist[0].id}"]`);
            if (firstItem) {
                firstItem.classList.add('active');
            }
        }
    }

    // Panggil fungsi untuk menampilkan daftar video saat DOM sudah siap
    renderVideoList();
});
