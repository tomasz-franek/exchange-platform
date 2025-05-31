package org.exchange.app.backend.services;


import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;


class SnapshotServiceImplTest {

	@Autowired
	private SnapshotService snapshotService;

	@Autowired
	private SystemSnapshotRepository systemSnapshotRepository;

	@Test
	public void generateSnapshot() {
		//todo prepare test data
//		long count = systemSnapshotRepository.count();
//		snapshotService.generateSnapshot();
//		assertThat(count + 1).isEqualTo(systemSnapshotRepository.count());
	}
}