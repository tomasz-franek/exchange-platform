package org.exchange.app.backend.services;


import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SnapshotServiceImplTest {

	@Mock
	private SnapshotDataRepository snapshotDataRepository;

	@Mock
	private SystemSnapshotRepository systemSnapshotRepository;

	@Mock
	private ExchangeEventSourceRepository exchangeEventSourceEntity;

	@InjectMocks
	private SnapshotServiceImpl snapshotService;

	private SystemSnapshotEntity lastSnapshot;

	@BeforeEach
	public void setUp() {
		lastSnapshot = new SystemSnapshotEntity(1);
		lastSnapshot.setLastEventSourceId(100L);
	}

	@Test
	public void testGenerateSnapshot_NoUserAccounts() {
		when(systemSnapshotRepository.getLastSnapshotObject()).thenReturn(Optional.of(lastSnapshot));
		when(exchangeEventSourceEntity.findAllExchangeEventsWithIdGreaterThan(
				lastSnapshot.getLastEventSourceId()))
				.thenReturn(Collections.emptyList());

		snapshotService.generateSnapshot();

		verify(snapshotDataRepository, never()).saveAll(any());
	}


	@Test
	public void testProcessChunk() {
		UUID userAccountId = UUID.randomUUID();
		SystemSnapshotEntity currentSnapshot = new SystemSnapshotEntity(2);
		currentSnapshot.setId(2L);

		List<UUID> chunk = Collections.singletonList(userAccountId);
		when(snapshotDataRepository.getAllForSnapshotAndAccountIds(lastSnapshot.getId(), chunk))
				.thenReturn(Collections.singletonList(new SnapshotDataRecord(userAccountId, 50L)));
		when(exchangeEventSourceEntity.getAllAfterForUserAccountIds(
				lastSnapshot.getLastEventSourceId(), chunk))
				.thenReturn(Collections.singletonList(new SnapshotDataRecord(userAccountId, 100L)));

		snapshotService.processUserAccountIdsChunk(lastSnapshot, currentSnapshot.getId(), chunk);

		verify(snapshotDataRepository, times(1)).saveAll(any());
	}


}