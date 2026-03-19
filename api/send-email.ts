import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  const resend = new Resend(process.env.RESEND_API_KEY);

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

    const data = await resend.emails.send({
      from: 'Marola Travel <hola@marolatrips.com>',
      to: ['TUEMAIL@gmail.com'],
      subject: 'Nueva reserva Marola 🌴',
      html: `
        <h2>Nueva reserva</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      `,
    });

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}
