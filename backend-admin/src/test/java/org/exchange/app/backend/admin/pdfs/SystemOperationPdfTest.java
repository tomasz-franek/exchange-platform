package org.exchange.app.backend.admin.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.junit.jupiter.api.Test;

class SystemOperationPdfTest {

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithSystemOperations()
      throws IOException {
    List<AccountOperation> operations = new ArrayList<>();
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), 100L));
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), 200L));
    operations.add(new AccountOperation(ExchangeDateUtils.currentLocalDateTime(), -4500L));
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
}