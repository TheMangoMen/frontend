"use client"
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <div className="max-h-screen flex flex-col items-center justify-between pt-4 gap-5">
      <div className="text-4xl font-bold text-center text-foreground">
        Navigate your next co-op search with confidence.
      </div>
      <div className="px-20 grid md:grid-cols-2 gap-5">
          {slides.map((slide, index) => (
              <Card key={index} className="p-4">
                <CardTitle className="mb-2 font-bold text-xl">{slide.title}</CardTitle>
                <CardContent className="flex items-center justify-center p-2">
                <div className="w-full">
                  <AspectRatio ratio={16 / 9}>
                    <Image src={slide.image} fill={true} alt={slide.description} className="rounded-md object-cover" />
                  </AspectRatio>
                </div>     
                </CardContent>
              </Card>
          ))}

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
