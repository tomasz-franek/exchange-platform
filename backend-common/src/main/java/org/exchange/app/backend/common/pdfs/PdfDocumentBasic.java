package org.exchange.app.backend.common.pdfs;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.draw.LineSeparator;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

public class PdfDocumentBasic {

  private static final int NORMAL_FONT_SIZE = 8;
  private static final int WIDTH_PERCENTAGE = 100;
  private static final int PAGE_MARGIN = 36;
  private static final int PAGE_MARGIN_DOUBLE = 72;

  public PdfDocumentBasic() {
  }

  public static BaseFont getBaseFont() throws DocumentException, IOException {
    return BaseFont.createFont();
  }


  private PdfPCell createCell(String phaseText, int size) throws DocumentException, IOException {
    return new PdfPCell(new Phrase(phaseText, new Font(getBaseFont(), size)));
  }

  private PdfPCell createCell(String phaseText) throws DocumentException, IOException {
    return createCell(phaseText, NORMAL_FONT_SIZE);
  }

  protected void addCell(PdfPTable table, String phaseText) throws DocumentException, IOException {
    table.addCell(new Phrase(phaseText, new Font(getBaseFont(), NORMAL_FONT_SIZE)));
  }


  protected void addCellCenter(PdfPTable table, String phaseText)
      throws DocumentException, IOException {
    PdfPCell cell = new PdfPCell(new Phrase(phaseText, new Font(getBaseFont(), NORMAL_FONT_SIZE)));
    alignCenterMiddle(cell);
    table.addCell(cell);
  }

  protected void addCell(PdfPTable table, String phaseText, BaseColor color)
      throws DocumentException, IOException {
    PdfPCell cell = createCell(phaseText);
    cell.setBackgroundColor(color);
    alignCenterMiddle(cell);
    table.addCell(cell);
  }

  protected String bigDecimal2String(BigDecimal value) {
    return bigDecimal2String(value, null);
  }

  protected LineSeparator getLineSeparator() {
    return new LineSeparator(1f, 100, null, 0, -5);
  }

  protected String bigDecimal2String(BigDecimal value, String format) {
    if (null == value) {
      return "";
    }

    DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance();
    symbols.setGroupingSeparator(' ');
    symbols.setDecimalSeparator(',');
    String decFormat = "###,##0.00";
    if (format != null) {
      decFormat = format;
    }
    DecimalFormat formatter = new DecimalFormat(decFormat, symbols);
    return formatter.format(value);
  }

  protected void alignCenterMiddle(PdfPCell cell) {
    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
  }


  protected PdfPTable createTable(int... widths) throws DocumentException {
    PdfPTable pdfPTable = new PdfPTable(widths.length);
    pdfPTable.setWidthPercentage(WIDTH_PERCENTAGE);
    pdfPTable.setWidths(widths);
    return pdfPTable;
  }


  protected Document prepareStandardDocument() {
    return new Document(PageSize.A4, PAGE_MARGIN, PAGE_MARGIN, PAGE_MARGIN_DOUBLE, PAGE_MARGIN);
  }
}
