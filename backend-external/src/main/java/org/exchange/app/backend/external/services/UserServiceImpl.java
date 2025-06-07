package org.exchange.app.backend.external.services;

import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.mappers.UserMapper;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.common.api.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

  @Autowired
  private final UserRepository userRepository;

  @Override
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
    return UserMapper.INSTANCE.toDto(userRepository.save(userEntity));
  }
}
