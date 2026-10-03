import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'NVIDIA Nemotron | RL code review',description:'Verified RL reports and a matched untouched Base vs Final evaluation.'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
