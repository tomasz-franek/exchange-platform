package org.exchange.app.backend.common.utils;

public interface SerializationUtils<T> {

  int ONE = 1;
  byte[] toByteArray(T object, ByteArrayData byteArrayData);

  T toObject(ByteArrayData byteArrayData);
}
