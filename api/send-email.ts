import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, email, whatsapp } = req.body;

  try {
    await resend.emails.send({
      from: "Marola <hola@marolatrips.com>",
      to: [email],
      subject: "Tu viaje a Ubatuba 🌊",
      html: `
        <h2>Hola ${name}!</h2>
        <p>Ya estás un paso más cerca de Ubatuba.</p>
        <p>Te dejamos la propuesta del viaje acá 👇</p>
      `,
      attachments: [
        {
          filename: "marola-ubatuba.pdf",
          path: "https://TU-DOMINIO.com/pdf/marola.pdf"
        }
      ]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
