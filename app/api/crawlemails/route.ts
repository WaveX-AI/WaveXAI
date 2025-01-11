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
  } catch {
    return url;
  }
}

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
  } catch {
    console.log(`Sitemap not found for ${baseUrl}`);
  }

  return Array.from(urls);
}

async function crawlPage(url: string): Promise<string[]> {
  try {
    console.log(`Crawling URL: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(response.data);
    
    // Remove unnecessary elements
    $('script, style, noscript, iframe, img, svg').remove();
    
    // First check mailto links
    const mailtoEmails = $('a[href^="mailto:"]')
      .map((_, element) => {
        const href = $(element).attr('href');
        return href ? href.replace('mailto:', '').split('?')[0] : null;
      })
      .get()
      .filter(Boolean);

    // Get emails from text content
    const textEmails = extractEmails($('body').text());
    
    const foundEmails = [...new Set([...mailtoEmails, ...textEmails])]
      .filter(isValidEmail)
      .map(email => email.toLowerCase());

    console.log(`Found ${foundEmails.length} emails on ${url}`);
    return foundEmails;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error crawling ${url}:`, error.message);
    } else {
      console.log(`Error crawling ${url}:`, error);
    }
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

    let totalEmailsFound = 0;
    const processedEmails = new Map<string, Set<string>>();

    // Process matches sequentially to avoid overwhelming the target servers
    for (const match of matches) {
      try {
        if (!match.website) continue;
        
        console.log(`Processing match website: ${match.website}`);
        const websiteUrl = normalizeUrl(match.website);
        const urls = await getImportantUrls(websiteUrl);
        
        const matchEmails = new Set<string>();
        
        // Process URLs in parallel with a smaller batch size
        const urlBatchSize = 2;
        for (let i = 0; i < urls.length; i += urlBatchSize) {
          const urlBatch = urls.slice(i, i + urlBatchSize);
          const batchEmails = await Promise.all(urlBatch.map(url => crawlPage(url)));
          
          batchEmails.flat().forEach(email => {
            // Filter out common non-personal emails
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
            
            if (!excludePatterns.some(pattern => email.toLowerCase().includes(pattern))) {
              matchEmails.add(email);
            }
          });
        }

        // Store emails for this match
        processedEmails.set(match.id, matchEmails);
        totalEmailsFound += matchEmails.size;

        // Save to database
        if (matchEmails.size > 0) {
          await prisma.$transaction(
            Array.from(matchEmails).map(email =>
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

      } catch (error) {
        console.error(`Error processing match ${match.id}:`, error);
      }
    }

    // Prepare response with all found emails
    const allEmails = new Set<string>();
    processedEmails.forEach(emails => {
      emails.forEach(email => allEmails.add(email));
    });

    return NextResponse.json({
      success: true,
      message: "Email collection completed",
      count: totalEmailsFound,
      emails: Array.from(allEmails),
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