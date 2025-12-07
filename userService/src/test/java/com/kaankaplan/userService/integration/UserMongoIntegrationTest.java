package com.kaankaplan.userService.integration;

import com.kaankaplan.userService.business.abstracts.UserService;
import com.kaankaplan.userService.entity.Claim;
import com.kaankaplan.userService.entity.User;
import com.kaankaplan.userService.dao.UserDao;
import com.kaankaplan.userService.entity.dto.UserRegisterRequestDto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootTest // levanta TODO el microservicio (exactamente igual a producción)
@ActiveProfiles("test")
public class UserMongoIntegrationTest {

	@Autowired
	private UserService userService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MongoTemplate mongoTemplate; // para limpieza/chequeos directos

	void beforeAll() {
		// Asegurarse que la BD de test exista/limpia
		mongoTemplate.getDb().drop();
		// opcional: crear claims necesarios si tu addUser espera que exista "CUSTOMER"
		Claim customer = Claim.builder().claimName("CUSTOMER").build();
		Claim admin = Claim.builder().claimName("ADMIN").build();
		mongoTemplate.save(customer);
		mongoTemplate.save(admin);
	}

	// @AfterEach
	// void cleanup() {
	// // limpiar users después de cada test
	// mongoTemplate.getCollection("user").deleteMany(new org.bson.Document());
	// }

	@Test
	void addUser_shouldSaveUserInMongo() {
		UserRegisterRequestDto dto = new UserRegisterRequestDto();
		dto.setEmail("integration@test.com");
		dto.setCustomerName("Integration User");
		dto.setPassword("123456");

		userService.addUser(dto);

		User found = userDao.findUserByEmail("integration@test.com");

		assertThat(found).isNotNull();
		assertThat(found.getEmail()).isEqualTo("integration@test.com");
	}

	@Test
	void addUser_should_store_user_with_customer_claim() {
		// prepara dto (usa tu DTO real)
		UserRegisterRequestDto dto = new UserRegisterRequestDto();
		dto.setEmail("test@example.com");
		dto.setPassword("pass1234");
		dto.setCustomerName("Test Customer");

		userService.addUser(dto);

		// verificar que usuario se guardó
		User u = userDao.findUserByEmail("test@example.com");

		assertNotNull(u);
		assertEquals("test@example.com", u.getEmail());
		assertNotNull(u.getClaim());
		assertEquals("CUSTOMER", u.getClaim().getClaimName());
	}
}
