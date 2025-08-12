package org.exchange.app.backend.common.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;
import org.exchange.app.backend.common.CoreTestConfiguration;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = CoreTestConfiguration.class)
public class ExchangeReportTest {

  @Autowired
  private ExchangeReport exchangeReport;


  @Test
  void generateExchangeReport_should_generateFileInFileSystem_when_methodIsCalledWithReportData()
      throws IOException {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setSourceTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withAmount(100)
            .withRatio(1000)
            .withUserId(UUID.randomUUID())
            .withDirection(Direction.SELL)
            .withPair(Pair.EUR_USD)
            .withEpochUTC(ExchangeDateUtils.currentEpochUtc())
            .build());
    for (long i = 0; i < 5; i++) {
      ExchangeResult exchangeResult = new ExchangeResult();
      exchangeResult.setRatio(1000 + i);
      exchangeResult.setSellAmount(100 * (i + 1));
      exchangeResult.setBuyAmount(100 * (i + 1));
      exchangeDataResult.getExchangeCoreTicketList().add(exchangeResult);
    }
    Address addressData = new Address();
    addressData.setCountryCode("DE");
    addressData.setZipCode("Zip code");
    addressData.setName("Name");
    addressData.setVatID("VatID");
    addressData.setTaxID("TaxID");
    exchangeDataResult.setRecipientAddress(addressData);
    exchangeDataResult.setSystemAddress(addressData);
    exchangeDataResult.setFee(1000L);

    String filePath = File.createTempFile("testExchangeReport-", ".pdf").getPath();
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      exchangeReport.generateExchangeReport(exchangeDataResult).writeTo(fos);
    } catch (IOException ioe) {
      // Handle exception here
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertTrue(file.exists() && file.isFile());
    file.delete();
  }
}