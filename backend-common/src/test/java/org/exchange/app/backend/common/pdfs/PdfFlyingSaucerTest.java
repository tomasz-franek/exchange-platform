package org.exchange.app.backend.common.pdfs;

import com.lowagie.text.DocumentException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class PdfFlyingSaucerTest {

	@Test
	@Disabled("todo: not save to filesystem")
	void generatePdf() throws DocumentException {
		PdfFlyingSaucer.generatePdf();
	}
}