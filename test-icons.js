import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

// Test Lucide filtering (exclude Icon suffix duplicates)
const excludeList = ['createLucideIcon', 'Icon', 'LucideIcon', 'LucideProps', 'default'];
const lucideFiltered = Object.keys(LucideIcons).filter(key =>
  !excludeList.includes(key) &&
  key[0] === key[0].toUpperCase() &&
  !key.endsWith('Icon') &&
  LucideIcons[key]
);

console.log('Lucide icons count:', lucideFiltered.length);
console.log('Sample Lucide icons:', lucideFiltered.slice(0, 30));

// Test Heroicons filtering
const heroFiltered = Object.keys(HeroIcons).filter(key =>
  key !== 'default' &&
  key[0] === key[0].toUpperCase() &&
  HeroIcons[key]
);

console.log('\n\nHeroicons count:', heroFiltered.length);
console.log('Sample Heroicons:', heroFiltered.slice(0, 30));

console.log('\n\nTotal icons:', lucideFiltered.length + heroFiltered.length);
