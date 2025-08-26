package org.exchange.app.backend.common.utils;

public class ByteArrayData {

  public byte[] bytes;
  public int position = 0;

  public ByteArrayData(int size) {
    this.bytes = new byte[size];
  }

  public ByteArrayData(byte[] array) {
    this.bytes = array;
  }
}
