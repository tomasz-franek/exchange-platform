package org.exchange.app.backend.common.pdfs;

import static org.assertj.core.api.Assertions.assertThat;

import com.lowagie.text.DocumentException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class ExchangeReportPdfTest {

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithExchangeData()
      throws DocumentException, IOException {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setSourceTicket(
        CoreTicketBuilder.createBuilder().withDirection(Direction.SELL).withPair(
                Pair.EUR_GBP).withRatio(1_0803).withAmount(500_0000).withId(1L)
            .withEpochUTC(
                ExchangeDateUtils.toEpochUtc(LocalDateTime.now().minusHours(12).minusMinutes(34)))
            .withUserId(UUID.randomUUID()).build());
    exchangeDataResult.setExchangeCoreTicketList(new ArrayList<>());
    exchangeDataResult.getExchangeCoreTicketList()
        .add(new ExchangePdfRow(340_0000L, 283_2100L, 1_0803L));
    exchangeDataResult.getExchangeCoreTicketList()
        .add(new ExchangePdfRow(45_8600L, 283_2100L, 1_0795L));
    Address addressData = new Address();
    addressData.setCountryCode("PL");
    addressData.setZipCode("Zip code");
    addressData.setName("Name");
    addressData.setVatID("VatID");
    addressData.setTaxID("TaxID");
    exchangeDataResult.setRecipientAddress(addressData);
    exchangeDataResult.setSystemAddress(addressData);
    exchangeDataResult.setFee(3400L);
    String filePath = File.createTempFile("testExchangeReport-", ".pdf").getPath();
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      ExchangeReportPdf.generatePdf(exchangeDataResult).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertThat(file.exists() && file.isFile()).isTrue();
    file.delete();
  }
}