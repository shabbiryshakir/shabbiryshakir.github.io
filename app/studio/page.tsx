"use client";

import { NextStudio } from 'next-sanity/studio';
// Adjust the dots if it can't find your config file. 
// Since we removed a folder, we only need two sets of dots now!
import config from '../../sanity.config'; 

export default function StudioPage() {
  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <NextStudio config={config} />
    </div>
  );
}