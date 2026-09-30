import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDocFromServer, getFirestore, setDoc } from 'firebase/firestore'
import type { Question } from './reedad'

const config = {
  apiKey: 'AIzaSyAr4EXIcWoxJ6A6ew0e5CWtmmz3yBP1CkE',
  authDomain: 'client-e2c68.firebaseapp.com',
  projectId: 'client-e2c68',
  storageBucket: 'client-e2c68.appspot.com',
  messagingSenderId: '545951648502',
  appId: '1:545951648502:web:0d4f92b1336ac0830dfad7',
}

const app = initializeApp(config)
const auth = getAuth(app)
const db = getFirestore(app)

const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY
if (appCheckSiteKey) {
  initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey), isTokenAutoRefreshEnabled: true })
}

export type StoredMeasurement = {
  id: string
  createdAt: string
  age: number
  answers: Record<string, number>
  focus: string
  reedad: number
  difference: number
  pillars: Record<string, number>
  profile: string
  strongest: string
  lever: string
  challenge: string
  pointsAwarded: number
  configVersion: string
}

export type StoredProfile = {
  dui: string
  displayName: string
  whatsapp: string
  consent: boolean
  points: number
  badges: string[]
  challengeComplete: boolean
  weeklyCheckins?: Record<string, number[]>
  createdAt: string
  updatedAt: string
  measurements: StoredMeasurement[]
}

export const getProfile = async (dui: string): Promise<StoredProfile | null> => {
  const normalized = dui.trim().toUpperCase()
  const snapshot = await getDocFromServer(doc(db, 'participantProfiles', normalized))
  return snapshot.exists() ? snapshot.data() as StoredProfile : null
}

export const saveProfile = async (profile: StoredProfile) => {
  await setDoc(doc(db, 'participantProfiles', profile.dui), profile)
}

export const completeChallenge = async (profile: StoredProfile) => {
  if (profile.challengeComplete) return profile
  const updated = { ...profile, challengeComplete: true, points: profile.points + 150, badges: [...new Set([...profile.badges, 'Reto cumplido'])], updatedAt: new Date().toISOString() }
  await saveProfile(updated)
  return updated
}

export const signInAdmin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)

export const saveConfiguration = async (questions: Question[]) => {
  await setDoc(doc(db, 'reedadConfig', 'current'), { questions, updatedAt: new Date().toISOString(), version: `reedad-${Date.now()}` })
}
