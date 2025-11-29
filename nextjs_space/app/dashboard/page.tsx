'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { DollarSign, Zap, BatteryCharging, Heart, BarChart, Settings, Calculator, BookOpen, CreditCard, Lock, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Brand Colors
const COLORS = {
  primaryGreen: '#006C4A',
  primaryGreenLight: '#008C5A',
  accentGold: '#F5B932',
  wordmarkGreen: '#2B7F26',
  textDark: '#222222',
  backgroundSoftGray: '#F7F8FA',
  accentTeal: '#1CA6A3'
};

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

const appId = 'energenius-app-default';

// Initial data
const initialGeneratorData = {
  health: 98,
  currentCharge: 75,
  dailyUsageKWH: 8.5,
  temperature: 35,
  runtimeHours: 1250,
};

const initialSavingsData = {
  currentRate: 0.15,
  dailySolarProduction: 10,
  potentialCreditPerMonth: 0,
};

// Helper for Firestore paths
const getUserDocPath = (userId: string) => {
  return `artifacts/${appId}/users/${userId}/appData/generatorMetrics`;
};

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-64 p-6 bg-white rounded-xl shadow-lg">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4" style={{ borderColor: COLORS.primaryGreen, borderTopColor: COLORS.accentGold }}></div>
    <p className="mt-4 text-lg text-gray-700 font-semibold">Loading Dashboard...</p>
    <p className="text-sm text-gray-500">Authenticating and retrieving generator data.</p>
  </div>
);

// Savings Calculator Tool
interface SavingsCalculatorProps {
  userId: string;
  db: Firestore;
  data: typeof initialSavingsData;
  onSave: (data: typeof initialSavingsData) => void;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ userId, db, data, onSave }) => {
  const [rate, setRate] = useState(data.currentRate.toString());
  const [production, setProduction] = useState(data.dailySolarProduction.toString());
  const [calculatedSavings, setCalculatedSavings] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const monthlyProduction = parseFloat(production) * 30.4;
    const savings = monthlyProduction * parseFloat(rate);
    setCalculatedSavings(savings);
  }, [rate, production]);

  const handleSave = () => {
    onSave({
      currentRate: parseFloat(rate),
      dailySolarProduction: parseFloat(production),
      potentialCreditPerMonth: calculatedSavings,
    });
    toast({
      title: 'Success!',
      description: 'Savings data saved successfully.',
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: COLORS.primaryGreen }}>
        <Calculator size={20} className="mr-2" /> Energy Savings Estimator
      </h2>
      <p className="text-gray-600 mb-6">Estimate your potential savings and credit based on your local electricity rate and daily solar generation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Local Electric Rate ($/kWh)</Label>
          <Input
            id="rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="production" className="block text-sm font-medium text-gray-700 mb-1">Avg. Daily Solar Production (kWh)</Label>
          <Input
            id="production"
            type="number"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            className="w-full"
            step="0.1"
            min="0"
          />
        </div>
      </div>

      <div className="mt-8 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between" style={{ backgroundColor: COLORS.backgroundSoftGray, borderLeft: `4px solid ${COLORS.accentGold}` }}>
        <div className="flex items-center">
          <DollarSign size={28} style={{ color: COLORS.wordmarkGreen }} />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Estimated Potential Monthly Savings</p>
            <p className="text-3xl font-extrabold" style={{ color: COLORS.wordmarkGreen }}>
              ${calculatedSavings.toFixed(2)}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="mt-4 sm:mt-0"
          style={{ backgroundColor: COLORS.primaryGreenLight }}
        >
          Save & Update Profile
        </Button>
      </div>
      <p className="mt-4 text-xs text-gray-500">Calculation is an estimate and does not include taxes or utility fees.</p>
    </div>
  );
};

// Metrics Card
interface MetricsCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  unit: string;
  color: string;
  barWidth?: number;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ icon: Icon, title, value, unit, color, barWidth }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}1A`, color }}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-extrabold" style={{ color: COLORS.textDark }}>
            {value} <span className="text-xl font-semibold text-gray-500">{unit}</span>
          </p>
        </div>
      </div>
      {barWidth !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${barWidth}%`, backgroundColor: color }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{title} level</p>
        </div>
      )}
    </div>
  );
};

// Integration Card
interface IntegrationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border-t-4" style={{ borderColor: color }}>
    <div className="flex items-center mb-3">
      <Icon size={24} style={{ color }} className="mr-3" />
      <h3 className="text-xl font-semibold" style={{ color: COLORS.textDark }}>{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <button
      className="text-sm font-medium transition duration-200 hover:underline"
      style={{ color: color }}
    >
      Future Integration
    </button>
  </div>
);

