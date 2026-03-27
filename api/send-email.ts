// File: pages/api/send-reservation.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, whatsapp } = req.body;

    if (!name || !email || !whatsapp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Descargar el PDF desde Google Drive
    const pdfUrl = 'https://drive.google.com/uc?export=download&id=14xlI5iMy_FBecufwB-WBweEgCSY46RgL';
    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      throw new Error('No se pudo descargar el PDF');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    const data = await resend.emails.send({
      from: 'Marola Travel <hola@marolatrips.com>',
      to: [process.env.CONTACT_EMAIL],
      subject: 'Nueva reserva Marola 🌴',
      html: `
        <h2>Nueva reserva</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      `,
      attachments: [
        {
          filename: 'ITINERARIO UBATUBA 2026.pdf',
          content: pdfBase64,
        },
      ],
    });

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}
