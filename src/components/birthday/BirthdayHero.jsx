'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';

export function BirthdayHero({
  recipientName = 'Ananya',
  senderName = 'Kabir',
  date = '14 November',
  heading = 'Birthday',
  message = 'To the one who makes life more special, may your day be as beautiful, kind and happy as you are.',
  buttonText = 'Open Your Surprise ♡',
  backgroundImage = '/images/birthday/birthday-hero-bg.png',
  profileImage = '/images/birthday/profile.jpg',
  photoPositionY = 50,
  photoPositionX = 50,
  photoFit = 'cover',
  photoScale = 1,
  cakeImage = '/images/birthday/cake.png',
  teddyImage = '/images/birthday/teddy.png',
  onOpenSurprise,
}) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden bg-[#FFF3EE]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(244, 207, 202, 0.4) 0%, rgba(255, 243, 238, 0.95) 100%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Decorative Warm Ambient Light Spots */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#E9CFA9]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-[#F4CFCA]/35 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* ================= LEFT SIDE: FRAMED PHOTO & PLUSH TEDDY ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center order-2 lg:order-1"
          >
            <div className="relative group max-w-[280px] w-full">
              {/* Framed Photo Polaroid / Gold Border */}
              <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_15px_35px_rgba(104,28,44,0.12)] border border-[#E9CFA9]/70 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F9E3DE]">
                  <Image
                    src={profileImage}
                    alt={recipientName}
                    fill
                    sizes="(max-width: 768px) 260px, 320px"
                    className={`${photoFit === 'contain' ? 'object-contain' : 'object-cover'} transition-all duration-300`}
                    style={{
                      objectPosition: `${photoPositionX}% ${photoPositionY}%`,
                      transform: `scale(${photoScale})`,
                    }}
                    priority
                  />
                  {/* Soft golden photo shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#481321]/30 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Handwritten Tag underneath photo */}
                <div className="pt-3 pb-1 text-center">
                  <span className="font-serif italic text-sm text-[#681C2C] font-semibold">
                    {recipientName} &bull; Joy &amp; Laughter
                  </span>
                </div>
              </div>

              {/* Cute Plush Teddy Bear Sticker resting near bottom */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-8 -right-8 w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl z-20 pointer-events-none"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={teddyImage}
                    alt="Plush Teddy"
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Floating Little Heart */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FFFCF9] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] shadow-md animate-bounce">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </div>
          </motion.div>

          {/* ================= CENTER: EDITORIAL BIRTHDAY TYPOGRAPHY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 text-center flex flex-col items-center justify-center px-2 sm:px-6 order-1 lg:order-2"
          >
            {/* Small Elegant Overhead Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-[#E9CFA9]/80 text-[#B62A42] text-[11px] font-sans font-semibold uppercase tracking-[0.2em] mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
              <span>{date ? `✦ Celebrating ${date} ✦` : 'A Special Day For A Special Soul'}</span>
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
            </div>

            {/* Small Serif Intro: Happy */}
            <span className="font-serif italic text-2xl sm:text-3xl text-[#681C2C]/90 tracking-wider">
              Happy
            </span>

            {/* Large Handwritten Heading: Birthday */}
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl text-[#681C2C] font-normal leading-tight my-1 drop-shadow-sm select-none"
              style={{ fontFamily: "'Allura', 'Great Vibes', cursive" }}
            >
              {heading}
            </h1>

            {/* Recipient Big Serif Name */}
            <div className="relative my-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#481321] tracking-wide block">
                {recipientName}
              </span>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B62A42]" />
                <span className="text-sm text-[#B62A42]">✦</span>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B62A42]" />
              </div>
            </div>

            {/* Heartfelt Birthday Message */}
            <p className="mt-4 max-w-md text-sm sm:text-base text-[#51363A] font-sans leading-relaxed text-center opacity-90">
              {message}
            </p>

            {/* Main Action Button: Open Your Surprise */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSurprise}
              className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#681C2C] via-[#B62A42] to-[#681C2C] text-[#FFFCF9] font-sans font-medium text-sm sm:text-base tracking-wide shadow-[0_12px_32px_-6px_rgba(182,42,66,0.45)] hover:shadow-[0_16px_40px_-6px_rgba(182,42,66,0.65)] transition-all duration-300 flex items-center gap-2.5 cursor-pointer group"
            >
              <span>{buttonText}</span>
              <Sparkles className="w-4 h-4 text-[#E9CFA9] group-hover:rotate-45 transition-transform" />
            </motion.button>

            {/* Sender Sign-off */}
            {senderName && (
              <span className="mt-3 text-xs font-serif italic text-[#681C2C]/75">
                Lovingly planned by {senderName}
              </span>
            )}
          </motion.div>

          {/* ================= RIGHT SIDE: LUXURY CAKE & WRAPPED GIFTS ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 flex flex-col items-center lg:items-start justify-center order-3"
          >
            <div className="relative group max-w-[280px] w-full">
              {/* Luxury Birthday Cake Frame */}
              <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_15px_35px_rgba(104,28,44,0.12)] border border-[#E9CFA9]/70 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FFF8F5]">
                  <Image
                    src={cakeImage}
                    alt="Luxury Birthday Cake"
                    fill
                    sizes="(max-width: 768px) 260px, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Candle flicker glow effect */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#E9CFA9]/40 blur-xl animate-pulse pointer-events-none" />
                </div>

                {/* Cake Note */}
                <div className="pt-3 pb-1 text-center">
                  <span className="font-serif italic text-sm text-[#681C2C] font-semibold">
                    Sweetest Moments &bull; Lit With Joy
                  </span>
                </div>
              </div>

              {/* Decorative mini badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#FFFCF9] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] shadow-md">
                <Star className="w-4 h-4 fill-[#E9CFA9] text-[#B62A42]" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
