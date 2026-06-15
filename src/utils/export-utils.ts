import { utils, writeFile } from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Products")
  writeFile(workbook, `${fileName}.xlsx`)
}

export const exportToPDF = (data: any[], title: string, fileName: string) => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  
  const headers = Object.keys(data[0] || {}).map(h => h.toUpperCase())
  const rows = data.map(item => Object.values(item))

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    theme: 'grid',
    headStyles: { fillStyle: 'F', fillColor: [0, 53, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save(`${fileName}.pdf`)
}
