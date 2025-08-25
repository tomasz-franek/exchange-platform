package org.exchange.app.backend.common.utils;

public interface SerialisationUtils<T> {

  int getSize();

  byte[] toByteArray(T object, ByteArrayData byteArrayData);

  T toObject(byte[] array);
}
