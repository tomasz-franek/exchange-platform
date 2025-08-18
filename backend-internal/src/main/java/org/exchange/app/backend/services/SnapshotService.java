package org.exchange.app.backend.services;


import java.time.LocalDate;

public interface SnapshotService {

  void generateSnapshot(LocalDate snapshotDate);
}
