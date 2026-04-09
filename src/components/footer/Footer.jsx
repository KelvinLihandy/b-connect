import React from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.svg";
import facebook_ball from "../../assets/facebook_ball.svg";
import linkedin_ball from "../../assets/linkedin_ball.svg";
import twitter_ball from "../../assets/twitter_ball.svg";
import youtube_ball from "../../assets/youtube_ball.svg";

const fadeInUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const Footer = ({ refScrollUp = null, offset = 0 }) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="B-Connect" className="h-10 w-auto" />
              <div className="leading-tight">
                <div className="font-poppins font-bold text-slate-900 text-xl">B-Connect</div>
                <div className="text-sm text-slate-500">Freelancing made easy</div>
              </div>
            </div>

            <p className="mt-4 text-slate-600">
              Find the perfect freelancer for your project—fast, safe, and simple.
            </p>

            <div className="mt-4 text-sm text-slate-500">
              <div>bconnect404@gmail.com</div>
              <div>089728203230</div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {[facebook_ball, linkedin_ball, twitter_ball, youtube_ball].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
                  aria-label="Social link"
                >
                  <img src={icon} alt="" className="h-6 w-6" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="font-Archivo font-bold text-slate-900 text-lg">Explore</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-slate-600">
              <Link className="hover:text-[#2E5077]" to="/sign-up">Register</Link>
              <Link className="hover:text-[#2E5077]" to="/sign-in">Login</Link>
              <Link className="hover:text-[#2E5077]" to="/catalog">Gigs</Link>
              <Link className="hover:text-[#2E5077]" to="/about-us">About Us</Link>
              <Link className="hover:text-[#2E5077]" to="/privacy-policy">Privacy Policy</Link>
            </div>

            <div className="mt-10 text-sm text-slate-500">© {new Date().getFullYear()} B-Connect</div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div className="font-Archivo font-bold text-slate-900 text-lg">
                Looking for the right freelancer?
              </div>
              <div className="mt-2 text-slate-600">Let’s find skilled professionals today.</div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center rounded-xl bg-[#2E5077] px-5 py-3 text-white font-semibold hover:bg-[#25425f] transition"
                >
                  Browse services
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (!refScrollUp?.current) return;
                    window.scrollTo({ top: refScrollUp.current.offsetTop - offset, behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50 transition"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;