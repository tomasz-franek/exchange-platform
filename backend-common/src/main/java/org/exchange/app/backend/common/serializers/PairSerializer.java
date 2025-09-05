package org.exchange.app.backend.common.serializers;

import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.common.api.model.Pair;

public class PairSerializer extends SerializerSize implements Serializer<Pair> {

  public static byte NULL_BYTE = Byte.MIN_VALUE;
  public PairUtils pairUtils = new PairUtils();

  @Override
  public byte[] serialize(String topic, Pair pair) {
    return pairUtils.toByteArray(pair, null);
  }

  public static int getSize() {
    return PairUtils.getSize();
  }
}
