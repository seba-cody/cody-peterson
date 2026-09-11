export const ironThumos = {
  title: 'The Iron Thūmos and the Empty Vessel',
  subtitle: 'A Homeric Response to “Answer to Job”',
  doi: '10.1080/19342039.2026.2670265',
  fullText: 'https://www.tandfonline.com/doi/full/10.1080/19342039.2026.2670265',
  pdf: 'https://www.tandfonline.com/doi/pdf/10.1080/19342039.2026.2670265',
  companion: 'https://www.seba.health/library/ancient-roots/peterson-iron-thumos-empty-vessel/',
};
export const ironThumosSchema = {
  '@type': 'ScholarlyArticle',
  '@id': `https://doi.org/${ironThumos.doi}`,
  name: `${ironThumos.title}: ${ironThumos.subtitle}`,
  author: { '@id': 'https://www.cody-peterson.com/#person' },
  url: ironThumos.fullText,
  identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: ironThumos.doi },
  datePublished: '2026-09-09',
  pagination: '103–117',
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  publisher: { '@type': 'Organization', name: 'Taylor & Francis' },
  isPartOf: { '@type': 'PublicationIssue', issueNumber: '3', isPartOf: {
    '@type': 'PublicationVolume', volumeNumber: '20', isPartOf: {
      '@type': 'Periodical', name: 'Jung Journal: Culture & Psyche', issn: '1934-2039',
    },
  } },
};
