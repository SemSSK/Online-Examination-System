package com.example.SpringLogin.Configrations;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import com.example.SpringLogin.Socket.ExamRoomWebsocket;
import com.example.SpringLogin.Socket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

import javax.websocket.ContainerProvider;
import javax.websocket.WebSocketContainer;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private WebSocketService webSocketService;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;
    @Autowired
    private ExamRoomWebsocket examRoomWebsocket;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("web socket enboint handler ");
        registry.addHandler(examRoomWebsocket,"/examRoom")
                .setAllowedOrigins("*");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        //set here bufferSize
        container.setMaxTextMessageBufferSize(512000);
        container.setMaxBinaryMessageBufferSize(512000);
        container.setMaxSessionIdleTimeout(new Long(60 * 60 * 1000));
        return container;
    }

}
