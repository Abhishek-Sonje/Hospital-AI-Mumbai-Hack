"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HospitalRecommender } from '@/components/hospital/hospital-recommender';
import { Button } from '@/components/ui/button';

export default function RecommendPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Smart Hospital Recommendation
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our AI analyzes real-time traffic, hospital capacity, and your specific medical needs to route you to the best possible care facility.
            </p>
          </div>

          <HospitalRecommender />
        </div>
      </div>
    </div>
  );
}
