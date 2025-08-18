package org.exchange.app.backend.admin.services;

import static org.exchange.app.backend.common.config.SystemConfig.systemUserId;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.apache.logging.log4j.util.Strings;
import org.exchange.app.admin.api.model.LoadUserRequest;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.backend.db.mappers.AddressMapper;
import org.exchange.app.backend.db.mappers.UserMapper;
import org.exchange.app.backend.db.mappers.UserPropertyMapper;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.backend.db.repositories.UserPropertyRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.backend.db.specifications.UserSpecification;
import org.exchange.app.backend.db.validators.EntityValidator;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.UserData;
import org.exchange.app.common.api.model.UserProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl implements AdminUserService {

  private final UserRepository userRepository;
  private final UserPropertyRepository userPropertyRepository;
  private final AuthenticationFacade authenticationFacade;
  private final AddressRepository addressRepository;

  @Autowired
  public AdminUserServiceImpl(
      UserRepository userRepository,
      UserPropertyRepository userPropertyRepository,
      AddressRepository addressRepository,
      AuthenticationFacade authenticationFacade
  ) {
    this.userRepository = userRepository;
    this.userPropertyRepository = userPropertyRepository;
    this.addressRepository = addressRepository;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public UpdateUserResponse updateUserStatus(UpdateUserRequest updateUserRequest) {
    //authenticationFacade.checkIsAdmin(User.class);
    String admin = authenticationFacade.getCurrentUserName().orElseThrow(
        () -> new UserAccountException(AdminUserService.class, "Invalid admin")
    );
    UserEntity userEntity = userRepository.findById(updateUserRequest.getUserId()).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", updateUserRequest.getUserId().toString())
    );

    userEntity.setModifiedBy(admin);
    userEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    userEntity.setStatus(updateUserRequest.getStatus());
    userEntity = userRepository.validateVersionAndSave(userEntity, updateUserRequest.getVersion());
    return new UpdateUserResponse(
        userEntity.getId(),
        userEntity.getStatus(),
        userEntity.getModifiedDateUtc(),
        userEntity.getModifiedBy(),
        userEntity.getEmail(),
        userEntity.getVersion());
  }

  @Override
  public List<UserData> loadUserList(LoadUserRequest loadUserRequest) {
    //authenticationFacade.checkIsAdmin(LoadUserRequest.class);
    List<UserData> userDataList = new ArrayList<>();
    Specification<UserEntity> userEntitySpecification = null;
    if (Strings.isNotBlank(loadUserRequest.getEmail())) {
      userEntitySpecification = UserSpecification.emailLike(loadUserRequest.getEmail());
    }
    List<UserEntity> entities;
    if (userEntitySpecification != null) {
      entities = userRepository.findAll(userEntitySpecification);
    } else {
      entities = userRepository.findAll();
    }
    entities.forEach(userEntity -> {
      if (!systemUserId.equals(userEntity.getId())) {
        userDataList.add(UserMapper.INSTANCE.toUserData(userEntity));
      }
    });
    return userDataList;
  }

  @Override
  public UserProperty saveUserProperty(UserProperty userProperty) {
    //authenticationFacade.checkIsAdmin(LoadUserRequest.class);
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
    //authenticationFacade.checkIsAdmin(LoadUserRequest.class);
    UUID userId = authenticationFacade.getUserUuid();
    UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", userId.toString())
    );
    return UserPropertyMapper.INSTANCE.toDto(userPropertyEntity);
  }

  @Override
  public Address saveUserAddress(Address address) {
    //authenticationFacade.checkIsAdmin(Address.class);
    UUID userUuid = authenticationFacade.getUserUuid();
    UserEntity userEntity = userRepository.findById(userUuid).orElse(null);
    if (userEntity == null) {
      throw new ObjectWithIdNotFoundException("User", userUuid.toString());
    }
    AddressEntity addressEntity = addressRepository.findByUserId(userUuid).orElse(
        null);
    if (addressEntity != null) {
      addressRepository.validateVersion(addressEntity, address.getVersion());
      AddressMapper.INSTANCE.updateWithDto(addressEntity, address);
    } else {
      addressEntity = AddressMapper.INSTANCE.toEntity(address);
      addressEntity.setUserId(userUuid);
      if (addressEntity.getId() == null) {
        addressEntity.setId(UUID.randomUUID());
      }
    }
    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(addressEntity),
            EntityValidator.haveNotNullValues(addressEntity))
        .throwValidationExceptionWhenErrors();
    addressEntity = addressRepository.save(addressEntity);
    return AddressMapper.INSTANCE.toDto(addressEntity);
  }

  @Override
  public Address getUserAddress() {
    //authenticationFacade.checkIsAdmin(Address.class);
    UUID userUuid = authenticationFacade.getUserUuid();
    AddressEntity addressEntity = addressRepository.findByUserId(userUuid).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", userUuid.toString())
    );
    return AddressMapper.INSTANCE.toDto(addressEntity);
  }
}
