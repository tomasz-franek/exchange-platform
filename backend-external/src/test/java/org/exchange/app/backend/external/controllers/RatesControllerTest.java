package org.exchange.app.backend.external.controllers;


import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class RatesControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void loadCurrencyRates_should_returnListOfRates_when_methodCalled()
			throws Exception {
		mockMvc.perform(get("/rates")
						.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$", hasSize(equalTo(2))))
				.andExpect(jsonPath("$[0].buyRate").value(10000))
				.andExpect(jsonPath("$[0].pair").value("EUR_USD"))
				.andExpect(jsonPath("$[1].buyRate").value(10800))
				.andExpect(jsonPath("$[1].pair").value("EUR_GBP"));
	}

}
