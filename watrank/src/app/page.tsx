"use client"
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion, useAnimation } from 'framer-motion';

const slides = [
  {
    title: "1. Autofill jobs from WaterlooWorks",
    description: "Share and access anonymous information about co-op job searches to make informed decisions.",
    image: "/landing/import-jobs.png"
  },
  {
    title: "2. Track postings in real-time",
    description: "Track and view the progress of job applications, from initial submission to final interviews.",
    image: "/landing/check-status.png"
  },
  {
    title: "3. Share updates anonymously",
    description: "Update/Add to the status of jobs you have applied to.",
    image: "/landing/contribute.png"
  },
  {
    title: "4. Discover trends and insights",
    description: "Gain insights on your co-op application journey.",
    image: "/landing/analytics.png"
  }
];
const LandingPage = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { duration: 0.5 }
    });
  }, [controls]);

  return (
    <motion.div 
      className="relative overflow-hidden max-h-screen"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      {/* Top-left emerging arrow */}
      <motion.div 
        className="fixed top-0 hidden md:block left-0 w-2/3 h-2/3 pointer-events-none -z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '-20%' }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Image
          src="/landing/arrow-repeated.png"
          alt="Top-left arrows"
          fill
          objectFit="cover"
        />
      </motion.div>

      {/* Bottom-right emerging arrow */}
      <motion.div 
        className="fixed bottom-0 right-0 w-2/3 h-2/3 hidden md:block pointer-events-none -z-10"
        initial={{ x: '100%' }}
        animate={{ x: '20%' }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Image
          src="/landing/arrow-repeated.png"
          alt="Bottom-right arrows"
          fill
          objectFit="cover"
          style={{ transform: 'rotate(180deg)' }}
        />
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-between pt-4 gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className="text-4xl font-bold text-center text-foreground text-balance"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Navigate your next co-op search with confidence.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/jobs" passHref>
            <Button className="font-normal rounded-md text-lg">
              Start Searching
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="px-4 md:px-20 grid md:grid-cols-2 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Card className="p-2 md:p-4 h-full">
                <CardTitle className="font-semibold p-2 text-lg md:text-xl md:mr-20">{slide.title}</CardTitle>
                <CardContent className="flex items-center justify-center p-2">
                  <div className="w-full">
                    <AspectRatio ratio={16 / 9}>
                      <Image src={slide.image} fill={true} alt={slide.description} className="rounded-md object-cover" />
                    </AspectRatio>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;