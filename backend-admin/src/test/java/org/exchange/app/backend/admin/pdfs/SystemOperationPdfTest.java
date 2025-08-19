package org.exchange.app.backend.admin.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.SystemAccountOperation;
import org.junit.jupiter.api.Test;

class SystemOperationPdfTest {

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithSystemOperations()
      throws IOException {
    List<SystemAccountOperation> operations = new ArrayList<>();
    operations.add(new SystemAccountOperation(LocalDateTime.now(), 100L));
    operations.add(new SystemAccountOperation(LocalDateTime.now(), 200L));
    operations.add(new SystemAccountOperation(LocalDateTime.now(), -4500L));
    String filePath = File.createTempFile("testSystemOperations-", ".pdf").getPath();
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