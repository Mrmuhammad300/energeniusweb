import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/pricing">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Service Package Policies & Guardrails
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: December 2024
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Service Package Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              EnerGenius, operated by Renewable Resource Group LLC, offers fixed-price service packages 
              for solar generator installation and support. These Terms of Service govern all service 
              package purchases and ensure clear expectations for both parties.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Scope & Deliverables</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Package Definitions</h3>
              <p>
                Each service package includes specific deliverables as outlined in the package description. 
                Customers must review the "What's Included" and "Not Included" sections before purchase.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Exclusions</h3>
              <p>
                Services and materials explicitly listed as "Not Included" in the package description 
                are not covered by the fixed price. Additional work requires separate approval and 
                pricing. Common exclusions include:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Electrical runs exceeding the specified distance (e.g., beyond 15ft or 50ft)</li>
                <li>Rock excavation requiring specialized equipment or blasting</li>
                <li>Main electrical panel upgrades</li>
                <li>Crane services (unless explicitly included)</li>
                <li>Environmental remediation</li>
                <li>Building structural modifications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Revisions and Acceptance</h3>
              <p>
                Fixed Price Packages include exactly <strong>two (2) rounds of revisions</strong> per 
                deliverable, unless otherwise specified in the product description.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>A "Round of Revisions" is defined as a single consolidated list of feedback provided by the Client.</li>
                <li><strong>Excess Revisions:</strong> Any additional revisions beyond the included two rounds will be billed at our standard hourly rate of $175/hour, payable prior to the final release of files or completion of work.</li>
                <li><strong>Scope Creep:</strong> Requests that alter the fundamental direction or requirements agreed upon at the project start (e.g., "Change the entire installation location" after the installation plan was approved) are not considered "revisions" and will require a separate Change Order.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Prerequisites & Readiness Requirements</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Client Responsibilities</h3>
              <p>
                Prior to service commencement, clients must ensure all prerequisites listed in their 
                purchased package are met. Failure to meet prerequisites may result in project delays 
                or additional charges.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Site Access & Conditions</h3>
              <p>
                Unless otherwise specified, pricing assumes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Standard Soil:</strong> Normal soil conditions. Rock excavation requiring jackhammers or blasting is billed separately as Time & Materials.</li>
                <li><strong>Clear Access:</strong> Installation location is accessible by standard equipment. Crane services required to lift units over fences/walls are billed separately.</li>
                <li><strong>Code Compliance:</strong> Existing electrical panel is up to current code. Inspector-required panel upgrades are additional costs.</li>
                <li><strong>Utility Availability:</strong> For installations requiring gas connections, existing gas service must be available at the property.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Project Timeline & Dormancy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Client Responsiveness & Project Dormancy</h3>
              <p>
                To ensure timely delivery of your project, RRG Solutions requires feedback on all 
                drafts, approvals, and deliverables within <strong>five (5) business days</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Active Status:</strong> Projects are considered "Active" as long as feedback is received within the 5-day window.</li>
                <li><strong>Dormant Status:</strong> If no feedback is received for ten (10) consecutive business days, the project will be automatically classified as "Dormant."</li>
                <li><strong>Reactivation:</strong> To reactivate a Dormant project, a Reinstatement Fee of $250 (or 10% of the total project value, whichever is greater) will apply to cover re-onboarding and scheduling costs.</li>
                <li><strong>Termination:</strong> Projects that remain Dormant for more than sixty (60) days may be terminated by RRG Solutions with no refund of fees paid to date.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Estimated Timelines</h3>
              <p>
                Timeline estimates provided with each package are subject to client responsiveness, 
                permitting authority processing times, weather conditions, and equipment availability. 
                Delays caused by client-side issues or external factors beyond our control do not 
                qualify for refunds or compensation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Refund Policy & Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Refund Policy</h3>
              <p>
                Due to the nature of our strategic services and the scheduling of specialized resources:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>100% Refund:</strong> Available if a cancellation request is received within 24 hours of purchase and before any Kickoff Call or work has occurred.</li>
                <li><strong>50% Refund:</strong> Available if requested after 24 hours but before any custom work, site visits, drafting, or permitting has commenced.</li>
                <li><strong>No Refund:</strong> Once the Kickoff Call has been completed, site visits have occurred, or initial audits/strategies/permits have been initiated, no refunds will be issued.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Payment Terms</h3>
              <p>
                All service packages require <strong>100% upfront payment</strong> to secure your 
                installation slot. Payment is processed securely via Stripe or approved payment methods.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Subscription Services</h3>
              <p>
                For packages including monthly subscriptions (e.g., The Peace of Mind package at $49/month):
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Subscription begins upon installation completion</li>
                <li>Cancellation requires 30-day written notice</li>
                <li>Lifetime service benefits terminate upon subscription cancellation</li>
                <li>No refunds for partial months</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Liability & Warranty</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Liability Cap</h3>
              <p>
                Our liability is limited to the purchase price of the specific package purchased. 
                We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Lost revenue due to downtime during implementation</li>
                <li>Indirect, consequential, or punitive damages</li>
                <li>Delays caused by third parties (utility companies, permitting authorities)</li>
                <li>Acts of God or force majeure events</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Installation Warranty</h3>
              <p>
                Installation workmanship warranties are specific to each package:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Quick Start: 1-year installation warranty</li>
                <li>Turnkey: 2-year installation warranty</li>
                <li>Peace of Mind: 5-year installation warranty</li>
                <li>Commercial packages: As specified in package description</li>
              </ul>
              <p>
                Equipment manufacturer warranties are separate and governed by manufacturer terms. 
                RRG Solutions is not responsible for equipment defects or failures.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Communication & Support</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7.1 Communication Channels</h3>
              <p>
                All support requests, change orders, and project communications must be submitted via 
                our official channels:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Primary: Customer Portal (once project is initiated)</li>
                <li>Secondary: Email to support@energenius.com</li>
                <li>Phone: For urgent issues only</li>
              </ul>
              <p>
                <strong>Text messages and personal emails will not be processed</strong> to ensure all 
                communications are properly documented and tracked.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7.2 Response Times</h3>
              <p>
                We strive to respond to all inquiries within 1-2 business days. Emergency support for 
                active installations is available during business hours (Monday-Friday, 8 AM - 6 PM local time).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. Permits & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <p>
              Permitting services included in packages cover standard municipal permits only, unless 
              otherwise specified. Clients are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Disclosure of all HOA restrictions and requirements</li>
              <li>Any special permits required by local ordinances</li>
              <li>Compliance with property deed restrictions</li>
              <li>Historical district or landmark approvals</li>
            </ul>
            <p>
              Additional permitting costs discovered during the project will be billed separately with 
              client approval before proceeding.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-4">
            <p>
              Any disputes arising from service package purchases shall be resolved through binding 
              arbitration in accordance with the rules of the American Arbitration Association. 
              The arbitration shall take place in the state where RRG Solutions is headquartered.
            </p>
            <p>
              Clients agree to attempt good-faith negotiation for 30 days before pursuing arbitration.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>10. Amendments & Updates</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              RRG Solutions reserves the right to update these Terms of Service at any time. 
              Clients will be notified of material changes via email. Continued use of services 
              after notification constitutes acceptance of updated terms.
            </p>
            <p className="mt-4">
              Terms in effect at the time of purchase govern that specific service package, even if 
              terms are later updated.
            </p>
          </CardContent>
        </Card>

        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help clarify any questions about our service packages and policies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Contact Support
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
