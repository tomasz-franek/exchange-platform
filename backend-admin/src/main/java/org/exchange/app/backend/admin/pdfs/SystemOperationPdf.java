package org.exchange.app.backend.admin.pdfs;

import com.lowagie.text.DocumentException;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.backend.common.utils.NormalizeUtils;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Log4j2
public class SystemOperationPdf {

  private static final String htmlHead =
      """
          <html>
          			<head>
          			  <title>System Operations</title>
          			  <style>
          			  /* page header */
                  @page{
                      @bottom-left {
                          content: element(footer);
                          vertical-align: top;
                          padding-top: 10px;
                      }
                      @top-right {
                          content: element(header);
                          vertical-align: bottom;
                          padding-bottom: 10px;
                      }
                      size: A4 portrait;
                      margin-top:1.5cm;
                      margin-left:2cm;
                      margin-right:2cm;
                      margin-bottom:1.5cm;
                  }
                  div.header {
                      display: block;
                      position: running(header);
                      border-bottom: 1px solid black;
                  }
                  div.footer {
                      margin-top: 0cm;
                      display: block;
                      position: running(footer);
                      border-top: 1px solid black;
                  }
                  div.content {
                      display: block;
                      width: 16.4cm;
                      text-align: justify;
                  }
                  #pagenumber:before {
                      content: counter(page);
                  }
                  #pagecount:before {
                      content: counter(pages);
                  }
          			  /* table detail-table */
                  table.exchange { clear: both; width: 100%; }
                  table.exchange th { font-weight: bold; text-align: center; }
                  table.exchange td:nth-child(1) { text-align: left; width: 40%; }
                  table.exchange td:nth-child(2) { text-align: right; width: 30%; }
                  table.exchange td:nth-child(3) { text-align: right; width: 30%; }
                  /* table border */
                  table, th, td {
                    border: 1px solid black;
                    border-collapse: collapse;
                  }
                  tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                  }
          			  </style>
          			</head>
          """;
  private static final String notes = """
      <notes>
      	<div>
      		<p>Generated date: %s UTC</p>
      	</div>
      </notes>
      """;
  //todo better table look
  private final static String htmlDocument =
      """
          <body>
          <header>
          	<div class="header">System account operations document</div>
          
            <div class="footer" >
                <p>Page <span id="pagenumber"></span> of <span id="pagecount"></span></p>/
            </div>
          </header>
          <table class="exchange">
            <thead>
            <tr>
              <th><span>Date</span></th>
              <th><span>Operation</span></th>
              <th><span>Amount</span></th>
            </tr>
            </thead>
            <tbody>
            %s
            </tbody>
          </table>
          %s
          </body>
          </html>
          """;


  public static ByteArrayOutputStream generatePdf(List<AccountOperation> operations)
      throws DocumentException {
    ITextRenderer renderer = new ITextRenderer();
    String documentHtml = htmlHead + String.format(
        htmlDocument,
        prepareOperationRows(operations),
        prepareNotes(Clock.system(ZoneOffset.UTC))
    );
    renderer.setDocumentFromString(
        documentHtml
    );
    renderer.layout();
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    renderer.createPDF(bos);
    return bos;
  }

  public static String prepareOperationRows(List<AccountOperation> operations) {

    if (operations == null) {
      return "";
    }
    StringBuilder builder = new StringBuilder();
    for (AccountOperation operation : operations) {
      builder.append("<tr>\n");
      builder.append("<td>");
      builder.append(operation.getDateUtc().toString().substring(0, 19).replace("T", " "));
      builder.append("</td>\n");
      builder.append("<td>");
      builder.append(operation.getEventType().toString());
      builder.append("</td>\n");
      builder.append("<td>");
      builder.append(NormalizeUtils.normalizeValueToMoney(operation.getAmount()));
      builder.append(" ");
      builder.append(operation.getCurrency());
      builder.append("</td>\n");
      builder.append("</tr>\n");
    }
    return builder.toString();
  }

  private static String prepareNotes(Clock clock) {
    String stringDateTime = Instant.now(clock).toString().substring(0, 19).replace("T", " ");
    return String.format(notes, stringDateTime);
  }
}
