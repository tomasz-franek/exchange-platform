package org.exchange.app.backend.common.pdfs;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.ExceptionConverter;
import com.itextpdf.text.Image;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
public class PdfTableHeader extends PdfPageEventHelper {

  @Setter
  private String header;
  @Setter
  private String generateDate;
  private PdfTemplate total;

  @Override
  public void onOpenDocument(PdfWriter writer, Document document) {
    total = writer.getDirectContent().createTemplate(30, 16);
  }

  @Override
  public void onEndPage(PdfWriter writer, Document document) {

    PdfPTable table = new PdfPTable(4);
    try {
      table.setWidths(new int[]{20, 20, 20, 2});
      table.setTotalWidth(527);
      table.setLockedWidth(true);
      table.getDefaultCell().setFixedHeight(20);
      table.getDefaultCell().setBorder(Rectangle.BOTTOM);
      table.addCell(header);

      PdfPCell cellDate = new PdfPCell(new Phrase(generateDate));
      cellDate.setBorder(Rectangle.BOTTOM);
      cellDate.setVerticalAlignment(Element.ALIGN_BOTTOM);
      table.addCell(cellDate);
      table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);
      table.addCell(String.format("Page %d of", writer.getPageNumber()));
      PdfPCell cell = new PdfPCell(Image.getInstance(total));
      cell.setBorder(Rectangle.BOTTOM);
      table.addCell(cell);
      table.writeSelectedRows(0, -1, 34, 803, writer.getDirectContent());
    } catch (DocumentException | ExceptionConverter ex) {
      throw new ExceptionConverter(ex);
    }
  }

  @Override
  public void onCloseDocument(PdfWriter writer, Document document) {
    ColumnText
        .showTextAligned(total, Element.ALIGN_LEFT,
            new Phrase(String.valueOf(writer.getPageNumber())), 2, 2, 0);
  }

}