import { NextResponse } from 'next/server';

interface Website {
  id: string;
  name: string;
  url: string;
  category: string;
}

const websites: Website[] = [
  {
    id: '1',
    name: 'Satu Data Indonesia',
    url: 'https://data.go.id',
    category: 'Data & Statistik'
  },
  {
    id: '2',
    name: 'DPR RI',
    url: 'https://dpr.go.id',
    category: 'Legislatif'
  },
  {
    id: '3',
    name: 'POLRI',
    url: 'https://polri.go.id',
    category: 'Keamanan'
  },
  {
    id: '4',
    name: 'Kementerian Keuangan',
    url: 'https://kemenkeu.go.id',
    category: 'Ekonomi'
  },
  {
    id: '5',
    name: 'Kementerian Kesehatan',
    url: 'https://kemkes.go.id',
    category: 'Kesehatan'
  },
  {
    id: '6',
    name: 'Kementerian Pendidikan',
    url: 'https://kemdikbud.go.id',
    category: 'Pendidikan'
  },
  {
    id: '7',
    name: 'BPS',
    url: 'https://bps.go.id',
    category: 'Data & Statistik'
  },
  {
    id: '8',
    name: 'Bank Indonesia',
    url: 'https://bi.go.id',
    category: 'Ekonomi'
  },
  {
    id: '9',
    name: 'Kementerian Dalam Negeri',
    url: 'https://kemendagri.go.id',
    category: 'Pemerintahan'
  },
  {
    id: '10',
    name: 'Kementerian Luar Negeri',
    url: 'https://kemlu.go.id',
    category: 'Pemerintahan'
  }
];

// Simple website availability check using fetch
async function checkWebsiteAvailability(url: string): Promise<{ status: 'online' | 'offline'; responseTime?: number }> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD', // Only check headers, don't download content
      signal: controller.signal,
      headers: {
        'User-Agent': 'TungguMonitoring/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return { status: 'online', responseTime };
    } else {
      return { status: 'offline' };
    }
  } catch (error) {
    return { status: 'offline' };
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      websites.map(async (website) => {
        const availability = await checkWebsiteAvailability(website.url);
        return {
          ...website,
          ...availability,
          lastChecked: new Date().toISOString()
        };
      })
    );

    const statusResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // If check failed, return offline status
        return {
          ...websites[index],
          status: 'offline' as const,
          lastChecked: new Date().toISOString()
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: statusResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check website availability',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 