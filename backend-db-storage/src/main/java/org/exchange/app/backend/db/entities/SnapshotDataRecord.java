package org.exchange.app.backend.db.entities;

import java.util.UUID;

public record SnapshotDataRecord(UUID userAccountId, long amount) {

}
