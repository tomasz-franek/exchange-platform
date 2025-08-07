package org.exchange.internal.app.core.pdfs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressData {

	String name;
	String country;
	String street;
	String zipCode;
	String postalOffice;
	String taxID;
	String vatID;
	String phone;
}
