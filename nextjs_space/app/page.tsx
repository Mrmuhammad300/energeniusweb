'use client'

import HeroBlackStart from '@/components/premium/HeroBlackStart'
import NomadShowcase from '@/components/premium/NomadShowcase'
import BlackStartDiagram from '@/components/premium/BlackStartDiagram'
import ProblemSolution from '@/components/premium/ProblemSolution'
import GeneratorMorph from '@/components/premium/GeneratorMorph'
import PricingTable from '@/components/premium/PricingTable'
import SmartConnectGlobe from '@/components/premium/SmartConnectGlobe'
import Testimonials from '@/components/premium/Testimonials'
import FinalCTA from '@/components/premium/FinalCTA'

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#050a05]">
      {/* 1. Cinematic Hero — Black Start Power Statement */}
      <HeroBlackStart />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 2. Flagship Product — Nomad 20K Showcase */}
      <NomadShowcase />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 3. Black Start Technology Diagram & Comparison */}
      <BlackStartDiagram />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 4. Problem Framing & Target Audience */}
      <ProblemSolution />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 5. Generator Morph — Choose Your Power Level (20K/40K/80K) */}
      <GeneratorMorph />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 6. Installation Options & Pricing */}
      <PricingTable />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 7. SmartConnect Globe — Remote Monitoring */}
      <SmartConnectGlobe />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 8. Social Proof — Testimonials */}
      <Testimonials />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* 9. Final CTA */}
      <FinalCTA />
    </div>
  )
}
