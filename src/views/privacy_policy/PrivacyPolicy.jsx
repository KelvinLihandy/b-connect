import React from 'react'
import Navbar from '../../components/navbar/Navbar'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-10">
      <Navbar alt />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="font-semibold text-xl sm:text-2xl mb-2">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
          </p>
          <div className="border-t border-gray-400 w-full mb-6"></div>

          <div className="space-y-6">
            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">1. Informasi yang Kami Kumpulkan</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p><strong className="text-gray-900">Informasi Pribadi:</strong> Ketika Anda mendaftar atau menggunakan B-Connect, kami dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, lokasi, informasi keterampilan/jasa yang Anda tawarkan, dan informasi pembayaran.</p>
                <p><strong className="text-gray-900">Data Profil Jasa:</strong> Untuk penyedia jasa, kami mengumpulkan informasi tentang layanan yang ditawarkan, portofolio, tarif, dan ulasan dari klien.</p>
                <p><strong className="text-gray-900">Data Transaksi:</strong> Informasi tentang pemesanan jasa, komunikasi antara penyedia dan penerima jasa, pembayaran, dan riwayat transaksi.</p>
                <p><strong className="text-gray-900">Data Penggunaan:</strong> Kami secara otomatis mengumpulkan informasi tentang cara Anda berinteraksi dengan platform B-Connect, termasuk komunikasi, dan aktivitas di aplikasi.</p>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">2. Cara Kami Menggunakan Informasi Anda</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                <div className="ml-4 space-y-2">
                  <p>• Menyediakan dan memelihara platform B-Connect</p>
                  <p>• Memfasilitasi koneksi antara penyedia jasa dan penerima jasa</p>
                  <p>• Memproses transaksi pembayaran dan booking jasa</p>
                  <p>• Menampilkan profil dan layanan penyedia jasa kepada calon klien</p>
                  <p>• Menyediakan sistem ulasan dan rating untuk menjaga kualitas layanan</p>
                  <p>• Mencegah penipuan dan menjaga keamanan platform</p>
                  <p>• Meningkatkan algoritma pencarian jasa</p>
                  <p>• Mematuhi kewajiban hukum dan peraturan yang berlaku</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">3. Berbagi Informasi</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi dalam situasi berikut:</p>
                <div className="ml-4 space-y-2">
                  <p><strong className="text-gray-900">Antar Pengguna B-Connect:</strong> Profile dan informasi layanan penyedia jasa akan ditampilkan kepada calon klien di platform</p>
                  <p><strong className="text-gray-900">Untuk Transaksi:</strong> Informasi kontak yang diperlukan untuk komunikasi dan penyelesaian jasa antara penyedia dan penerima jasa</p>
                  <p><strong className="text-gray-900">Penyedia Layanan:</strong> Dengan partner pembayaran, layanan pesan, dan penyedia infrastruktur yang membantu mengoperasikan B-Connect</p>
                  <p><strong className="text-gray-900">Kewajiban Hukum:</strong> Ketika diwajibkan oleh hukum atau untuk merespons proses hukum</p>
                  <p><strong className="text-gray-900">Keamanan Platform:</strong> Untuk melindungi hak, properti, keamanan B-Connect dan pengguna dari penipuan atau aktivitas berbahaya</p>
                  <p><strong className="text-gray-900">Perubahan Kepemilikan:</strong> Dalam hubungan dengan merger, akuisisi, atau penjualan aset B-Connect</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">4. Keamanan Data</h2>
              <p className="text-sm sm:text-base text-gray-700">Kami menerapkan langkah-langkah keamanan yang tepat untuk melindungi informasi pribadi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Ini termasuk enkripsi data, autentikasi berlapis, dan monitoring keamanan. Namun, tidak ada metode transmisi melalui internet yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">5. Hak Anda</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>Sebagai pengguna B-Connect, Anda memiliki hak untuk:</p>
                <div className="ml-4 space-y-2">
                  <p>• Mengakses dan memperbarui profil dan informasi pribadi Anda</p>
                  <p>• Memilih keluar dari komunikasi pemasaran dan promosi</p>
                  <p>• Meminta salinan data pribadi yang kami miliki tentang Anda</p>
                  <p>• Menolak pemrosesan data pribadi untuk tujuan tertentu</p>
                  <p>• Melaporkan masalah keamanan atau privasi kepada tim B-Connect</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">6. Cookie dan Pelacakan</h2>
              <p className="text-sm sm:text-base text-gray-700">Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda di B-Connect, termasuk mengingat preferensi pencarian, menyimpan sesi login, dan menganalisis penggunaan platform. Anda dapat mengontrol pengaturan cookie melalui preferensi browser Anda.</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">7. Privasi Anak</h2>
              <p className="text-sm sm:text-base text-gray-700">B-Connect tidak ditujukan untuk anak-anak di bawah usia 17 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah 17 tahun. Jika Anda mengetahui bahwa anak di bawah umur telah memberikan informasi pribadi kepada kami, silakan hubungi kami untuk menghapus informasi tersebut.</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">8. Pengguna Internasional</h2>
              <p className="text-sm sm:text-base text-gray-700">Jika Anda mengakses layanan kami dari luar Indonesia, harap dicatat bahwa informasi Anda dapat ditransfer dan diproses di Indonesia, tempat server kami berada.</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">9. Perubahan Kebijakan</h2>
              <p className="text-sm sm:text-base text-gray-700">Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal "Terakhir Diperbarui".</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-900">10. Hubungi Kami</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-3">
                  <p className="mb-1"><strong className="text-gray-900">Email:</strong> bconnect404@gmail.com</p>
                  <p className="mb-1"><strong className="text-gray-900">Telepon:</strong> +62 821-2517-4770</p>
                  <p><strong className="text-gray-900">Alamat:</strong> Jakarta, Indonesia</p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-400 w-full pt-4 mt-6">
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Terakhir Diperbarui:</strong> Juni 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy