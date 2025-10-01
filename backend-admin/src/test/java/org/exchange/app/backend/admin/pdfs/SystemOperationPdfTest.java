package org.exchange.app.backend.admin.pdfs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.backend.admin.CoreTestAdminConfiguration;
import org.exchange.app.backend.common.pdfs.ExchangeReportPdf;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {CoreTestAdminConfiguration.class})
class SystemOperationPdfTest {

  @Autowired
  private Clock clock;

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithSystemOperations()
      throws IOException {
    List<AccountOperation> operations = new ArrayList<>();
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), 100L, "EUR"));
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), 200L, "EUR"));
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), -4500L, "EUR"));
    String filePath = File.createTempFile("testAccountOperations-", ".pdf").getPath();
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      SystemOperationPdf.generatePdf(operations).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertTrue(file.exists() && file.isFile());
    file.delete();
  }

  @Test
  void prepareOperationRows_should_returnEmptyString_when_operationsObjectIsNull() {
    assertThat(SystemOperationPdf.prepareOperationRows(null)).isEqualTo("");
  }

  @Test
  void prepareOperationRows_should_returnEmptyString_when_operationsObjectIsEmptyArray() {
    assertThat(SystemOperationPdf.prepareOperationRows(new ArrayList<>())).isEqualTo("");
  }

  @Test
  void prepareOperationRows_should_correctHtmlTableRows_when_operationsObjectIsArray() {
    List<AccountOperation> operations = new ArrayList<>();
    operations.add(
        new AccountOperation(
            LocalDateTime.of(2025, 3, 12, 17, 42, 21, 100),
            61_7100L, "EUR"));
    operations.add(
        new AccountOperation(LocalDateTime.of(2025, 3, 14, 9, 2, 47, 423),
            26_5600L, "EUR"));

    assertThat(SystemOperationPdf.prepareOperationRows(operations)).isEqualTo("""
        <tr>
        <td>2025-03-12 17:42:21</td>
        <td>61.71 EUR</td>
        </tr>
        <tr>
        <td>2025-03-14 09:02:47</td>
        <td>26.56 EUR</td>
        </tr>
        """);
  }

  @Test
  public void prepareNotes_should_generateNoteSectionHtmlPart_when_calledWithClock() {
    assertThat(ExchangeReportPdf.prepareNotes(clock)).isEqualTo("""
        <notes>
          <h1><span>Additional Notes</span></h1>
          <div>
            <p>Generated date: 2025-09-02 16:35:24 UTC</p>
          </div>
        </notes>
        """);
  }
}