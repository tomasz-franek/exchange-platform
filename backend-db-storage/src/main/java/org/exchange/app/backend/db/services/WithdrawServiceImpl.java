package org.exchange.app.backend.db.services;

import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.backend.db.repositories.WithdrawRepository;
import org.exchange.app.backend.db.specifications.WithdrawSpecification;
import org.exchange.app.common.api.model.Currency;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class WithdrawServiceImpl implements WithdrawService {

  private final WithdrawRepository withdrawRepository;

  public WithdrawServiceImpl(WithdrawRepository withdrawRepository) {
    this.withdrawRepository = withdrawRepository;
  }

  @Override
  public Long getMinimalAmountForCurrency(Currency currency) {
    Specification<WithdrawEntity> specification = WithdrawSpecification.currency(currency);

    return withdrawRepository.findBy(specification,
        q -> q.stream().map(WithdrawEntity::getAmount).findFirst().orElse(0L));
  }
}
