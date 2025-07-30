package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.LoadUserRequest;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.mappers.UserMapper;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.common.api.model.UserData;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

  private final UserRepository userRepository;
  private final AuthenticationFacade authenticationFacade;

  @Override
  public UpdateUserResponse updateUserStatus(UpdateUserRequest updateUserRequest) {
    String admin = authenticationFacade.getCurrentUserName().orElseThrow(
        () -> new UserAccountException(AdminUserService.class, "Invalid admin")
    );
    UserEntity userEntity = userRepository.findById(updateUserRequest.getUserId()).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", updateUserRequest.getUserId().toString())
    );

    userEntity.setModifiedBy(admin);
    userEntity.setModifiedDateUTC(ExchangeDateUtils.currentLocalDateTime());
    userEntity.setStatus(updateUserRequest.getStatus());
    userEntity = userRepository.validateVersionAndSave(userEntity, updateUserRequest.getVersion());
    return new UpdateUserResponse(
        userEntity.getId(),
        userEntity.getStatus(),
        userEntity.getModifiedDateUTC(),
        userEntity.getModifiedBy(),
        userEntity.getEmail());
  }

  @Override
  public List<UserData> loadUserList(LoadUserRequest loadUserRequest) {
    List<UserData> userDataList = new ArrayList<>();
    userRepository.findAll().forEach(userEntity ->
        userDataList.add(UserMapper.INSTANCE.toUserData(userEntity)));
    return userDataList;
  }
}
