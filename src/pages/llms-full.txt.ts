import { papers } from '../data/publications';
export const prerender = true;
export function GET() {
  const text = `# Cody Peterson: research, writing, and public projects

Canonical website: https://www.cody-peterson.com/
Updated: 2026-09-10
Contact: cody@seba.health
ORCID: https://orcid.org/0009-0009-2028-0154

## Biography
Cody Peterson is a trickster. He is a writer and independent depth psychology researcher working at the border of Homeric philology and archetypal psychology, examining what inherited language preserves of feeling and the formation of value. He designs AI-assisted research programmes and founded Seba.Health. He studies psychology at the University of Utah and has been accepted to a master's programme at Adams State University beginning January 2027. This is a scholarly and author website, not an offer of licensed clinical practice.

## Research
The Homeric research joins close reading to reproducible corpus analysis. It asks how grammar distributes feeling, agency, and the result of endurance, and how later translations and psychological readings interpret those relations. Original-language evidence, translations, reception, corpus observations, and psychological interpretation remain distinct. A grammatical distribution does not by itself prove a psychological theory. The comparison does not assume a linear decline across translations.
Research page: https://www.cody-peterson.com/research/

## AI use
AI assists with source discovery, research organization, software development, and testing proposed readings. Generated output is provisional working material, not a source. Claims must return to named editions and passages. Cody takes responsibility for judgments, arguments, and final wording.

## Publications
The Shadow of a Figure of Light: The Archetype of the Alcoholic and the Journey to Enlightenment. Chiron Publications, 2024. Published book on Jung, Bill Wilson, the Twelve Steps, and recovery.
Book page: https://www.cody-peterson.com/book/
${papers.map(p => `\n${p.title}\nStatus: ${p.status}\n${p.citation}\n${p.description}${p.href ? `\n${new URL(p.href, 'https://www.cody-peterson.com/').href}` : ''}${'publisherHref' in p ? `\nFull text: ${p.publisherHref}\nDOI: 10.1080/19342039.2026.2670265\nPublished online: 2026-09-09` : ''}`).join('\n')}

## Public projects
Seba.Health (https://www.seba.health/) brings together depth-psychology research resources, study tools, and a practitioner directory. It operates on a not-for-profit basis; this does not establish registered charitable status. Sebastian offers AI-assisted exploratory conversations about texts, dreams, and images, not clinical care. A practitioner listing does not imply endorsement of Cody's scholarship or Sebastian.

Logoi — coming soon. A philological workbench in development alongside the Homeric research, intended for reading, corpus search, word study, comparison, and usage analysis. It is still taking shape.

## Other pages
Biography and recovery memoir: https://www.cody-peterson.com/about/
Lecture and workshop archive: https://www.cody-peterson.com/videos/
Interviews and podcasts: https://www.cody-peterson.com/media/

Murray Stein's endorsement concerns The Shadow of a Figure of Light. It should not be treated as an endorsement of other research, Seba, or AI tools.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
