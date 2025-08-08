package org.exchange.internal.app.core.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.CoreTestConfiguration;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
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
						.withEpochUTC(100)
						.build());
		for (int i = 0; i < 5; i++) {
			exchangeDataResult.getExchangeCoreTicketList()
					.add(CoreTicketBuilder.createBuilder()
							.withId(1L + i)
							.withAmount(100 * (i + 1))
							.withRatio(1000 + i)
							.withUserId(UUID.randomUUID())
							.withDirection(Direction.BUY)
							.withPair(Pair.EUR_USD)
							.withEpochUTC(100 + i)
							.build());
		}
		Address addressData = new Address();
		addressData.setCountryCode("DE");
		addressData.setZipCode("Zip code");
		addressData.setName("Name");
		addressData.setVatID("VatID");
		addressData.setTaxID("TaxID");
		exchangeDataResult.setRecipientAddress(addressData);
		exchangeDataResult.setSystemAddress(addressData);
		
		String filePath = File.createTempFile("testExchangeReport-", ".pdf").getPath();
		exchangeReport.generateExchangeReport(filePath, exchangeDataResult);
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
		file.delete();
	}

}