// Main Application Component
export default function DashboardPage() {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatorData, setGeneratorData] = useState(initialGeneratorData);
  const [savingsData, setSavingsData] = useState(initialSavingsData);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  // Check if Firebase is properly configured
  const isFirebaseConfigured = useMemo(() => {
    return firebaseConfig.apiKey && firebaseConfig.projectId;
  }, []);

  // Firebase initialization and auth
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Please set up Firebase environment variables.');
      setIsLoading(false);
      return;
    }

    try {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      setDb(firestore);
      setAuth(authInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (user: User | null) => {
        if (user) {
          setUserId(user.uid);
          const docRef = doc(firestore, getUserDocPath(user.uid));
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            await setDoc(docRef, { generator: initialGeneratorData, savings: initialSavingsData });
          }
        } else {
          await signInAnonymously(authInstance);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Firebase initialization failed:', e);
      setError('Failed to connect to cloud services. Please check Firebase configuration.');
      setIsLoading(false);
    }
  }, [isFirebaseConfigured]);

  // Firestore data listener
  useEffect(() => {
    if (!isAuthReady || !db || !userId) return;

    const docRef = doc(db, getUserDocPath(userId));

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGeneratorData(data.generator || initialGeneratorData);
        setSavingsData(data.savings || initialSavingsData);
      }
      setIsLoading(false);
    }, (err) => {
      console.error('Firestore subscription error:', err);
      setError('Error fetching real-time data.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthReady, db, userId]);

  // Data handlers
  const handleSaveSavings = useCallback(async (newSavingsData: typeof initialSavingsData) => {
    if (!db || !userId) {
      console.error('Cannot save data: Database not initialized or user not signed in.');
      return;
    }
    try {
      const docRef = doc(db, getUserDocPath(userId));
      await setDoc(docRef, { savings: newSavingsData }, { merge: true });
      setSavingsData(newSavingsData);
    } catch (e) {
      console.error('Error saving savings data:', e);
      setError('Failed to save savings data.');
    }
  }, [db, userId]);

  const menuItems = useMemo(() => ([
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'calculator', label: 'Savings Tool', icon: Calculator },
    { id: 'access', label: 'Share Access', icon: Users },
    { id: 'documents', label: 'Documents & RAG', icon: BookOpen },
    { id: 'billing', label: 'Billing & Integrations', icon: CreditCard },
  ]), []);

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
        <LoadingState />
      </div>
    );
  }

  // Determine content based on active tab
  let content;
  switch (activeTab) {
    case 'calculator':
      content = db && userId ? <SavingsCalculator userId={userId} db={db} data={savingsData} onSave={handleSaveSavings} /> : null;
      break;
    case 'access':
      content = (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: COLORS.primaryGreen }}>
            <Lock size={20} className="mr-2" /> User Access & Sharing
          </h2>
          <p className="text-gray-600 mb-4">This cloud application uses secure authentication to protect your generator's data. You can share access with other verified RRG accounts.</p>
          <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.backgroundSoftGray }}>
            <p className="text-sm font-semibold text-gray-700">Your unique User ID for sharing and support:</p>
            <code className="block mt-2 p-2 text-xs break-all rounded bg-white" style={{ color: COLORS.textDark, border: `1px solid ${COLORS.accentGold}` }}>
              {userId || 'N/A - Anonymous'}
            </code>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">**Authentication Status:** Successfully signed in to Firebase.</p>
            <p>When sharing, the other user must also be signed in to access shared data based on security rules.</p>
          </div>
        </div>
      );
      break;
    case 'documents':
      content = (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: COLORS.primaryGreen }}>
            <BookOpen size={20} className="mr-2" /> Document Retrieval (RAG System Placeholder)
          </h2>
          <p className="text-gray-600 mb-6">This section will house our **RAG (Retrieval-Augmented Generation) system**, allowing you to upload manuals, warranties, and other documents. The system will then use AI to search, summarize, and answer questions based on your specific files.</p>
          <IntegrationCard
            icon={Settings}
            title="RAG File Uploader"
            description="Upload generator manuals and warranty documents here. This system handles multiple file types (PDF, DOCX, TXT) for smart retrieval."
            color={COLORS.accentTeal}
          />
        </div>
      );
      break;
    case 'billing':
      content = (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: COLORS.primaryGreen }}>
            <CreditCard size={20} className="mr-2" /> Paid Services & Billing (Integration Placeholders)
          </h2>
          <p className="text-gray-600 mb-6">Future paid services, such as premium monitoring, extended warranties, or priority support, will be managed here through integrated financial and legal platforms.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationCard
              icon={DollarSign}
              title="Electric Bill Payment Portal"
              description="Pay your monthly electric bill or generator lease/financing installment directly here. Managed by RRG for eligible customers."
              color={COLORS.wordmarkGreen}
            />
            <IntegrationCard
              icon={CreditCard}
              title="Stripe Payment Gateway"
              description="For secure processing of subscription payments and service fees."
              color={COLORS.primaryGreenLight}
            />
            <IntegrationCard
              icon={Zap}
              title="Plaid Financial Linking"
              description="For setting up direct debit or verifying accounts for large purchase options."
              color={COLORS.accentGold}
            />
            <IntegrationCard
              icon={BookOpen}
              title="DocuSign Contracts"
              description="For digitally signing extended warranty agreements or service contracts."
              color={COLORS.accentTeal}
            />
          </div>
        </div>
      );
      break;
    case 'dashboard':
    default:
      content = (
        <>
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primaryGreen }}>Live Generator Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              icon={Heart}
              title="System Health"
              value={generatorData.health}
              unit="%"
              color={generatorData.health > 90 ? COLORS.wordmarkGreen : COLORS.accentGold}
              barWidth={generatorData.health}
            />
            <MetricsCard
              icon={BatteryCharging}
              title="Current Charge"
              value={generatorData.currentCharge}
              unit="%"
              color={COLORS.primaryGreenLight}
              barWidth={generatorData.currentCharge}
            />
            <MetricsCard
              icon={Zap}
              title="Daily Usage"
              value={generatorData.dailyUsageKWH.toFixed(1)}
              unit="kWh"
              color={COLORS.accentGold}
            />
            <MetricsCard
              icon={Settings}
              title="Runtime Total"
              value={generatorData.runtimeHours}
              unit="hrs"
              color={COLORS.accentTeal}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-3" style={{ color: COLORS.primaryGreen }}>Estimated Financials</h3>
                <p className="text-gray-600 mb-4">Savings calculation based on your current settings in the **Savings Tool** tab.</p>
                <MetricsCard
                  icon={DollarSign}
                  title="Potential Monthly Credit"
                  value={savingsData.potentialCreditPerMonth.toFixed(2)}
                  unit="$"
                  color={COLORS.wordmarkGreen}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-3" style={{ color: COLORS.primaryGreen }}>Important Alerts</h3>
              {generatorData.health < 95 ? (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-bold">⚠️ Warning: Health Decline</p>
                  <p className="text-sm mt-1">System health is at {generatorData.health}%. Consider scheduling diagnostics soon.</p>
                </div>
              ) : (
                <div className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-bold">✅ System Nominal</p>
                  <p className="text-sm mt-1">All generator metrics are within optimal range.</p>
                </div>
              )}
            </div>
          </div>

          {!isFirebaseConfigured && (
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <h3 className="text-lg font-bold text-amber-800 mb-2">⚠️ Firebase Configuration Required</h3>
              <p className="text-amber-700 text-sm mb-3">
                To enable real-time monitoring, cloud sync, and advanced features, please configure Firebase:
              </p>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1 mb-3">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.firebase.google.com</a></li>
                <li>Enable Authentication (Anonymous sign-in)</li>
                <li>Enable Firestore Database</li>
                <li>Copy your Firebase config and add to environment variables</li>
              </ol>
              <p className="text-xs text-amber-600">Current status: Using demo data only</p>
            </div>
          )}
        </>
      );
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.backgroundSoftGray }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryGreen }}>EnerGenius Dashboard</h1>
          <p className="text-lg font-medium" style={{ color: COLORS.wordmarkGreen }}>"Power That Thinks Ahead"</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-1/4 bg-white p-4 rounded-xl shadow-lg h-fit lg:sticky lg:top-8">
            <h3 className="text-sm font-semibold uppercase mb-4 tracking-wider" style={{ color: COLORS.primaryGreen }}>Navigation</h3>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ${
                      activeTab === item.id
                        ? 'font-bold text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={
                      activeTab === item.id
                        ? { backgroundColor: COLORS.primaryGreenLight }
                        : {}
                    }
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-medium">User ID:</p>
              <code className="block text-xs break-all" style={{ color: COLORS.primaryGreen }}>
                {userId || 'Not signed in'}
              </code>
            </div>

            <div className="mt-4">
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  ← Back to Website
                </Button>
              </Link>
            </div>
          </nav>

          {/* Main Content Pane */}
          <main className="lg:w-3/4">
            {error && (
              <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-bold">System Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {content}
          </main>
        </div>
      </div>
    </div>
  );
}
