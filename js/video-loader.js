document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.querySelector('.video-container');
    const videoDescription = document.getElementById('video-description');
    const markdownFilePath = 'content/video-links.md'; // Path ke file Markdown Anda

    // Fungsi untuk menampilkan pesan error
    function displayError(message) {
        if (videoDescription) {
            videoDescription.textContent = 'Error: ' + message;
            videoDescription.style.color = 'red';
        }
        if (videoContainer) {
            videoContainer.innerHTML = '<div class="error-message">' + message + '</div>';
        }
    }

    // Fungsi untuk mengekstrak URL dari string Markdown
    function extractVideoUrlFromMarkdown(markdownContent) {
        // Regex untuk menemukan link Markdown: [teks](url "title")
        const regex = /\[.*?\]\((https?:\/\/[^\s\)]+)(?: \"(?:.*?)\")?\)/g;
        let match;
        const urls = [];

        while ((match = regex.exec(markdownContent)) !== null) {
            urls.push(match[1]); // match[1] adalah URL
        }

        // Ambil URL pertama yang ditemukan. Anda bisa memodifikasi ini
        // untuk memilih URL tertentu jika ada banyak di file Markdown.
        return urls.length > 0 ? urls[0] : null;
    }

    // Mengambil konten file Markdown
    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                // Tangani kasus di mana file tidak ditemukan atau ada masalah jaringan
                throw new Error(`Gagal memuat file Markdown: ${response.statusText} (${response.status}). Pastikan file '${markdownFilePath}' ada dan diakses melalui server web.`);
            }
            return response.text();
        })
        .then(markdownContent => {
            // Ekstrak URL video dari konten Markdown
            const videoUrl = extractVideoUrlFromMarkdown(markdownContent);

            if (videoUrl) {
                // Jika URL ditemukan, buat dan masukkan iframe
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('scrolling', 'no');
                iframe.setAttribute('allowfullscreen', '');

                if (videoContainer) {
                    videoContainer.innerHTML = ''; // Bersihkan kontainer sebelum menambahkan iframe
                    videoContainer.appendChild(iframe);
                }

                // Opsional: Perbarui deskripsi atau informasi lain
                if (videoDescription) {
                    // Anda bisa mengurai lebih banyak dari Markdown jika perlu,
                    // atau hanya menghapus teks "Memuat video..."
                    videoDescription.textContent = 'Video berhasil dimuat. Selamat menonton!';
                }
            } else {
                displayError('Tidak ada URL video yang ditemukan di file Markdown.');
            }
        })
        .catch(error => {
            console.error('Ada masalah saat memuat atau memproses video:', error);
            displayError(`Gagal memuat video. ${error.message}`);
        });
});
