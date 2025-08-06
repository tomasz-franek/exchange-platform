package org.exchange.app.backend.common.pdfs;

import com.lowagie.text.DocumentException;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import org.xhtmlrenderer.pdf.ITextRenderer;

public class PdfFlyingSaucer {

	public static void generatePdf(String filePath)
			throws DocumentException {
	//template based on https://codepen.io/tjoen/pen/wvgvLX MIT License
	String invoiceHtmlContent =
				"""
						<html>
							 <head>
								 <title>Invoice</title>
								 <style>
									 {
										 border: 0;
										 box-sizing: content-box;
										 color: inherit;
										 font-family: inherit;
										 font-size: inherit;
										 font-style: inherit;
										 font-weight: inherit;
										 line-height: inherit;
										 list-style: none;
										 margin: 0;
										 padding: 0;
										 text-decoration: none;
										 vertical-align: top;
									 }
									 /* heading */
									 h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
									 /* table */
									 table { font-size: 75%; table-layout: fixed; width: 100%; }
									 table { border-collapse: separate; border-spacing: 2px; }
									 th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
									 th, td { border-radius: 0.25em; border-style: solid; }
									 th { background: #EEE; border-color: #BBB; }
									 td { border-color: #DDD; }
									 /* page */
									 .html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
									 .html { background: #999; cursor: default; }
									 .body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
									 .body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
									 /* header */
									 .header { margin: 0 0 3em; }
									 header:after { clear: both; content: ""; display: table; }
									 header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
									 header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
									 header address p { margin: 0 0 0.25em; }
									 header span, header img { display: block; float: right; }
									 header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
									 header img { max-height: 100%; max-width: 100%; }
									 header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }
									 /* article */
									 article, article address, table.meta, table.inventory { margin: 0 0 3em; }
									 article:after { clear: both; content: ""; display: table; }
									 article h1 { clip: rect(0 0 0 0); position: absolute; }
									 article address { float: left; font-size: 125%; font-weight: bold; }
									 /* table meta  balance */
									 table.meta, table.balance { float: right; width: 46%; }
									 table.meta:after, table.balance:after { clear: both; content: ""; display: table; }
									 /* table meta */
									 table.meta th { width: 40%; }
									 table.meta td { width: 60%; }
									 /* table items */
									 table.exchange { clear: both; width: 100%; }
									 table.exchange th { font-weight: bold; text-align: center; }
									 table.exchange td:nth-child(1) { width: 58%; }
									 table.exchange td:nth-child(2) { text-align: right; width: 12%; }
									 table.exchange td:nth-child(3) { text-align: right; width: 15%; }
									 table.exchange td:nth-child(4) { text-align: right; width: 15%; }
									 /* table balance */
									 .table.balance th, table.balance td { width: 50%; }
									 .table.balance td { text-align: right; }
									 /* aside */
									 aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
									 aside h1 { border-color: #999; border-bottom-style: solid; }
									 @media print {
										 * { -webkit-print-color-adjust: exact; }
										 html { background: none; padding: 0; }
										 body { box-shadow: none; margin: 0; }
										 span:empty { display: none; }
										 .add, .cut { display: none; }
									 }
									 .align-right{
										 text-align: right;
									 }
									 @page { margin: 0; }
								 </style>
							 </head>
							 <body>
							<header>
									<h1>Invoice</h1>
									$s
							</header>
									$s
									$s
							<table class="exchange">
								<thead>
									<tr>
										<th><span>Description</span></th>
										<th><span>Money Amount</span></th>
										<th><span>Ratio</span></th>
										<th><span>Exchange Amount</span></th>
									</tr>
								</thead>
								<tbody>
									%s
								</tbody>
								</table>
									%s
									<aside>
										<h1><span>Additional Notes</span></h1>
										<div>
											<p>Exchange Date : 2025-08-04</p>
										</div>
									</aside>
								</body>
							</html>
						""";

	ITextRenderer renderer = new ITextRenderer();
	String invoiceAddress = """
			<address>
				<p>Exchange Platform</p>
				<p>Street 100<br/>ZipCode City</p>
				<p>Phone</p>
				</address>
			""";
	String recipientAddress = """
			<article>
				<h1>Recipient</h1>
					<address>
						<p>Company<br/>street: aa</p>
					</address>
				</article>
			""";
	String tableMeta = """
			<table class="meta">
				<tr>
					<th><span>Exchange invoice #</span></th>
					<td><span>101138</span></td>
				</tr>
				<tr>
					<th><span>Date</span></th>
					<td><span>January 1, 2012</span></td>
				</tr>
				<tr>
					<th><span>Amount Due</span></th>
					<td><span id="prefix">$</span><span>600.00</span></td>
				</tr>
			</table>
			""";
	String rowExchange = """
			<tr>
				<td><span>Money exchange BUY USD SELL EUR</span></td>
				<td><span>150.00 EUR</span></td>
				<td><span>4.0000</span></td>
				<td><span>600.00 USD</span></td>
			</tr>
			""";
	String tableBalance = """
			<table class="balance">
				<tr>
					 <th><span>Total</span></th>
					 <td class="align-right" ><span>600.00 EUR</span></td>
				</tr>
				<tr>
					 <th><span>Exchanged Amount</span></th>
					 <td class="align-right"><span>600.00 USD</span></td>
				</tr>
				<tr>
					 <th><span>Amount Fee</span></th>
					 <td class="align-right"><span>0.00 USD</span></td>
				</tr>
				<tr>
					 <th><span>Exchanged Amount after Fee</span></th>
					 <td class="align-right"><span>600.00 USD</span></td>
				</tr>
			</table>
			""";
	renderer.setDocumentFromString(
			String.format(
					invoiceHtmlContent,
					invoiceAddress,
					recipientAddress,
					tableMeta,
					rowExchange,
					tableBalance
			)
	);
		renderer.layout();

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		renderer.createPDF(bos);

		try (FileOutputStream fos = new FileOutputStream("/var/tmp/invoice-flyingsaucer.pdf")) {
			fos.write(bos.toByteArray());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
}
}
