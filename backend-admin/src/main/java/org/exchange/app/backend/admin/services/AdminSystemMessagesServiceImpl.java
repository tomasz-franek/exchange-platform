package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
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
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminSystemMessagesServiceImpl(SystemMessageRepository systemMessageRepository,
      AuthenticationFacade authenticationFacade) {
    this.systemMessageRepository = systemMessageRepository;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public SystemMessage saveSystemMessage(SystemMessage systemMessage) {
    SystemMessageEntity systemMessageEntity = SystemMessageMapper.INSTANCE.toEntity(systemMessage);
    //authenticationFacade.checkIsAdmin(SystemMessage.class);
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
    //authenticationFacade.checkIsAdmin(SystemMessage.class);
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

  @Override
  public List<SystemMessage> loadSystemMessageList() {
    //authenticationFacade.checkIsAdmin(SystemMessage.class);
    List<SystemMessage> list = new ArrayList<>();
    systemMessageRepository.findAll().forEach(
        e -> list.add(SystemMessageMapper.INSTANCE.toDto(e))
    );
    return list;
  }
}
