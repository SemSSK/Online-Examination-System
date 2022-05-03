package com.example.SpringLogin.Socket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomMessage {
    static final String MESSAGE = "message",
    DATA = "data",
    BLOCKED = "blocked";
    String type;
    Object payload;
}
