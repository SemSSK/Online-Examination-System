package com.example.SpringLogin;

import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Repos.ModuleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@SpringBootApplication
public class SpringLoginApplication {


	public static void main(String[] args) {
		SpringApplication.run(SpringLoginApplication.class, args);
	}


	@Bean
	public JavaMailSender javaMailSender(){
		return new JavaMailSenderImpl();
	}

}
