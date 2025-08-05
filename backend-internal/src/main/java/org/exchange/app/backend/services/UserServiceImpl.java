package org.exchange.app.backend.services;

import java.util.Optional;
import java.util.UUID;
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

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final UserPropertyRepository userPropertyRepository;

  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public UserServiceImpl(UserRepository userRepository,
      UserPropertyRepository userPropertyRepository,
      AuthenticationFacade authenticationFacade) {
    this.userRepository = userRepository;
    this.userPropertyRepository = userPropertyRepository;
    this.authenticationFacade = authenticationFacade;
  }


  @Override
  public Optional<User> findById(UUID userUUID) {
    Optional<UserEntity> userEntity = userRepository.findById(userUUID);
    return userEntity.map(UserMapper.INSTANCE::toDto);
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
  public UserProperty saveUserProperty(UserProperty userProperty) {
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
    userPropertyEntity = userPropertyRepository.save(userPropertyEntity);
    return UserPropertyMapper.INSTANCE.toDto(userPropertyEntity);
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
