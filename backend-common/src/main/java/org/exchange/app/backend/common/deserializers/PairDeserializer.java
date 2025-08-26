package org.exchange.app.backend.common.deserializers;

import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  private final PairUtils pairUtils = new PairUtils();
  @Override
  public Pair deserialize(String s, byte[] bytes) {
    return pairUtils.toObject(new ByteArrayData(bytes));
  }
}
