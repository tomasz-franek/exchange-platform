package org.exchange.app.backend.external.exceptions;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import lombok.Getter;
import org.exchange.app.common.api.model.ErrorObjectResponse;

@Getter
public class ObjectWithIdNotFoundException extends RuntimeException {

	private final ErrorObjectResponse exceptionRecord;

	public ObjectWithIdNotFoundException(String field, String id) {
		this.exceptionRecord = new ErrorObjectResponse(
				ErrorCodesEnum.OBJECT_WITH_ID_NOT_FOUND.name(),
				UUID.randomUUID(), String.format("%s=%s", field, id),
				LocalDateTime.now(ZoneOffset.UTC));
	}
}
