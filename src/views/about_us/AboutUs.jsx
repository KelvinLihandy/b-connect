import React, { useRef, useState } from "react";
import downarrow from "../../assets/down_arrow.svg";
import diagram from "../../assets/diagram.png";
import about_us_image from "../../assets/about_us_img.svg";
import cantfind from "../../assets/yuppies_managing.svg";
import PageShell from "../../components/layout/PageShell";
import { Button } from "../../components/ui/button";

const AboutUs = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const aboutScrollUp = useRef(null);

  const toggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  return (
    <PageShell
      scrollRef={aboutScrollUp}
      withFooter
      footerProps={{ refScrollUp: aboutScrollUp }}
      contentClassName="font-Archivo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">About Us</h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-prose">
                B-Connect menghubungkan pelaku bisnis dan startup teknologi dengan freelancer berkualitas untuk
                menyelesaikan proyek secara efisien, aman, dan terpercaya.
              </p>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src={about_us_image}
                  alt="About Us"
                  className="w-full h-auto rounded-[var(--radius-card)] mb-6 shadow-[var(--shadow-soft)]"
                />
              </div>

              <div className="text-base sm:text-lg lg:text-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <p className="leading-relaxed">
                  Kami menyediakan platform yang menghubungkan pelaku bisnis dan startup teknologi dengan freelancer
                  berkualitas. Melalui B-Connect, Anda dapat menemukan talenta terbaik untuk menyelesaikan proyek Anda
                  secara efisien dan terpercaya.
                </p>
                <p className="leading-relaxed">
                  Kami percaya bahwa kolaborasi yang tepat dapat mempercepat pertumbuhan bisnis. Dengan dukungan sistem
                  yang aman dan tim yang berpengalaman, kami hadir untuk membantu Anda mencapai tujuan dengan lebih cepat.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-white w-full h-auto rounded-[var(--radius-card)] my-10 border border-slate-200/70 shadow-[var(--shadow-soft)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10 h-full justify-center items-center">
            <div>
              <img src={diagram} alt="diagram" className="w-full h-auto" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold pb-2">Our Values</h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700">
                Bersama B-Connect, Anda mendapatkan lebih dari sekadar platform — Anda mendapatkan
                mitra terpercaya dalam menyelesaikan pekerjaan dan membangun koneksi yang bermakna.
              </p>
            </div>
          </div>
        </div>

          <div className="flex relative flex-col md:flex-row gap-10 py-10 h-full">
            <div className="w-full md:w-[550px]">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold pb-2">Why Us?</h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700">
              kami membangun B-Connect sebagai solusi nyata untuk menghubungkan kebutuhan dan
              keahlian. Kami tahu betapa berharganya waktu, kualitas, dan kepercayaan
            </p>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700">—</p>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700">dan kami hadir untuk menjawabnya.</p>
            </div>

            <div className="relative w-full flex flex-col gap-2 md:top-10 lg:top-20 p-3 md:p-5">
            <div className="flex relative cursor-pointer" onClick={() => toggleExpand(1)}>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold">Apa itu B-Connect?</p>
              <div className="ml-auto">
                <img
                  src={downarrow}
                  alt="Expand"
                  className={`absolute right-0 top-1.5 w-5 h-5 transition-transform duration-500 ${
                    expandedItems.includes(1) ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedItems.includes(1)
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <p className="text-base md:text-lg lg:text-[25px]">
                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University
                dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah
                menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka
                peluang kolaborasi dan pengalaman kerja nyata.
              </p>
            </div>
            <div
              className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                expandedItems.includes(1) ? "h-[2px]" : "h-[1px]"
              }`}
            ></div>

            <div className="flex relative cursor-pointer" onClick={() => toggleExpand(2)}>
              <p className="text-base sm:text-lg lg:text-xl font-semibold">
                Bagaimana cara mencari freelancer di B-Connect?
              </p>
              <div className="ml-auto">
                <img
                  src={downarrow}
                  alt="Expand"
                  className={`absolute right-0 top-1.5 w-5 h-5 transition-transform duration-500 ${
                    expandedItems.includes(2) ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedItems.includes(2)
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <p className="text-base md:text-lg lg:text-[25px]">
                Anda bisa mencari freelancer sesuai kebutuhan proyek melalui sistem pencarian kami
                yang intuitif, cepat, dan tepat. Cukup masukkan kategori atau skill yang dibutuhkan,
                dan B-Connect akan menampilkan freelancer berkualitas dari komunitas Binus.
              </p>
            </div>
            <div
              className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                expandedItems.includes(2) ? "h-[2px]" : "h-[1px]"
              }`}
            ></div>

            <div className="flex relative cursor-pointer" onClick={() => toggleExpand(3)}>
              <p className="text-base sm:text-lg lg:text-xl font-semibold">
                Apakah sistem pembayaran di B-Connect aman?
              </p>
              <div className="ml-auto">
                <img
                  src={downarrow}
                  alt="Expand"
                  className={`absolute right-0 top-1.5 w-5 h-5 transition-transform duration-500 ${
                    expandedItems.includes(3) ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedItems.includes(3)
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <p className="text-base md:text-lg lg:text-[25px]">
                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University
                dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah
                menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka
                peluang kolaborasi dan pengalaman kerja nyata.
              </p>
            </div>
            <div
              className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                expandedItems.includes(3) ? "h-[2px]" : "h-[1px]"
              }`}
            ></div>

            <div className="flex relative cursor-pointer" onClick={() => toggleExpand(4)}>
              <p className="text-base sm:text-lg lg:text-xl font-semibold">
                Bagaimana B-Connect menjamin kualitas hasil kerja?
              </p>
              <div className="ml-auto">
                <img
                  src={downarrow}
                  alt="Expand"
                  className={`absolute right-0 top-1.5 w-5 h-5 transition-transform duration-500 ${
                    expandedItems.includes(4) ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedItems.includes(4)
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <p className="text-base md:text-lg lg:text-[25px]">
                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University
                dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah
                menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka
                peluang kolaborasi dan pengalaman kerja nyata.
              </p>
            </div>
            <div
              className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                expandedItems.includes(4) ? "h-[2px]" : "h-[1px]"
              }`}
            ></div>
          </div>
        </div>

          {expandedItems.length === 4 && (
            <div className="relative bg-white mx-auto h-auto my-16 px-6 md:px-10 py-8 rounded-[var(--radius-card)] border border-slate-200/70 shadow-[var(--shadow-soft)]">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
                <div>
                  <p className="text-2xl md:text-3xl font-semibold">Can't find your answer?</p>
                  <p className="text-base sm:text-lg text-slate-700 w-full md:w-[450px]">
                    Tenang, tim B-Connect siap membantu kamu! Hubungi kami langsung jika kamu tidak menemukan jawaban
                    yang kamu cari.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      const email = "bconnect404@gmail.com";
                      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
                      window.open(gmailURL, "_blank");
                    }}
                  >
                    Contact Us
                  </Button>
                </div>
                <div>
                  <img
                    src={cantfind}
                    alt="cant_find_img?"
                    className="mx-auto w-full max-w-[300px] md:max-w-[360px] lg:max-w-[420px] h-auto"
                  />
                </div>
              </div>
            </div>
          )}
      </div>
    </PageShell>
  );
};

export default AboutUs;
