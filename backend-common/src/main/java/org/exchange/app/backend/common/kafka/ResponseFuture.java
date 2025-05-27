package org.exchange.app.backend.common.kafka;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class ResponseFuture<V> {

  private final CountDownLatch latch = new CountDownLatch(1);
  private V response;
  private Exception exception;

  public V get(long timeout, TimeUnit unit) throws Exception {
    if (!latch.await(timeout, unit)) {
      throw new TimeoutException("Response not received within timeout");
    }
    if (exception != null) {
      throw exception;
    }
    return response;
  }

  public void complete(V response) {
    this.response = response;
    latch.countDown();
  }
}