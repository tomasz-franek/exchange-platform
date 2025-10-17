package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.UUID;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.common.api.model.MessagePriority;
import org.exchange.app.common.api.model.SystemMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class SystemMessageMapperTest {

  private SystemMessageMapper mapper;

  @BeforeEach
  public void setUp() {
    mapper = Mappers.getMapper(SystemMessageMapper.class);
  }

  @Test
  public void toDto_should_copyEntityValues_when_methodCalled() {

    SystemMessageEntity entity = new SystemMessageEntity();
    entity.setId(UUID.randomUUID());
    entity.setMessageText("Test message");
    entity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setVersion(1);
    entity.setPriority((short) 4);

    SystemMessage dto = mapper.toDto(entity);

		assertThat(dto.getId()).isEqualTo(entity.getId());
		assertThat(dto.getMessageText()).isEqualTo(entity.getMessageText());
		assertThat(dto.getVersion()).isEqualTo(entity.getVersion());
		assertThat(dto.getPriority()).isEqualTo(MessagePriority.HIGH);
  }

  @Test
  public void toEntity_should_setMessageTextAndId_when_methodCalled() {

    SystemMessage dto = new SystemMessage();
    dto.setId(UUID.randomUUID());
    dto.setMessageText("Test message");

    SystemMessageEntity entity = mapper.toEntity(dto);

		assertThat(dto.getId()).isEqualTo(entity.getId());
		assertThat(dto.getMessageText()).isEqualTo(entity.getMessageText());
		assertThat(entity.getCreateDateUtc()).isNull();
  }

  @Test
  public void updateWithDto_should_notUpdateId_when_methodCalled() {
    UUID id = UUID.randomUUID();
    SystemMessageEntity messageEntityToUpdate = new SystemMessageEntity();
    messageEntityToUpdate.setId(id);
    messageEntityToUpdate.setMessageText("Old message");
    messageEntityToUpdate.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());

    SystemMessage systemMessage = new SystemMessage();
    systemMessage.setMessageText("Updated message");
    systemMessage.setId(UUID.randomUUID());

    mapper.updateWithDto(messageEntityToUpdate, systemMessage);

    assertThat(messageEntityToUpdate.getId()).isEqualTo(id);
		assertThat(messageEntityToUpdate.getMessageText()).isEqualTo("Updated message");

		assertThat(messageEntityToUpdate.getCreateDateUtc()).isNotNull();
  }

  @Test
  public void testMapShortToMessagePriority() {

    short lowValue = 1;
    short mediumValue = 2;
    short highValue = 3;

    MessagePriority lowPriority = mapper.map(lowValue);
    MessagePriority mediumPriority = mapper.map(mediumValue);
    MessagePriority highPriority = mapper.map(highValue);
    MessagePriority undefinedPriority = mapper.map((short) 4);

    assertEquals(MessagePriority.LOW, lowPriority);
    assertEquals(MessagePriority.MEDIUM, mediumPriority);
    assertEquals(MessagePriority.HIGH, highPriority);
    assertEquals(MessagePriority.HIGH, undefinedPriority);

  }

  @Test
  public void testMapMessagePriorityToShort() {

    MessagePriority lowPriority = MessagePriority.LOW;
    MessagePriority mediumPriority = MessagePriority.MEDIUM;
    MessagePriority highPriority = MessagePriority.HIGH;

    short lowValue = mapper.map(lowPriority);
    short mediumValue = mapper.map(mediumPriority);
    short highValue = mapper.map(highPriority);
    short nullValue = mapper.map(null);

    assertEquals(1, lowValue);
    assertEquals(2, mediumValue);
    assertEquals(3, highValue);
    assertEquals(1, nullValue);
  }
}

