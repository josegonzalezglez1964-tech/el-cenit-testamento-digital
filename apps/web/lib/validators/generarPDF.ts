import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Testamento } from '@/hooks/useTestamento';

export function generarPDF(testamento: Testamento) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ─── Cabecera ───
  doc.setFillColor(0, 102, 102);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('EL CÉNIT', 105, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Testamento Digital de Tenerife', 105, 26, { align: 'center' });

  // ─── Título ───
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(16);
  doc.text('TESTAMENTO DIGITAL', 105, 48, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Documento generado el ${new Date().toLocaleDateString('es-ES')}`, 105, 55, { align: 'center' });

  let y = 65;

  // ─── Datos del testador ───
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 102);
  doc.text('1. DATOS DEL TESTADOR', 14, y);
  y += 8;

  const datos = testamento.datosIdentidad;
  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: [
      ['Nombre completo', `${datos?.nombre || ''} ${datos?.apellidos || ''}`.trim() || 'No indicado'],
      ['DNI / NIE', datos?.dni || 'No indicado'],
      ['Fecha de nacimiento', datos?.fechaNacimiento || 'No indicada'],
      ['Estado civil', datos?.estadoCivil || 'No indicado'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 102, 102], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── Herederos ───
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 102);
  doc.text('2. HEREDEROS DESIGNADOS', 14, y);
  y += 8;

  if (testamento.herederos.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'DNI', 'Parentesco', 'Tipo', '%']],
      body: testamento.herederos.map((h) => [
        `${h.nombre} ${h.apellidos}`,
        h.dni,
        h.parentesco,
        h.tipo === 'forzoso' ? 'Forzoso' : 'Voluntario',
        `${h.porcentaje}%`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 102], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(10);
    doc.setTextColor(0, 102, 102);
    doc.text(`Total asignado: ${testamento.herederos.reduce((s, h) => s + h.porcentaje, 0)}%`, 14, y);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No se han designado herederos.', 14, y);
  }
  y += 10;

  // ─── Bienes ───
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 102);
  doc.text('3. BIENES Y PATRIMONIO', 14, y);
  y += 8;

  if (testamento.bienes.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Descripción', 'Tipo', 'Referencia', 'Valor estimado']],
      body: testamento.bienes.map((b) => [
        b.descripcion,
        b.tipo,
        b.referencia || '—',
        `${b.valorEstimado.toLocaleString('es-ES')} €`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 102], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 5;
    const total = testamento.bienes.reduce((s, b) => s + b.valorEstimado, 0);
    doc.setFontSize(10);
    doc.setTextColor(0, 102, 102);
    doc.text(`Patrimonio total: ${total.toLocaleString('es-ES')} €`, 14, y);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No se han registrado bienes.', 14, y);
  }
  y += 10;

  // ─── Disposiciones ───
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 102);
  doc.text('4. DISPOSICIONES ESPECIALES', 14, y);
  y += 8;

  const disp = testamento.disposiciones;
  autoTable(doc, {
    startY: y,
    head: [['Disposición', 'Valor']],
    body: [
      ['Albacea', disp?.albacea || 'No designado'],
      ['Testamento vital', disp?.testamentoVital ? 'Sí' : 'No'],
      ['Tutela de menores', disp?.tutelaMenores || 'No designada'],
      [
        'Legado solidario',
        disp?.legadoSolidario
          ? `${disp.legadoSolidario.ong} (${disp.legadoSolidario.porcentaje}%)`
          : 'No designado',
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 102, 102], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── Firma y blockchain ───
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 102);
  doc.text('5. FIRMA Y REGISTRO', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(33, 33, 33);
  doc.text(`Estado del documento: ${testamento.estado.toUpperCase()}`, 14, y);
  y += 6;
  if (testamento.hashDocumento) {
    doc.text(`Hash del documento: ${testamento.hashDocumento}`, 14, y);
    y += 6;
  }
  if (testamento.blockchainTx) {
    doc.text(`Transacción blockchain (Alastria): ${testamento.blockchainTx}`, 14, y);
    y += 6;
  }
  if (testamento.selloTiempo) {
    doc.text(`Sello de tiempo: ${testamento.selloTiempo}`, 14, y);
    y += 6;
  }

  // ─── Pie legal ───
  y += 10;
  doc.setDrawColor(0, 102, 102);
  doc.line(14, y, 196, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Este documento ha sido generado a través de la plataforma El Cénit (Testamento Digital de Tenerife).',
    105,
    y,
    { align: 'center' }
  );
  y += 5;
  doc.text(
    'Conforme al artículo 25 de la Ley 59/2003, de 19 de diciembre, de firma electrónica.',
    105,
    y,
    { align: 'center' }
  );

  // Guardar
  const nombreArchivo = `Testamento_${datos?.nombre || 'Digital'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nombreArchivo);
}