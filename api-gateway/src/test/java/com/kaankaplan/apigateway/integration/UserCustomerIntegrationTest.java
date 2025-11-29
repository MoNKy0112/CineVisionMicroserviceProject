package com.kaankaplan.apigateway.integration;

import lombok.Getter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.List;

@Getter
class UserAuthenticationResponseDto {
	private String userId;
	private String email;
	private String fullName;
	private List<String> roles;
	private String token;
}


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserCustomerIntegrationTest {

	@Autowired
	private TestRestTemplate restTemplate;

	// @LocalServerPort
	private int port;

	private String gatewayUrl;

	@BeforeEach
	void setup() {
		gatewayUrl = "http://localhost:8083"; // API Gateway random port
	}

	@Test
	void testIsUserCustomer() {

		// 1. LOGIN real contra el UserService a través del Gateway
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String loginJson = """
				    {
				        "email": "testcust@gmail.com",
				        "password": "pass1234"
				    }
				""";

		HttpEntity<String> loginRequest = new HttpEntity<>(loginJson, headers);

		ResponseEntity<UserAuthenticationResponseDto> loginResponse =
				restTemplate.postForEntity(gatewayUrl + "/api/user/auth/login", loginRequest,
						UserAuthenticationResponseDto.class);

		System.out.println("Login Response Body: " + loginResponse.getBody());

		assert loginResponse.getStatusCode() == HttpStatus.OK;
		assert loginResponse.getBody() != null;
		String jwt = loginResponse.getBody().getToken();
		assert jwt != null && !jwt.isEmpty();

		// 2. Llamar endpoint protegido del UserService pasando JWT
		HttpHeaders jwtHeaders = new HttpHeaders();
		jwtHeaders.add("Authorization", "Bearer " + jwt);

		HttpEntity<Void> entity = new HttpEntity<>(jwtHeaders);

		ResponseEntity<Boolean> customerResponse =
				restTemplate.exchange(gatewayUrl + "/api/user/users/isUserCustomer", HttpMethod.GET,
						entity, Boolean.class);

		System.out.println("IsUserCustomer Response: " + customerResponse.getBody());

		assert customerResponse.getStatusCode() == HttpStatus.OK;
		assert Boolean.TRUE.equals(customerResponse.getBody());
	}
}
