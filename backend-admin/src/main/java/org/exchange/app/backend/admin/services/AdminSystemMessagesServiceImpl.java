package org.exchange.app.backend.admin.services;

import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.backend.db.mappers.SystemMessageMapper;
import org.exchange.app.backend.db.repositories.SystemMessageRepository;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminSystemMessagesServiceImpl implements AdminSystemMessagesService {

  private final SystemMessageRepository systemMessageRepository;

  @Autowired
  public AdminSystemMessagesServiceImpl(SystemMessageRepository systemMessageRepository) {
    this.systemMessageRepository = systemMessageRepository;
  }

  @Override
  public void saveSystemMessage(SystemMessage systemMessage) {
    SystemMessageEntity entity = SystemMessageMapper.INSTANCE.toEntity(systemMessage);

    entity.setVersion(0);
    entity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    systemMessageRepository.save(entity);
  }

  @Override
  public void updateSystemMessage(SystemMessage systemMessage) {
    SystemMessageEntity entity = systemMessageRepository.findById(systemMessage.getId())
        .orElseThrow(
            () -> new ObjectWithIdNotFoundException("SystemMessage",
                systemMessage.getId().toString())
        );
    SystemMessageMapper.INSTANCE.updateWithDto(entity, systemMessage);
    systemMessageRepository.validateVersion(entity, systemMessage.getVersion());
    systemMessageRepository.save(entity);
  }
}
