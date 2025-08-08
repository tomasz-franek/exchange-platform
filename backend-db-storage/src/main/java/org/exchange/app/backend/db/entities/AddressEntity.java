package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "address", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class AddressEntity extends VersionEntity {

	@Id
	private UUID id;

	@Column(name = "name", nullable = false, length = 500)
	private String name;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Column(name = "country", nullable = false, length = 2)
	String countryCode;
	@Column(name = "street", length = 70)
	String street;
	@Column(name = "zip_code", length = 10)
	String zipCode;
	@Column(name = "city", length = 70)
	String city;
	@Column(name = "tax_id", length = 20)
	String taxID;
	@Column(name = "vat_id", length = 20)
	String vatID;
	@Column(name = "phone", length = 20)
	String phone;

}
