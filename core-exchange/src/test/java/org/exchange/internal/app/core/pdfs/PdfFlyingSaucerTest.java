package org.exchange.internal.app.core.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.lowagie.text.DocumentException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
import org.junit.jupiter.api.Test;

class PdfFlyingSaucerTest {

	@Test
	void generatePdf() throws DocumentException, IOException {
		ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
		exchangeDataResult.setSourceTicket(
				CoreTicketBuilder.createBuilder().withDirection(Direction.SELL).withPair(
								Pair.EUR_GBP).withRatio(1_0803).withAmount(500_0000).withId(1L)
						.withUserId(UUID.randomUUID()).build());
		exchangeDataResult.setExchangeCoreTicketList(new ArrayList<>());
		exchangeDataResult.getExchangeCoreTicketList().add(
				CoreTicketBuilder.createBuilder().withAmount(340_000).withDirection(Direction.BUY)
						.withPair(Pair.EUR_GBP).withRatio(1_0803).withId(2L).withUserId(UUID.randomUUID())
						.build());
		exchangeDataResult.getExchangeCoreTicketList().add(
				CoreTicketBuilder.createBuilder().withAmount(283_2100).withDirection(Direction.BUY)
						.withPair(Pair.EUR_GBP).withRatio(1_0803).withId(3L).withUserId(UUID.randomUUID())
						.build());
		AddressData addressData = new AddressData();
		addressData.setCountry("Country");
		addressData.setZipCode("Zip code");
		addressData.setName("Name");
		addressData.setVatID("VatID");
		addressData.setTaxID("TaxID");
		exchangeDataResult.setRecipientAddress(addressData);
		exchangeDataResult.setSystemAddress(addressData);
		String filePath = File.createTempFile("PdfFlyingSaucer-", ".pdf").getPath();
		PdfFlyingSaucer.generatePdf(filePath, exchangeDataResult);
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
		file.delete();
	}
}