import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { tipoFormulario, ...detalles } = body; //Separamos el título del resto de datos

    //Generamos las filas del correo
    const filasHtml = Object.entries(detalles)
      .map(([campo, valor]) => `<p><strong>${campo.toUpperCase()}:</strong> ${valor}</p>`)
      .join('');

    const { data, error } = await resend.emails.send({
      from: 'NEWTEX Notifications <onboarding@resend.dev>',
      to: ['equipo.newtex@gmail.com'],
      subject: `Nueva solicitud: ${tipoFormulario}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Nueva entrada desde la web</h1>
          <p>Se ha recibido una solicitud de tipo: <strong>${tipoFormulario}</strong></p>
          <hr />
          ${filasHtml}
          <hr />
          <p style="font-size: 12px; color: #888;">Enviado el: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}