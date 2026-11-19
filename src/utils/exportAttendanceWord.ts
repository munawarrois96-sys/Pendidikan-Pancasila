import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { StudentAttendanceRecord } from '../types';
import { compareAttendanceRecords, SMANDE_OFFICIAL_LOGO_URL } from '../data/attendanceData';

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

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

const kopBottomBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.SINGLE, size: 18, color: HEADER_BLUE },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

async function loadLogoArrayBuffer(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(SMANDE_OFFICIAL_LOGO_URL);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function makeHeaderCell(text: string, widthPct: number, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { fill: HEADER_BLUE, type: ShadingType.CLEAR, color: 'auto' },
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 18,
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
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 75, bottom: 75, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: options?.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: options?.bold || false,
            color: options?.color || '1E293B',
            size: 17,
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
  const sortedRecords = [...records].sort(compareAttendanceRecords);
  const logoBuffer = await loadLogoArrayBuffer();

  const kopCells: TableCell[] = [];
  if (logoBuffer) {
    kopCells.push(
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        borders: kopBottomBorders,
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 40, bottom: 120, left: 40, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                type: 'jpg',
                data: logoBuffer,
                transformation: { width: 64, height: 64 },
              }),
            ],
          }),
        ],
      })
    );
  }

  kopCells.push(
    new TableCell({
      width: { size: logoBuffer ? 86 : 100, type: WidthType.PERCENTAGE },
      borders: kopBottomBorders,
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 40, bottom: 120, left: 40, right: 40 },
      children: [
        new Paragraph({
          spacing: { after: 30 },
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
          spacing: { after: 20 },
          children: [
            new TextRun({
              text: 'Rekap Absensi Digital · Mata Pelajaran PENDIDIKAN PANCASILA',
              bold: true,
              size: 20,
              color: '334155',
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Jl. Arya Wiratanudatar KM 8, Mande, Kab. Cianjur, Jawa Barat',
              size: 17,
              color: '64748B',
              font: 'Calibri',
            }),
          ],
        }),
      ],
    })
  );

  const kopTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorders.top,
      bottom: noBorders.bottom,
      left: noBorders.left,
      right: noBorders.right,
      insideHorizontal: noBorders.top,
      insideVertical: noBorders.left,
    },
    rows: [
      new TableRow({
        children: kopCells,
      }),
    ],
  });

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      makeHeaderCell('No', 5, AlignmentType.CENTER),
      makeHeaderCell('Nama Siswa', 21),
      makeHeaderCell('Kelas', 8, AlignmentType.CENTER),
      makeHeaderCell('Mata Pelajaran', 16),
      makeHeaderCell('Hari', 8),
      makeHeaderCell('Tanggal', 12, AlignmentType.CENTER),
      makeHeaderCell('Jam', 13, AlignmentType.CENTER),
      makeHeaderCell('Status', 8, AlignmentType.CENTER),
      makeHeaderCell('Keterangan', 9),
    ],
  });

  const dataRows =
    sortedRecords.length === 0
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
      : sortedRecords.map((rec, idx) => {
          const rowFill =
            rec.status === 'HADIR' ? 'ECFDF5' : rec.status === 'IJIN' ? 'FFFBEB' : 'FFF1F2';
          const statusColor =
            rec.status === 'HADIR' ? '047857' : rec.status === 'IJIN' ? 'B45309' : 'BE123C';
          const subjectLabel = rec.lessonPeriod || 'PENDIDIKAN PANCASILA';

          return new TableRow({
            cantSplit: true,
            children: [
              makeBodyCell(String(idx + 1), 5, { fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(rec.studentName, 21, { bold: true, fill: rowFill }),
              makeBodyCell(rec.className, 8, { bold: true, color: '0A5EA8', fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(subjectLabel, 16, { fill: rowFill }),
              makeBodyCell(rec.dayName, 8, { fill: rowFill }),
              makeBodyCell(rec.dateStr, 12, { fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(rec.timeStr, 13, { fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(rec.status, 8, { bold: true, color: statusColor, fill: rowFill, align: AlignmentType.CENTER }),
              makeBodyCell(rec.note || '-', 9, { fill: rowFill }),
            ],
          });
        });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 650, bottom: 650, left: 650, right: 650 },
          },
        },
        children: [
          kopTable,
          new Paragraph({
            spacing: { before: 160, after: 40 },
            children: [
              new TextRun({ text: 'Filter Data: ', bold: true, size: 18, color: '334155', font: 'Calibri' }),
              new TextRun({ text: filterLabel, size: 18, color: '334155', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'Urutan Data: ', bold: true, size: 18, color: '334155', font: 'Calibri' }),
              new TextRun({ text: 'Kelas (X-1 s.d. XII-10) → Nama Siswa (A–Z) → Tanggal & Jam', size: 18, color: '334155', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'Waktu Unduh: ', bold: true, size: 18, color: '334155', font: 'Calibri' }),
              new TextRun({ text: exportedAtWib, size: 18, color: '334155', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: 'Ringkasan: ', bold: true, size: 18, color: '334155', font: 'Calibri' }),
              new TextRun({
                text: `HADIR: ${stats.hadir}  |  IJIN: ${stats.ijin}  |  ALPA: ${stats.alpa}  |  TOTAL: ${stats.total}`,
                bold: true,
                size: 18,
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
            spacing: { before: 340, after: 40 },
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
                text: 'NIP. 199611282023211004',
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
