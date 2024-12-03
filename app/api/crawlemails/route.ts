/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

// Helper functions remain the same
function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(text.match(emailRegex) || [])];
}

function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function normalizeUrl(url: string): string {
  try {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    const urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname.replace(/\/$/, '');
  } catch (e) {
    return url;
  }
}

// Optimized to fetch important URLs faster
async function getImportantUrls(baseUrl: string): Promise<string[]> {
  const urls = new Set<string>();
  const normalizedBaseUrl = normalizeUrl(baseUrl);
  const importantPaths = [
    '/contact',
    '/about',
    '/team',
    '/about-us',
    '/contact-us',
    '/people',
    '/leadership',
    '/management',
    '/our-team',
    '/executives'
  ];

  // Add base URL and important paths
  urls.add(normalizedBaseUrl);
  importantPaths.forEach(path => urls.add(`${normalizedBaseUrl}${path}`));

  // Try to get sitemap only if we haven't found enough URLs
  try {
    const response = await axios.get(`${normalizedBaseUrl}/sitemap.xml`, {
      timeout: 2000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    if (response.status === 200) {
      const $ = cheerio.load(response.data, { xmlMode: true });
      $('loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url && importantPaths.some(path => url.toLowerCase().includes(path))) {
          urls.add(url);
        }
      });
    }
  } catch (error) {
    // Silently fail - we already have our important URLs
  }

  return Array.from(urls);
}

// Optimized crawlPage with faster processing
async function crawlPage(url: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 3000,
      signal: controller.signal,
      validateStatus: (status) => status === 200,
    });

    clearTimeout(timeout);

    const $ = cheerio.load(response.data);
    
    // Remove unnecessary elements and get text content
    $('script, style, noscript, iframe, img, svg, .footer, footer').remove();
    
    // First check mailto links as they're more likely to be valid
    const mailtoEmails = $('a[href^="mailto:"]')
      .map((_, element) => {
        const href = $(element).attr('href');
        return href ? href.replace('mailto:', '').split('?')[0] : null;
      })
      .get()
      .filter(Boolean);

    // Only scan text content if we haven't found enough emails
    const textEmails = mailtoEmails.length < 3 ? extractEmails($('body').text()) : [];
    
    return [...new Set([...mailtoEmails, ...textEmails])]
      .filter(isValidEmail)
      .map(email => email.toLowerCase());
  } catch (error) {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startupId } = body;

    if (!startupId) {
      return NextResponse.json(
        { success: false, error: "Startup ID is required" },
        { status: 400 }
      );
    }

    const matches = await prisma.match.findMany({
      where: { startupId: startupId },
      select: {
        id: true,
        website: true,
      }
    });

    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { success: false, error: "No matches found for this startup" },
        { status: 404 }
      );
    }

    const allEmails = new Set<string>();
    const errors: string[] = [];
    let processedMatches = 0;
    const totalMatches = matches.length;

    // Process all matches in parallel with optimized concurrency
    const batchSize = 5; // Process 5 matches at a time
    for (let i = 0; i < matches.length; i += batchSize) {
      const batchMatches = matches.slice(i, i + batchSize);
      
      await Promise.all(batchMatches.map(async (match) => {
        try {
          if (!match.website) return;
          
          const websiteUrl = normalizeUrl(match.website);
          const urls = await getImportantUrls(websiteUrl);
          
          // Process URLs in parallel with a concurrency limit
          const urlBatchSize = 3; // Process 3 URLs at a time
          for (let j = 0; j < urls.length; j += urlBatchSize) {
            const urlBatch = urls.slice(j, j + urlBatchSize);
            const batchEmails = await Promise.all(urlBatch.map(url => crawlPage(url)));
            batchEmails.flat().forEach(email => allEmails.add(email));
          }

          // Filter and store valid emails
          const matchEmails = Array.from(allEmails).filter(email => {
            const excludePatterns = [
              'noreply',
              'no-reply',
              'donotreply',
              'support@',
              'info@',
              'sales@',
              'marketing@',
              'webmaster@',
              'hello@',
              'contact@'
            ];
            return !excludePatterns.some(pattern => email.toLowerCase().includes(pattern));
          });

          if (matchEmails.length > 0) {
            await prisma.$transaction(
              matchEmails.map(email =>
                prisma.investorEmail.upsert({
                  where: {
                    matchId_email: {
                    matchId: match.id,
                    email: email
                    }
                  },
                  update: {},
                  create: {
                    matchId: match.id,
                    email: email,
                    status: 'valid'
                  }
                })
              )
            );
          }

          processedMatches++;

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Error processing match ${match.id}: ${errorMessage}`);
        }
      }));
    }

    const uniqueEmails = Array.from(allEmails);

    return NextResponse.json({
      success: true,
      message: "Email collection completed",
      count: uniqueEmails.length,
      emails: uniqueEmails,
      errors: errors.length > 0 ? errors : undefined,
      progress: 100
    });

  } catch (error) {
    console.error('Crawler error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to collect emails. Please try again later." 
      },
      { status: 500 }
    );
  }
}