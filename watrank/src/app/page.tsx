"use client"
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from 'framer-motion';

const slides = [
  {
    title: "1. Import applied jobs from WaterlooWorks",
    description: "Share and access anonymous information about co-op job searches to make informed decisions.",
    image: "/landing/import-jobs.png"
  },
  {
    title: "2. Track the status of postings in real-time",
    description: "Track and view the progress of job applications, from initial submission to final interviews.",
    image: "/landing/check-status.png"
  },
  {
    title: "3. Share your updates anonymously",
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
  return (
      <motion.div 
      className="max-h-screen flex flex-col items-center justify-between pt-4 gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-4xl font-bold text-center text-foreground text-balance"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Navigate your next co-op search with confidence.
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link href="/jobs" passHref>
          <Button className="font-md rounded-md text-lg">
            Start Searching
          </Button>
        </Link>
      </motion.div>
      <motion.div 
        className="px-4 md:px-20 grid md:grid-cols-2 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            <Card className="p-4">
              <CardTitle className="mb-2 font-bold text-xl">{slide.title}</CardTitle>
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
  );
};

export default LandingPage;