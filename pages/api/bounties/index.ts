import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.PEERME_API_KEY;
    if (!apiKey) {
      console.error("PeerMe API key is not configured.");
      return res.status(500).json({ 
        error: "Configuration error: PeerMe API key is not set.",
        bounties: []
      });
    }

    const response = await fetch(
      `https://api.peerme.io/v1/bounties?page=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json", 
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching data from PeerMe API:", response.status, errorText);
      return res.status(response.status).json({
        error: `Failed to fetch bounties. PeerMe API returned: ${response.status}. ${errorText}`,
        bounties: []
      });
    }

    const data = await response.json();
    // The PeerMe API returns a data array containing the bounties
    const bounties = data.data || [];

    return res.status(200).json({
      bounties,
      error: null
    });
  } catch (err: any) {
    console.error("Network or other error in bounties API:", err);
    return res.status(500).json({
      error: `An unexpected error occurred: ${err.message}`,
      bounties: []
    });
  }
} 