// Memastikan skrip dijalankan setelah seluruh konten HTML dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Mendapatkan elemen kontainer tempat video akan ditempatkan
    const videoContainer = document.querySelector('.video-container');

    // --- Bagian yang perlu Anda ubah jika link video berubah ---
    const videoUrl = "https://short.icu/v6oUMlhx2";
    // ---------------------------------------------------------

    // Membuat elemen iframe baru secara dinamis
    const iframe = document.createElement('iframe');

    // Mengatur atribut-atribut yang diperlukan untuk iframe video
    iframe.src = videoUrl; // URL sumber video
    iframe.setAttribute('frameborder', '0'); // Menghilangkan bingkai iframe
    iframe.setAttribute('scrolling', 'no'); // Menonaktifkan scrollbar
    iframe.setAttribute('allowfullscreen', ''); // Memungkinkan mode layar penuh
    // Anda juga bisa menambahkan atribut lain jika diperlukan, misal:
    // iframe.setAttribute('allow', 'autoplay; encrypted-media');

    // Memasukkan elemen iframe yang sudah dibuat ke dalam videoContainer
    videoContainer.appendChild(iframe);
});
