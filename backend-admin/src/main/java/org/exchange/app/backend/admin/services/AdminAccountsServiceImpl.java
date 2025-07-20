package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminAccountsServiceImpl implements AdminAccountsService {

  private final UserAccountRepository userAccountRepository;

  @Autowired
  public AdminAccountsServiceImpl(UserAccountRepository userAccountRepository) {
    this.userAccountRepository = userAccountRepository;
  }

  @Override
  public List<UserAccount> loadAccounts(UserAccountRequest userAccountRequest) {
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(
        userAccountRequest.getUserId());
    List<UserAccount> accounts = new ArrayList<>();
    accountEntityList.forEach(account -> accounts.add(UserAccountMapper.INSTANCE.toDto(account)));
    return accounts;
  }
}
