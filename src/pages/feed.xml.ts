import { ironThumos } from '../data/iron-thumos';
export const prerender = true;

// Public posts, newest first. Each entry links a page on this site; include the
// DOI in the body so citation trackers such as Altmetric can match the post.
const site = 'https://www.cody-peterson.com';
const doiURL = `https://doi.org/${ironThumos.doi}`;
const entries = [
  {
    title: `${ironThumos.title}: ${ironThumos.subtitle}`,
    path: '/iron-thumos/',
    date: '2026-09-10T12:00:00Z',
    summary: 'Cody Peterson’s open-access essay in Jung Journal: Culture & Psyche on Homer, endurance, and Jung’s Answer to Job.',
    html: `<p>Calypso offers Odysseus a life without aging or death. He chooses the dangerous journey home. That choice opens a question at the heart of this essay: what becomes possible for the soul because a human life has limits?</p>
<p>I follow Homer’s language of feeling and endurance into a conversation with Jung’s <em>Answer to Job</em>. The argument turns on three conditions of mortal life—permanent loss, radical uncertainty, and utter powerlessness—and on what the soul may acquire through bearing them.</p>
<p>Peterson, Cody. 2026. “The Iron Thūmos and the Empty Vessel: A Homeric Response to ‘Answer to Job.’” <em>Jung Journal: Culture &amp; Psyche</em> 20 (3): 103–117. <a href="${doiURL}">${doiURL}</a></p>
<p><a href="${ironThumos.fullText}">Read the essay free at Taylor &amp; Francis</a></p>`,
  },
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const items = entries.map(e => `    <item>
      <title>${esc(e.title)}</title>
      <link>${site}${e.path}</link>
      <guid isPermaLink="true">${site}${e.path}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <dc:creator>Cody Peterson</dc:creator>
      <description>${esc(e.summary)}</description>
      <content:encoded><![CDATA[${e.html}]]></content:encoded>
    </item>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Cody Peterson</title>
    <link>${site}/</link>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Writing and research by Cody Peterson: Homer, depth psychology, and recovery.</description>
    <language>en</language>
    <lastBuildDate>${new Date(entries[0].date).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
