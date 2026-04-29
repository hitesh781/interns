module.exports = async function handler(req, res) {
  try {
    // We fetch jobs directly using Firestore REST API for the serverless function.
    // This avoids needing heavy firebase-admin or client SDK initialization in Edge.
    const project_id = "new-hub-2bf76"; 
    const url = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/jobs`;
    
    let dbJobs = [];
    try {
      // Vercel serverless functions support standard fetch
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.documents) {
          dbJobs = data.documents.map(doc => {
            // Document name is like projects/new-hub-2bf76/databases/(default)/documents/jobs/ID
            const id = doc.name.split('/').pop();
            return { id };
          });
        }
      }
    } catch (e) {
      console.error("Error fetching jobs for sitemap", e);
    }

    const staticJobs = [1, 2, 3, 4, 5, 6, 7, 8].map(id => ({ id }));
    
    const allJobs = [...staticJobs, ...dbJobs];
    const baseUrl = "https://internsbridge.com";

    const jobUrls = allJobs.map(job => `
  <url>
    <loc>${baseUrl}/jobs/${job.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/companies</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${jobUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send("Error generating sitemap");
  }
}
