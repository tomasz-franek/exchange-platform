package org.exchange.app.backend.external.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.backend.db.mappers.SystemMessageMapper;
import org.exchange.app.backend.db.repositories.SystemMessageRepository;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemServiceImpl implements SystemService {

  private final SystemMessageRepository systemMessageRepository;

  @Autowired
  public SystemServiceImpl(SystemMessageRepository systemMessageRepository) {
    this.systemMessageRepository = systemMessageRepository;
  }

  @Override
  public List<SystemMessage> loadSystemMessageList() {
    List<SystemMessage> messages = new ArrayList<>();
    List<SystemMessageEntity> entities = systemMessageRepository.loadActiveSystemMessages();
    entities.forEach(entity -> messages.add(SystemMessageMapper.INSTANCE.toDto(entity)));
    return messages;
  }
}
