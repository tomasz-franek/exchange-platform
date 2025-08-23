package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.common.api.model.User;
import org.exchange.app.common.api.model.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class UserMapperTest {

  private UserMapper userMapper;

  @BeforeEach
  public void setUp() {
    userMapper = Mappers.getMapper(UserMapper.class);
  }

  @Test
  public void toEntity_should_setUserEntityFields_when_methodCalled() {
    User user = new User();
    user.setEmail("testEmail");
    user.setVersion(9);

    UserEntity userEntity = userMapper.toEntity(user);

    assertThat(userEntity.getEmail()).isEqualTo(user.getEmail());
    assertThat(userEntity.getVersion()).isEqualTo(user.getVersion());
		assertThat(userEntity.getId()).isNull();
		assertThat(userEntity.getStatus()).isNull();
		assertThat(userEntity.getModifiedBy()).isNull();
		assertThat(userEntity.getModifiedDateUtc()).isNull();
		assertThat(userEntity.getCreatedDateUtc()).isNull();
	}

  @Test
  public void toDto_should_setUserFields_when_methodCalled() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail("testEmail");
    userEntity.setVersion(9);
    userEntity.setStatus(UserStatus.ACTIVE);

    User user = userMapper.toDto(userEntity);

    assertThat(user.getEmail()).isEqualTo(userEntity.getEmail());
    assertThat(user.getVersion()).isEqualTo(userEntity.getVersion());
		assertThat(user.getUserName()).isNull();
		assertThat(user.getName()).isNull();
		assertThat(user.getLastName()).isNull();
		assertThat(user.getBlocked()).isNull();
  }

  @Test
  public void updateWithDto_should_updateEmail_when_methodCalled() {
    UserEntity userEntity = new UserEntity();
    UUID uuid = UUID.randomUUID();
    userEntity.setId(uuid);
    userEntity.setEmail("oldEmail");
    userEntity.setVersion(3);
    userEntity.setStatus(UserStatus.ACTIVE);

    User user = new User();
    user.setEmail("newEmail");
    user.setVersion(5);

    userMapper.updateWithDto(userEntity, user);

    assertThat(userEntity.getId()).isEqualTo(uuid);
    assertThat(userEntity.getEmail()).isEqualTo("newEmail");
    assertThat(userEntity.getVersion()).isEqualTo(user.getVersion());
  }
}
