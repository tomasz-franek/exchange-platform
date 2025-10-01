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
  private final static String htmlDocument =
      """
          <body>
          <header>
          	<h1>System account operations document</h1>
          </header>
          <table class="exchange">
            <thead>
            <tr>
              <th><span>Date</span></th>
              <th><span>Amout</span></th>
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
