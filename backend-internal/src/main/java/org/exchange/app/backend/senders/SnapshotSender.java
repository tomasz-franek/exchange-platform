package org.exchange.app.backend.senders;

import java.util.List;

public interface SnapshotSender {

  void sendMessage(List<String> days);
}
