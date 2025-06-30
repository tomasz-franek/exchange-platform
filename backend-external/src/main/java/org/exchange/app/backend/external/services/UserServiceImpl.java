package org.exchange.app.backend.external.services;

import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.keycloak.UserService;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.backend.db.mappers.UserMapper;
import org.exchange.app.backend.db.mappers.UserPropertyMapper;
import org.exchange.app.backend.db.repositories.UserPropertyRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.common.api.model.User;
import org.exchange.app.common.api.model.UserProperty;
import org.exchange.app.common.api.model.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class UserServiceImpl implements UserService {

  private final UserPropertyRepository userPropertyRepository;
  private final AuthenticationFacade authenticationFacade;


  @Autowired
  private final UserRepository userRepository;

  @Autowired
  public UserServiceImpl(
      UserPropertyRepository userPropertyRepository,
      AuthenticationFacade authenticationFacade,
      UserRepository userRepository) {
    this.userPropertyRepository = userPropertyRepository;
    this.authenticationFacade = authenticationFacade;
    this.userRepository = userRepository;
  }


  public Optional<User> findById(UUID userUUID) {
    UserEntity userEntity = userRepository.findById(userUUID).orElse(null);
    if (userEntity != null) {
      return Optional.of(UserMapper.INSTANCE.toDto(userEntity));
    } else {
      return Optional.empty();
    }
  }

  @Override
  public User createUser(UUID userUUID, User user) {
    UserEntity userEntity = UserMapper.INSTANCE.toEntity(user);
    userEntity.setId(userUUID);
    userEntity.setStatus(UserStatus.ACTIVE);
    userEntity.setCreatedDateUTC(ExchangeDateUtils.currentLocalDateTime());
    return UserMapper.INSTANCE.toDto(userRepository.save(userEntity));
  }

  @Override
  public void saveUserProperty(UserProperty userProperty) {
    UUID userId = authenticationFacade.getUserUuid();
    UserEntity userEntity = userRepository.findById(userId).orElse(null);
    if (userEntity == null) {
      throw new ObjectWithIdNotFoundException("User", userId.toString());
    }
    UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userId).orElse(
        null);
    if (userPropertyEntity != null) {
      userPropertyRepository.validateVersion(userPropertyEntity, userProperty.getVersion());
      UserPropertyMapper.INSTANCE.updateWithDto(userPropertyEntity, userProperty);
    } else {
      userPropertyEntity = UserPropertyMapper.INSTANCE.toEntity(userProperty);
      userPropertyEntity.setUserId(userId);
    }
    userPropertyRepository.save(userPropertyEntity);
  }

  @Override
  public UserProperty getUserProperty() {
    UUID userId = authenticationFacade.getUserUuid();
    UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", userId.toString())
    );
    return UserPropertyMapper.INSTANCE.toDto(userPropertyEntity);
  }

}
