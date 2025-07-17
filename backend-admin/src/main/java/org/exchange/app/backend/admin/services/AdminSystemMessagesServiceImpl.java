package org.exchange.app.backend.admin.services;

import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.backend.db.mappers.SystemMessageMapper;
import org.exchange.app.backend.db.repositories.SystemMessageRepository;
import org.exchange.app.backend.db.validators.EntityValidator;
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
  public SystemMessage saveSystemMessage(SystemMessage systemMessage) {
    SystemMessageEntity systemMessageEntity = SystemMessageMapper.INSTANCE.toEntity(systemMessage);

    systemMessageEntity.setId(UUID.randomUUID());
    systemMessageEntity.setVersion(0);
    systemMessageEntity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(systemMessageEntity),
            EntityValidator.haveNotNullValues(systemMessageEntity))
        .throwValidationExceptionWhenErrors();
    return SystemMessageMapper.INSTANCE.toDto(systemMessageRepository.save(systemMessageEntity));
  }

  @Override
  public void updateSystemMessage(SystemMessage systemMessage) {
    SystemMessageEntity entity = systemMessageRepository.findById(systemMessage.getId())
        .orElseThrow(
            () -> new ObjectWithIdNotFoundException("SystemMessage",
                systemMessage.getId().toString())
        );
    systemMessageRepository.validateVersion(entity, systemMessage.getVersion());
    SystemMessageMapper.INSTANCE.updateWithDto(entity, systemMessage);
    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(entity),
            EntityValidator.haveNotNullValues(entity))
        .throwValidationExceptionWhenErrors();
    systemMessageRepository.save(entity);
  }
}
