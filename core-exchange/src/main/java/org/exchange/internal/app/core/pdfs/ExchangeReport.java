package org.exchange.internal.app.core.pdfs;


import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.exchange.app.backend.common.pdfs.PdfDocumentBasic;
import org.exchange.app.backend.common.pdfs.PdfTableHeader;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExchangeReport extends PdfDocumentBasic {

  private static final BaseColor colorHeader = new BaseColor(0xE5E4E2);
  @Autowired
  private PdfTableHeader pdfTableHeader;

  public void generateExchangeReport(final String fileName, ExchangeDataResult exchangeResult)
      throws DocumentException, IOException {

    Document document = prepareStandardDocument();
    try (FileOutputStream fileOutputStream = new FileOutputStream(fileName)) {
      PdfWriter writer = PdfWriter.getInstance(document, fileOutputStream);

      pdfTableHeader.setHeader("Exchange report");
      DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      pdfTableHeader.setGenerateDate(df.format(new Date()));
      writer.setPageEvent(pdfTableHeader);

      document.open();
      document.add(prepareTable(List.of(exchangeResult.getSourceTicket())));
      document.add(getLineSeparator());
      document.add(Chunk.NEWLINE);
      document.add(Chunk.NEWLINE);
      document.add(Chunk.NEWLINE);
      document.add(prepareTable(exchangeResult.getExchangeCoreTicketList()));
      document.close();
    }
  }

  private Element prepareTable(List<CoreTicket> exchangeTickets)
      throws DocumentException, IOException {
    DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
    PdfPTable table = createTable(2, 2, 2, 2);
    table.setHorizontalAlignment(Element.ALIGN_CENTER);
    addCellCenter(table, "Currency");
    addCellCenter(table, "Amount");
    addCellCenter(table, "Ratio");
    addCellCenter(table, "Date");

    if (exchangeTickets != null) {
      for (CoreTicket row : exchangeTickets) {
        addCell(table, row.getIdCurrency(), colorHeader);
        addCell(table, String.valueOf(row.getAmount()), colorHeader);
        addCell(table, String.valueOf(row.getRatio()), colorHeader);
        addCell(table, String.valueOf(row.getEpochUTC()), colorHeader);
      }
    }
    return table;
  }

}