import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { StudentAttendanceRecord } from '../types';

interface WordExportOptions {
  records: StudentAttendanceRecord[];
  filterLabel: string;
  exportedAtWib: string;
  stats: {
    total: number;
    hadir: number;
    ijin: number;
    alpa: number;
  };
}

const BORDER_COLOR = 'CBD5E1';
const HEADER_BLUE = '0A5EA8';

const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
};

function makeHeaderCell(text: string, widthPct: number) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { fill: HEADER_BLUE, type: ShadingType.CLEAR, color: 'auto' },
    borders: cellBorders,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 19,
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

function makeBodyCell(
  text: string,
  widthPct: number,
  options?: { bold?: boolean; color?: string; fill?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }
) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: options?.fill ? { fill: options.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: options?.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: options?.bold || false,
            color: options?.color || '1E293B',
            size: 18,
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

export async function exportAttendanceToWord({
  records,
  filterLabel,
  exportedAtWib,
  stats,
}: WordExportOptions): Promise<Blob> {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      makeHeaderCell('No', 5),
      makeHeaderCell('Nama Siswa', 20),
      makeHeaderCell('Kelas', 9),
      makeHeaderCell('Mata Pelajaran', 17),
      makeHeaderCell('Hari', 9),
      makeHeaderCell('Tanggal', 12),
      makeHeaderCell('Jam', 12),
      makeHeaderCell('Status', 8),
      makeHeaderCell('Keterangan', 8),
    ],
  });

  const dataRows =
    records.length === 0
      ? [
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 9,
                borders: cellBorders,
                margins: { top: 140, bottom: 140, left: 120, right: 120 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'Belum ada data absensi pada pilihan ini.',
                        italics: true,
                        color: '64748B',
                        size: 19,
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ]
      : records.map((rec, idx) => {
          const rowFill = idx % 2 === 1 ? 'F8FAFC' : undefined;
          const statusColor =
            rec.status === 'HADIR' ? '047857' : rec.status === 'IJIN' ? 'B45309' : 'BE123C';
          const subjectLabel = rec.lessonPeriod || 'PENDIDIKAN PANCASILA';

          return new TableRow({
            children: [
              makeBodyCell(String(idx + 1), 5, { fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(rec.studentName, 20, { bold: true, fill: rowFill }),
              makeBodyCell(rec.className, 9, { bold: true, color: '0A5EA8', fill: rowFill }),
              makeBodyCell(subjectLabel, 17, { fill: rowFill }),
              makeBodyCell(rec.dayName, 9, { fill: rowFill }),
              makeBodyCell(rec.dateStr, 12, { fill: rowFill }),
              makeBodyCell(rec.timeStr, 12, { fill: rowFill }),
              makeBodyCell(rec.status, 8, { bold: true, color: statusColor, fill: rowFill }),
              makeBodyCell(rec.note || '-', 8, { fill: rowFill }),
            ],
          });
        });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'SMA NEGERI 1 MANDE',
                bold: true,
                size: 32,
                color: HEADER_BLUE,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 12, color: HEADER_BLUE, space: 6 },
            },
            children: [
              new TextRun({
                text: 'Rekap Absensi Digital · Mata Pelajaran PENDIDIKAN PANCASILA',
                size: 21,
                color: '475569',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: 'Filter Data: ', bold: true, size: 19, color: '334155', font: 'Calibri' }),
              new TextRun({ text: filterLabel, size: 19, color: '334155', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'Waktu Unduh: ', bold: true, size: 19, color: '334155', font: 'Calibri' }),
              new TextRun({ text: exportedAtWib, size: 19, color: '334155', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({ text: 'Ringkasan: ', bold: true, size: 19, color: '334155', font: 'Calibri' }),
              new TextRun({
                text: `HADIR: ${stats.hadir}  |  IJIN: ${stats.ijin}  |  ALPA: ${stats.alpa}  |  TOTAL: ${stats.total}`,
                bold: true,
                size: 19,
                color: HEADER_BLUE,
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 360, after: 40 },
            children: [
              new TextRun({
                text: 'Mande, Cianjur — Guru Pengampu Pendidikan Pancasila',
                size: 19,
                color: '334155',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 420, after: 20 },
            children: [
              new TextRun({
                text: 'Munawar Rois, S.Pd.',
                bold: true,
                size: 20,
                color: '0F172A',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'NIP. 19710815 199802 1 004',
                size: 18,
                color: '475569',
                font: 'Calibri',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}
