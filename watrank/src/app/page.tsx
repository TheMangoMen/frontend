"use client"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const slides = [
  {
    title: "1. Import all your applied jobs from WaterlooWorks",
    description: "Share and access anonymous information about co-op job searches to make informed decisions.",
    image: "/landing/import-jobs.png"
  },
  {
    title: "2. Real-time application progress",
    description: "Track and view the progress of job applications, from initial submission to final interviews.",
    image: "/landing/check-status.png"
  },
  {
    title: "3. Anonymously share your own status",
    description: "Update/Add to the status of jobs you have applied to.",
    image: "/landing/contribute.png"
  },
  {
    title: "4. Observe and track trends",
    description: "Gain insights on your co-op application journey.",
    image: "/landing/analytics.png"
  }
];

const LandingPage = () => {
  return (
    <div className="max-h-screen flex flex-col items-center justify-between pt-4 gap-5">
      <div className="text-4xl font-bold text-center text-foreground">
        Navigate your next co-op search with confidence.
      </div>
      <div className="px-20">
      <Carousel className="w-full"   opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>
      


        <Link href="/jobs" passHref>
          <Button className="font-bold rounded-md text-lg">
            Start Searching
          </Button>
        </Link>
    </div>
  );
};

export default LandingPage;
